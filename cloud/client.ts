import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";

type CloudConfig = { supabaseUrl?: string; supabaseAnonKey?: string; hcaptchaSiteKey?: string };
type ProfileRow = {
  id: string; email?: string | null; name?: string | null; first_name?: string | null;
  last_name?: string | null; phone_number?: string | null; image_url?: string | null;
  role?: "admin" | "user" | null; status?: "pending" | "active" | "suspended" | null;
  template_access?: "all" | "custom" | null; allowed_template_ids?: string[] | null;
  feature_access?: FeatureId[] | null; access_starts_at?: string | null; access_ends_at?: string | null;
  login_policy?: "single_browser_ip" | "unrestricted" | null; locked_browser_id?: string | null;
  locked_ip?: string | null; active_session_id?: string | null; last_login_at?: string | null;
};
type FeatureId = "bulkInvoiceGenerator" | "dataCleaning" | "manualDataCleaning" | "metadataRemover" | "pdfCompressor";
type UserRecord = {
  _id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  imageUrl?: string;
  role: "admin" | "user";
  status: "pending" | "active" | "suspended";
  templateAccess: "all" | "custom";
  allowedTemplateIds: string[];
  featureAccess?: FeatureId[];
  accessStartsAt?: number;
  accessEndsAt?: number;
  loginPolicy: "single_browser_ip" | "unrestricted";
  lockedBrowserId?: string;
  lockedIp?: string;
  activeSessionId?: string;
  lastLoginAt?: number;
};

declare global {
  interface Window {
    __INVOICE_CLOUD_CONFIG__?: CloudConfig;
    InvoiceCloud?: {
      saveStorage: (storageKey: string, value: unknown, activeTemplateId?: string, immediate?: boolean) => Promise<void> | void;
      currentUser?: UserRecord;
      ready?: boolean;
    };
    lucide?: { createIcons?: () => void };
    hcaptcha?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string | number;
      reset: (widgetId?: string | number) => void;
    };
  }
}

const storageKeys = [
  "mc011-invoice-editor-v1",
  "mc011-data-splitter-projects-v1",
  "mc011-supplier-profile-overrides-v1",
];
const ownerKey = "mc011-cloud-owner-v1";
const templateAccessKey = "mc011-template-access-v1";
const pendingProfileKey = "mc011-pending-signup-profile-v1";
const browserIdKey = "mc011-authorized-browser-id-v1";
const templateCatalog = [
  ["pound", "Pound Wholesale UK"], ["zoro", "Zoro USA"], ["gosupps", "GO SUPPS.COM"],
  ["tw", "T W Wholesale & Superstore"], ["vetuk", "VET UK Petcare"], ["pcsbooks", "PCS Books"],
  ["cosmetix", "Cosmetix Club"], ["costcouk", "Costco Wholesale UK"], ["qogitauk", "Qogita UK"],
  ["clearanceking", "Clearance King Ltd"], ["sunsky", "Sunsky Commercial Invoice"], ["justmae", "Justmae Limited"],
  ["jellycat", "Jellycat Order Invoice"], ["scrubdaddy", "Scrub Daddy Invoice"], ["bestway", "Bestway Wholesale"],
  ["paperstone", "Paperstone VAT Receipt"], ["mastertrade", "Mastertrade Supplies"],
  ["idealtrading", "Ideal Trading USA"], ["unfi", "UNFI Invoice"], ["bulkbuyamerica", "Bulk Buy America"],
  ["sephorausa", "Sephora USA"], ["perfumeunlimited", "Perfume Limited Tax Invoice"],
  ["porton", "Porton Garden Aquatic & Pets"], ["luxurysouq", "Luxury Souq (Watches)"],
  ["autodoc", "Auto Doc Invoice"], ["worldofbooks", "World of Books Paid Invoice"],
  ["walmart", "Walmart Order Invoice"],
] as const;
const featureCatalog: ReadonlyArray<[FeatureId, string, string]> = [
  ["bulkInvoiceGenerator", "Bulk Invoice Generator", "files"],
  ["dataCleaning", "Data Cleaning", "scan-search"],
  ["manualDataCleaning", "Manual Data Cleaning", "wand-sparkles"],
  ["metadataRemover", "Metadata Remover", "file-x-2"],
  ["pdfCompressor", "PDF Compressor", "file-archive"],
];
const featureViewMap: Record<FeatureId, string> = {
  bulkInvoiceGenerator: "bulk",
  dataCleaning: "auto-data-cleaning",
  manualDataCleaning: "data-cleaning",
  metadataRemover: "meta-remover",
  pdfCompressor: "pdf-compressor",
};
const cloudClientScriptUrl = (document.currentScript as HTMLScriptElement | null)?.src
  || new URL("./cloud/client.js", location.href).toString();
const editorEntryUrl = new URL("../index.html", cloudClientScriptUrl).toString();

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const config = window.__INVOICE_CLOUD_CONFIG__ || {};
const gate = document.getElementById("cloudAuthGate") as HTMLElement | null;
const gateContent = document.getElementById("cloudAuthContent") as HTMLElement | null;
const cloudStatus = document.getElementById("cloudConnectionStatus") as HTMLElement | null;
const publicSignIn = document.getElementById("publicSignIn") as HTMLAnchorElement | null;
const publicSignUp = document.getElementById("publicSignUp") as HTMLAnchorElement | null;
const saveTimers = new Map<string, number>();
let supabase: SupabaseClient | null = null;
let authUser: User | null = null;
let readyDispatched = false;
let authenticatedSessionDetected = false;
let loginAccessTimer = 0;
let hcaptchaLoader: Promise<void> | null = null;
const cloudRetryDelayMs = 350;

async function retryCloudResult<T extends { error: unknown }>(request: () => PromiseLike<T>): Promise<T> {
  const firstResult = await request();
  if (!firstResult.error) return firstResult;
  await new Promise((resolve) => window.setTimeout(resolve, cloudRetryDelayMs));
  return await request();
}

const cloudApi: NonNullable<Window["InvoiceCloud"]> = {
  saveStorage(storageKey, value, activeTemplateId, immediate = false) {
    if (!storageKeys.includes(storageKey) || !supabase || !authUser || !window.InvoiceCloud?.currentUser) return;
    window.clearTimeout(saveTimers.get(storageKey));
    if (immediate) {
      setCloudStatus("Saving…", "working");
      return uploadStorageValue(storageKey, value, activeTemplateId)
        .then(() => setCloudStatus("Saved to Supabase", "success"))
        .catch((error) => {
          setCloudStatus(messageFrom(error), "error");
          throw error;
        });
    }
    const timer = window.setTimeout(async () => {
      try {
        await uploadStorageValue(storageKey, value, activeTemplateId);
        setCloudStatus("Saved to Supabase", "success");
      } catch (error) {
        setCloudStatus(messageFrom(error), "error");
      }
    }, 650);
    saveTimers.set(storageKey, timer);
    setCloudStatus("Saving…", "working");
  },
};
window.InvoiceCloud = cloudApi;

publicSignIn?.addEventListener("click", (event) => {
  if (!supabase) return;
  event.preventDefault();
  void openFreshAuthentication("signIn");
});
publicSignUp?.addEventListener("click", (event) => {
  if (!supabase) return;
  event.preventDefault();
  void openFreshAuthentication("signUp");
});
document.addEventListener("click", protectWorkspaceEntry, true);

void initialize();

async function initialize() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    unlockWorkspace();
    setCloudStatus("Cloud setup required", "error");
    console.warn("Supabase is not active until SUPABASE_URL and SUPABASE_ANON_KEY are configured.");
    return;
  }

  try {
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    const { data: sessionData, error: sessionError } = await retryCloudResult(() => supabase!.auth.getSession());
    if (sessionError) throw sessionError;
    const authenticatedSession = sessionData.session;
    const sessionUser = authenticatedSession?.user || null;
    authUser = sessionUser;
    supabase.auth.onAuthStateChange((_event, session) => {
      authUser = session?.user || null;
    });
    if (!sessionUser) {
      showPublicLanding();
      window.setTimeout(showPublicLanding, 0);
      unlockWorkspace();
      setCloudStatus("Sign in to sync", "working");
      const requestedMode = requestedAuthenticationMode();
      if (requestedMode) {
        lockWorkspace();
        renderAuthentication(requestedMode);
      }
      return;
    }

    authenticatedSessionDetected = true;
    if (isPasswordRecoveryRequest()) {
      renderPasswordRecovery();
      lockWorkspace();
      return;
    }
    if (!authenticatedSession) throw new Error("Your Supabase login session is unavailable.");
    await enforceLoginAccess(authenticatedSession);
    // Keep a stable copy of the authenticated user while Supabase emits its
    // initial auth-state event. That event can briefly provide a null session.
    authUser = sessionUser;
    const primaryEmail = sessionUser.email || "";
    const pendingProfile = readPendingProfile();
    const existingUser = await loadCurrentUser(sessionUser.id);
    const firstName = String(sessionUser.user_metadata?.first_name || pendingProfile?.firstName || existingUser?.firstName || "");
    const lastName = String(sessionUser.user_metadata?.last_name || pendingProfile?.lastName || existingUser?.lastName || "");
    const phoneNumber = String(sessionUser.user_metadata?.phone_number || pendingProfile?.phoneNumber || existingUser?.phoneNumber || "");
    const displayName = String(sessionUser.user_metadata?.full_name || [firstName, lastName].filter(Boolean).join(" ") || existingUser?.name || primaryEmail.split("@")[0] || "Invoice user");
    if (!firstName || !lastName || !phoneNumber) {
      renderRequiredProfile(primaryEmail, { firstName, lastName, phoneNumber });
      lockWorkspace();
      return;
    }
    const { error: ensureError } = await retryCloudResult(() => supabase!.rpc("ensure_current_user", {
      p_name: displayName,
      p_first_name: firstName || null,
      p_last_name: lastName || null,
      p_phone_number: phoneNumber || null,
      p_image_url: String(sessionUser.user_metadata?.avatar_url || "") || null,
    }));
    if (ensureError && !existingUser) throw ensureError;
    if (ensureError) console.warn("Supabase profile refresh was deferred.", messageFrom(ensureError));
    sessionStorage.removeItem(pendingProfileKey);
    let user: UserRecord | null = null;
    try {
      user = await loadCurrentUser(sessionUser.id);
    } catch (profileRefreshError) {
      if (!existingUser) throw profileRefreshError;
      console.warn("Using the verified cached profile after a refresh-time Supabase error.", messageFrom(profileRefreshError));
      user = existingUser;
    }
    if (!user) throw new Error("Your Supabase profile could not be loaded.");
    user.featureAccess = normalizedFeatures(user);
    cloudApi.currentUser = user;
    mountIdentity(user);
    applyAdminVisibility(user);
    applyFeatureVisibility(user);

    if (user.status !== "active") {
      signalReady();
      if (user.status === "pending") renderPendingApproval();
      else renderGate("Account suspended", "An administrator has suspended this workspace. Contact the site owner to restore access.", true);
      return;
    }
    const accessWindow = getAccessWindowState(user);
    if (accessWindow === "expired") {
      signalReady();
      renderGate("Access renewal required", "Your approved access period has ended. Please contact the administrator to renew your workspace access.", true);
      return;
    }
    if (accessWindow === "scheduled") {
      signalReady();
      renderGate("Access is scheduled", `Your workspace access begins on ${formatAccessDate(user.accessStartsAt)}.`, true);
      return;
    }
    if (user.role !== "admin" && user.templateAccess === "custom" && user.allowedTemplateIds.length === 0 && user.featureAccess.length === 0) {
      signalReady();
      renderGate("No templates assigned", "Your account is active, but an administrator has not assigned any invoice templates yet.", true);
      return;
    }

    let hydrationDeferred = false;
    try {
      await hydrateUserData(user);
    } catch (hydrationError) {
      hydrationDeferred = true;
      console.warn("Workspace opened with local data while Supabase synchronization recovers.", messageFrom(hydrationError));
    }
    if (user.role === "admin") await initializeAdminPanel();
    startLoginAccessMonitor();
    unlockWorkspace();
    openAuthorizedWorkspace();
    history.replaceState(null, "", `${location.pathname}${location.search}#tool`);
    setCloudStatus(hydrationDeferred ? "Workspace ready — cloud sync temporarily delayed" : "Connected to Supabase", hydrationDeferred ? "working" : "success");
  } catch (error) {
    console.error(error);
    signalReady();
    if (authenticatedSessionDetected) {
      renderGate("Unable to open the cloud workspace", messageFrom(error), true);
    } else {
      showPublicLanding();
      unlockWorkspace();
      setCloudStatus(messageFrom(error), "error");
    }
  }
}

function showPublicLanding() {
  document.body.classList.remove("tool-open", "dashboard-light");
  document.getElementById("toolPage")?.classList.add("is-hidden");
  document.getElementById("landingPage")?.classList.remove("is-hidden");
  if (location.hash === "#tool") history.replaceState(null, "", location.pathname + location.search);
}

function openAuthorizedWorkspace() {
  document.body.classList.add("tool-open", "dashboard-light");
  document.getElementById("landingPage")?.classList.add("is-hidden");
  document.getElementById("toolPage")?.classList.remove("is-hidden");
  unlockWorkspace();
}

function protectWorkspaceEntry(event: MouseEvent) {
  const target = event.target as Element | null;
  const trigger = target?.closest("[data-open-tool]");
  if (!trigger || window.InvoiceCloud?.currentUser?.status === "active") return;
  event.preventDefault();
  event.stopImmediatePropagation();
  void startAuthentication("signIn");
}

async function startAuthentication(mode: "signIn" | "signUp") {
  if (!supabase) {
    renderGate("Preparing secure sign in", "Connecting to the account service. Please try again in a moment.");
    lockWorkspace();
    return;
  }
  lockWorkspace();
  renderAuthentication(mode);
}

function getWorkspaceRedirectUrl() {
  const returnLocation = new URL(editorEntryUrl);
  returnLocation.search = "";
  returnLocation.searchParams.set("auth", "workspace");
  returnLocation.hash = "tool";
  return returnLocation.toString();
}

function getPasswordRecoveryRedirectUrl() {
  const returnLocation = new URL(editorEntryUrl);
  returnLocation.search = "";
  returnLocation.searchParams.set("auth", "recovery");
  returnLocation.hash = "";
  return returnLocation.toString();
}

function isPasswordRecoveryRequest() {
  const url = new URL(location.href);
  return url.searchParams.get("auth")?.toLowerCase() === "recovery" || /(?:^|&)type=recovery(?:&|$)/.test(url.hash.replace(/^#/, ""));
}

function requestedAuthenticationMode(): "signIn" | "signUp" | null {
  const value = new URL(location.href).searchParams.get("auth")?.toLowerCase();
  if (value === "signin" || value === "sign-in") return "signIn";
  if (value === "signup" || value === "sign-up") return "signUp";
  return null;
}

function clearAuthenticationRequest() {
  const url = new URL(location.href);
  url.searchParams.delete("auth");
  url.hash = "";
  history.replaceState(null, "", `${url.pathname}${url.search}`);
}

async function openFreshAuthentication(mode: "signIn" | "signUp") {
  if (authUser) await supabase?.auth.signOut({ scope: "local" });
  await startAuthentication(mode);
}

function toUserRecord(row: ProfileRow): UserRecord {
  return {
    _id: String(row.id),
    email: String(row.email || ""),
    name: String(row.name || "Invoice user"),
    firstName: row.first_name || undefined,
    lastName: row.last_name || undefined,
    phoneNumber: row.phone_number || undefined,
    imageUrl: row.image_url || undefined,
    role: row.role === "admin" ? "admin" : "user",
    status: row.status === "active" || row.status === "suspended" ? row.status : "pending",
    templateAccess: row.template_access === "all" ? "all" : "custom",
    allowedTemplateIds: Array.isArray(row.allowed_template_ids) ? row.allowed_template_ids : [],
    featureAccess: Array.isArray(row.feature_access) ? row.feature_access : [],
    accessStartsAt: row.access_starts_at ? new Date(row.access_starts_at).getTime() : undefined,
    accessEndsAt: row.access_ends_at ? new Date(row.access_ends_at).getTime() : undefined,
    loginPolicy: row.login_policy === "unrestricted" ? "unrestricted" : "single_browser_ip",
    lockedBrowserId: row.locked_browser_id || undefined,
    lockedIp: row.locked_ip || undefined,
    activeSessionId: row.active_session_id || undefined,
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at).getTime() : undefined,
  };
}

function createBrowserId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function currentBrowserId() {
  let value = localStorage.getItem(browserIdKey) || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    value = createBrowserId();
    localStorage.setItem(browserIdKey, value);
  }
  return value;
}

async function enforceLoginAccess(session: Session) {
  if (!supabase) throw new Error("The secure login service is unavailable.");
  const { data, error } = await retryCloudResult(() => supabase!.functions.invoke("login-access", {
    body: { browserId: currentBrowserId() },
    headers: { Authorization: `Bearer ${session.access_token}` },
  }));
  if (error) throw new Error("The secure browser/IP check could not be completed. Please try again.");
  if (!data?.allowed) {
    await supabase.auth.signOut({ scope: "local" });
    throw new Error(String(data?.reason || "This account is not authorized on this browser or IP address."));
  }
}

function startLoginAccessMonitor() {
  window.clearInterval(loginAccessTimer);
  loginAccessTimer = window.setInterval(async () => {
    if (!supabase || !authUser) return;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) throw error || new Error("Your login session expired.");
      await enforceLoginAccess(data.session);
    } catch (error) {
      window.clearInterval(loginAccessTimer);
      renderGate("Login access changed", messageFrom(error), true);
      lockWorkspace();
    }
  }, 120000);
}

async function loadCurrentUser(userId = authUser?.id): Promise<UserRecord | null> {
  if (!supabase || !userId) return null;
  const { data, error } = await retryCloudResult(() => supabase!.from("profiles").select("*").eq("id", userId).maybeSingle());
  if (error) throw error;
  return data ? toUserRecord(data) : null;
}

async function uploadStorageValue(storageKey: string, value: unknown, activeTemplateId?: string) {
  if (!supabase || !authUser) throw new Error("Cloud session is unavailable.");
  const content = JSON.stringify(value ?? null);
  const { error } = await supabase.from("user_data").upsert({
    user_id: authUser.id,
    storage_key: storageKey,
    payload: value ?? null,
    byte_length: new Blob([content]).size,
    active_template_id: activeTemplateId || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,storage_key" });
  if (error) throw error;
}

async function hydrateUserData(user: UserRecord) {
  if (!supabase || !authUser) throw new Error("Cloud session is unavailable.");
  const subject = authUser.id;
  const previousOwner = localStorage.getItem(ownerKey);
  if (previousOwner && previousOwner !== subject) {
    storageKeys.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(templateAccessKey);
  }
  localStorage.setItem(ownerKey, subject);

  const { data: rows, error } = await retryCloudResult(() => supabase!.from("user_data").select("storage_key,payload").eq("user_id", authUser!.id));
  if (error) throw error;
  const serverData = new Map<string, unknown>();
  for (const row of rows || []) {
    serverData.set(row.storage_key, row.payload);
  }
  const mayMigrateLocalData = !previousOwner || previousOwner === subject;

  if ((rows || []).length === 0 && mayMigrateLocalData) {
    for (const storageKey of storageKeys) {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;
      let value: unknown;
      try { value = JSON.parse(raw); } catch { value = raw; }
      const activeTemplateId = storageKey === storageKeys[0] && isObjectRecord(value) && isObjectRecord(value.current)
        ? String(value.current.templateId || "") || undefined
        : undefined;
      if (activeTemplateId && !isTemplateAllowed(user, activeTemplateId)) continue;
      await uploadStorageValue(storageKey, value, activeTemplateId);
    }
  }

  let changed = false;
  for (const storageKey of storageKeys) {
    if (!serverData.has(storageKey)) continue;
    const serialized = JSON.stringify(serverData.get(storageKey));
    if (localStorage.getItem(storageKey) !== serialized) {
      localStorage.setItem(storageKey, serialized);
      changed = true;
    }
  }

  const access = JSON.stringify({
    role: user.role,
    mode: user.templateAccess,
    allowedTemplateIds: user.allowedTemplateIds,
  });
  if (localStorage.getItem(templateAccessKey) !== access) {
    localStorage.setItem(templateAccessKey, access);
    changed = true;
  }
  return changed;
}

function isTemplateAllowed(user: UserRecord, templateId: string) {
  return user.role === "admin" || user.templateAccess === "all" || user.allowedTemplateIds.includes(templateId);
}

function mountIdentity(user: UserRecord) {
  const firstName = String(authUser?.user_metadata?.first_name || user.firstName || user.name.split(/\s+/).filter(Boolean)[0] || "User");
  const lastName = String(authUser?.user_metadata?.last_name || user.lastName || "");
  const fullName = String(authUser?.user_metadata?.full_name || [firstName, lastName].filter(Boolean).join(" ") || user.name || "User");
  const avatarUrl = String(authUser?.user_metadata?.avatar_url || user.imageUrl || "");
  document.querySelectorAll<HTMLElement>("[data-user-first-name]").forEach((node) => { node.textContent = fullName; });
  const welcome = document.getElementById("dashboard-welcome-title");
  if (welcome) welcome.textContent = `Welcome back, ${fullName}`;
  document.querySelectorAll<HTMLElement>("[data-user-role]").forEach((node) => {
    node.textContent = user.role === "admin" ? "Administrator" : "Authorized User";
  });
  document.querySelectorAll<HTMLElement>("[data-user-avatar]").forEach((node) => {
    node.textContent = initials(fullName);
    node.classList.toggle("has-profile-image", Boolean(avatarUrl));
    if (avatarUrl) node.style.setProperty("background-image", `url(${JSON.stringify(avatarUrl)})`, "important");
    else node.style.removeProperty("background-image");
  });

  const profileButton = document.getElementById("studioProfileButton");
  if (profileButton && !profileButton.dataset.profileBound) {
    profileButton.dataset.profileBound = "true";
    profileButton.addEventListener("click", openProfileEditor);
  }

  const logout = document.getElementById("backToWebsite");
  if (logout && !logout.dataset.logoutBound) {
    logout.dataset.logoutBound = "true";
    logout.addEventListener("click", async (event) => {
      event.preventDefault();
      await supabase?.auth.signOut({ scope: "local" });
      location.assign(location.origin + location.pathname);
    }, { capture: true });
  }
}

function openProfileEditor() {
  if (!supabase || !authUser || !cloudApi.currentUser) return;
  document.getElementById("studioProfileEditor")?.remove();
  const firstName = String(authUser.user_metadata?.first_name || cloudApi.currentUser.firstName || "");
  const lastName = String(authUser.user_metadata?.last_name || cloudApi.currentUser.lastName || "");
  const imageUrl = String(authUser.user_metadata?.avatar_url || cloudApi.currentUser.imageUrl || "");
  const overlay = document.createElement("div");
  overlay.id = "studioProfileEditor";
  overlay.className = "studio-profile-editor";
  overlay.innerHTML = `<section class="studio-profile-editor-card" role="dialog" aria-modal="true" aria-labelledby="studioProfileEditorTitle">
    <header>
      <div><span>Account profile</span><h2 id="studioProfileEditorTitle">Edit your details</h2></div>
      <button type="button" class="studio-profile-editor-close" data-profile-close aria-label="Close"><i data-lucide="x"></i></button>
    </header>
    <form id="studioProfileForm">
      <div class="studio-profile-photo-row">
        <span class="studio-profile-photo-preview${imageUrl ? " has-profile-image" : ""}" data-profile-preview style="${imageUrl ? `background-image:url(${JSON.stringify(imageUrl)})` : ""}">${escapeHtml(initials(firstName || cloudApi.currentUser.name))}</span>
        <label class="studio-profile-photo-action">Change picture<input name="profileImage" type="file" accept="image/png,image/jpeg,image/webp,image/gif" /></label>
      </div>
      <div class="studio-profile-name-grid">
        <label>First name<input name="firstName" type="text" value="${escapeHtml(firstName)}" autocomplete="given-name" required /></label>
        <label>Last name<input name="lastName" type="text" value="${escapeHtml(lastName)}" autocomplete="family-name" required /></label>
      </div>
      <p class="studio-profile-editor-status" id="studioProfileEditorStatus" role="status"></p>
      <footer><button type="button" class="btn ghost" data-profile-close>Cancel</button><button type="submit" class="btn primary">Save changes</button></footer>
    </form>
  </section>`;
  document.body.appendChild(overlay);
  const initialPreview = overlay.querySelector<HTMLElement>("[data-profile-preview]");
  if (imageUrl && initialPreview) initialPreview.style.setProperty("background-image", `url(${JSON.stringify(imageUrl)})`, "important");
  window.lucide?.createIcons?.();
  const close = () => overlay.remove();
  overlay.querySelectorAll("[data-profile-close]").forEach((button) => button.addEventListener("click", close));
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  const imageInput = overlay.querySelector<HTMLInputElement>('input[name="profileImage"]');
  imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    const preview = overlay.querySelector<HTMLElement>("[data-profile-preview]");
    if (!file || !preview) return;
    preview.style.setProperty("background-image", `url(${JSON.stringify(URL.createObjectURL(file))})`, "important");
    preview.classList.add("has-profile-image");
  });
  overlay.querySelector<HTMLFormElement>("#studioProfileForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabase || !authUser || !cloudApi.currentUser) return;
    const form = event.currentTarget as HTMLFormElement;
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status = form.querySelector<HTMLElement>("#studioProfileEditorStatus");
    const data = new FormData(form);
    const nextFirstName = String(data.get("firstName") || "").trim();
    const nextLastName = String(data.get("lastName") || "").trim();
    const profileImage = data.get("profileImage");
    if (!nextFirstName || !nextLastName) return;
    if (submit) { submit.disabled = true; submit.textContent = "Saving…"; }
    if (status) status.textContent = "";
    try {
      let nextImageUrl = imageUrl;
      if (profileImage instanceof File && profileImage.size > 0) {
        const extension = profileImage.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `${authUser.id}/profile-${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("avatars").upload(path, profileImage, { upsert: true });
        if (uploadError) throw uploadError;
        nextImageUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }
      const updatedName = `${nextFirstName} ${nextLastName}`.trim();
      const { data: updatedAuth, error: authError } = await supabase.auth.updateUser({ data: {
        first_name: nextFirstName,
        last_name: nextLastName,
        full_name: updatedName,
        avatar_url: nextImageUrl || null,
      } });
      if (authError) throw authError;
      authUser = updatedAuth.user;
      const { error: profileError } = await supabase.rpc("ensure_current_user", {
        p_name: updatedName,
        p_first_name: nextFirstName,
        p_last_name: nextLastName,
        p_phone_number: cloudApi.currentUser.phoneNumber || null,
        p_image_url: nextImageUrl || null,
      });
      if (profileError) throw profileError;
      cloudApi.currentUser = { ...cloudApi.currentUser, name: updatedName, firstName: nextFirstName, lastName: nextLastName, imageUrl: nextImageUrl || cloudApi.currentUser.imageUrl };
      mountIdentity(cloudApi.currentUser);
      close();
    } catch (error) {
      if (status) status.textContent = messageFrom(error);
      if (submit) { submit.disabled = false; submit.textContent = "Save changes"; }
    }
  });
  overlay.querySelector<HTMLInputElement>('input[name="firstName"]')?.focus();
}

function applyAdminVisibility(user: UserRecord) {
  const isAdmin = user.role === "admin" && user.status === "active" && getAccessWindowState(user) === "active";
  const nav = document.getElementById("adminNavItem");
  const panel = document.getElementById("admin");
  if (nav) nav.hidden = !isAdmin;
  if (panel) panel.hidden = !isAdmin;

  if (!isAdmin && panel?.classList.contains("is-visible")) {
    panel.classList.remove("is-visible");
    document.getElementById("dashboard")?.classList.add("is-visible");
    document.querySelectorAll<HTMLElement>("[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === "dashboard");
    });
  }
}

function applyFeatureVisibility(user: UserRecord) {
  if (user.role === "admin") return;
  const allowedViews = new Set(normalizedFeatures(user).map((feature) => featureViewMap[feature]));
  Object.values(featureViewMap).forEach((view) => {
    document.querySelectorAll<HTMLElement>(`[data-view="${view}"]`).forEach((node) => { node.hidden = !allowedViews.has(view); });
    const panel = document.getElementById(view);
    if (panel) panel.hidden = !allowedViews.has(view);
  });
}

async function initializeAdminPanel() {
  const nav = document.getElementById("adminNavItem");
  const panel = document.getElementById("admin");
  if (nav) nav.hidden = false;
  if (panel) panel.hidden = false;
  await renderAdminUsers();
  document.getElementById("refreshAdminUsers")?.addEventListener("click", () => void renderAdminUsers());
  document.getElementById("adminUserSearch")?.addEventListener("input", filterAdminDirectory);
  document.getElementById("adminStatusFilter")?.addEventListener("change", filterAdminDirectory);
}

function filterAdminDirectory() {
  const query = String((document.getElementById("adminUserSearch") as HTMLInputElement | null)?.value || "").trim().toLowerCase();
  const status = String((document.getElementById("adminStatusFilter") as HTMLSelectElement | null)?.value || "all");
  const cards = Array.from(document.querySelectorAll<HTMLFormElement>("#adminUsers [data-admin-user]"));
  let visible = 0;
  cards.forEach((card) => {
    const matchesQuery = !query || String(card.dataset.adminSearch || "").includes(query);
    const matchesStatus = status === "all" || card.dataset.adminState === status;
    card.hidden = !(matchesQuery && matchesStatus);
    if (!card.hidden) visible += 1;
  });
  const summary = document.getElementById("adminFilterSummary");
  if (summary) summary.textContent = `Showing ${visible} of ${cards.length} customer${cards.length === 1 ? "" : "s"}`;
  const empty = document.getElementById("adminNoResults");
  if (empty) empty.hidden = cards.length === 0 || visible !== 0;
}

async function renderAdminUsers() {
  const target = document.getElementById("adminUsers");
  if (!target) return;
  target.innerHTML = '<div class="cloud-loading-row">Loading users from Supabase…</div>';
  try {
    if (!supabase) throw new Error("Supabase is unavailable.");
    const { data: profileRows, error: listError } = await supabase.from("profiles").select("*");
    if (listError) throw listError;
    const users = (profileRows || []).map(toUserRecord);
    const now = Date.now();
    const activeUsers = users.filter((user) => user.status === "active" && (!user.accessStartsAt || user.accessStartsAt <= now) && (!user.accessEndsAt || user.accessEndsAt >= now));
    setText("adminUserCount", users.length);
    setText("adminActiveCount", activeUsers.length);
    setText("adminRenewalCount", users.length - activeUsers.length);
    setText("adminLinkedCount", users.filter((user) => Boolean(user.lockedBrowserId)).length);
    target.innerHTML = users
      .sort((a, b) => accessSortRank(a) - accessSortRank(b) || a.name.localeCompare(b.name))
      .map((user) => adminUserMarkup(user))
      .join("");
    window.lucide?.createIcons?.();
    filterAdminDirectory();
    target.querySelectorAll<HTMLFormElement>("[data-admin-user]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
        const status = form.querySelector<HTMLElement>("[data-admin-save-status]");
        if (status) { status.textContent = ""; status.dataset.state = ""; }
        if (button) { button.disabled = true; button.textContent = "Saving…"; }
        try {
          const start = dateArgument("accessStartsAt", data.get("accessStartDate"), false).accessStartsAt;
          const end = dateArgument("accessEndsAt", data.get("accessEndDate"), true).accessEndsAt;
          const { error: updateError } = await supabase!.rpc("admin_update_user_access", {
            p_user_id: form.dataset.adminUser,
            p_role: data.get("role"),
            p_status: data.get("status"),
            p_template_access: data.get("templateAccess"),
            p_allowed_template_ids: data.getAll("templates"),
            p_feature_access: data.getAll("features"),
            p_access_starts_at: start ? new Date(start).toISOString() : null,
            p_access_ends_at: end ? new Date(end).toISOString() : null,
            p_login_policy: data.get("loginPolicy"),
            p_authorized_ip: String(data.get("authorizedIp") || "").trim() || null,
            p_reset_login_lock: data.get("resetLoginLock") === "on",
          });
          if (updateError) throw updateError;
          setCloudStatus("User permissions updated", "success");
          await renderAdminUsers();
        } catch (error) {
          if (status) {
            status.textContent = messageFrom(error);
            status.dataset.state = "error";
          }
          if (button) { button.disabled = false; button.textContent = "Save access"; }
        }
      });
    });
  } catch (error) {
    target.innerHTML = `<div class="cloud-error-row">${escapeHtml(messageFrom(error))}</div>`;
    const summary = document.getElementById("adminFilterSummary");
    if (summary) summary.textContent = "Customer accounts could not be loaded";
  }
}

function adminUserMarkup(user: UserRecord) {
  const features = normalizedFeatures(user);
  const featureChecks = featureCatalog.map(([id, name, icon]) => `
    <label class="cloud-feature-check">
      <input type="checkbox" name="features" value="${id}" ${features.includes(id) ? "checked" : ""} />
      <span class="cloud-permission-icon" aria-hidden="true"><i data-lucide="${icon}"></i></span>
      <span>${escapeHtml(name)}</span>
      <span class="cloud-feature-choice" aria-hidden="true"><i data-lucide="check"></i></span>
    </label>`).join("");
  const checks = templateCatalog.map(([id, name]) => `
    <label class="cloud-template-check">
      <input type="checkbox" name="templates" value="${id}" ${user.allowedTemplateIds.includes(id) ? "checked" : ""} />
      <span class="cloud-template-glyph" aria-hidden="true"><i data-lucide="file-text"></i></span>
      <span class="cloud-template-name">${escapeHtml(name)}</span>
      <span class="cloud-template-choice" aria-hidden="true"><i data-lucide="check"></i></span>
    </label>`).join("");
  const accessState = getAccessWindowState(user);
  const statusLabel = accessState === "expired" ? "Renewal due" : accessState === "scheduled" ? "Scheduled" : user.status;
  const filterState = accessState === "expired" ? "renewal" : accessState === "scheduled" ? "pending" : user.status;
  const searchText = `${user.name} ${user.email} ${user.phoneNumber || ""} ${user.lockedIp || ""}`.toLowerCase();
  return `
    <form class="cloud-user-card" data-admin-user="${escapeHtml(user._id)}" data-admin-state="${filterState}" data-admin-search="${escapeHtml(searchText)}">
      <details class="cloud-user-directory-row">
        <summary>
          <span class="cloud-avatar">${escapeHtml(initials(user.name))}</span>
          <span class="cloud-user-identity"><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.email)}</small></span>
          <span class="cloud-user-contact"><small>Phone</small><strong>${escapeHtml(user.phoneNumber || "Not provided")}</strong></span>
          <span class="cloud-user-date"><small>Start date</small><strong>${formatAccessDate(user.accessStartsAt, "Not set")}</strong></span>
          <span class="cloud-user-date"><small>End date</small><strong>${formatAccessDate(user.accessEndsAt, "No expiry")}</strong></span>
          <span class="cloud-status ${accessState === "expired" ? "expired" : user.status}">${escapeHtml(statusLabel)}</span>
          <span class="cloud-directory-chevron" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
        </summary>
        <div class="cloud-user-access-panel">
          <div class="cloud-access-heading"><div><span class="cloud-permission-step">01</span><div><strong>User access details</strong><small>Set the account state, role, and access period.</small></div></div></div>
          <div class="cloud-access-grid">
            <div class="cloud-status-field"><span>Account status</span><div class="cloud-status-options" role="radiogroup" aria-label="Account status"><label class="pending"><input type="radio" name="status" value="pending" ${user.status === "pending" ? "checked" : ""} /><span>Pending</span></label><label class="active"><input type="radio" name="status" value="active" ${user.status === "active" ? "checked" : ""} /><span>Active</span></label><label class="suspended"><input type="radio" name="status" value="suspended" ${user.status === "suspended" ? "checked" : ""} /><span>Suspended</span></label></div></div>
            <label>Role<select name="role"><option value="user" ${selected(user.role, "user")}>User</option><option value="admin" ${selected(user.role, "admin")}>Administrator</option></select></label>
            <label>Start date<input name="accessStartDate" type="date" value="${dateInputValue(user.accessStartsAt)}" /></label>
            <label>End date<input name="accessEndDate" type="date" value="${dateInputValue(user.accessEndsAt)}" /></label>
          </div>
          <section class="cloud-permission-section" aria-label="Feature access">
            <div class="cloud-permission-heading"><div><span class="cloud-permission-step">02</span><strong>Feature access</strong></div><small>${features.length} of ${featureCatalog.length} enabled</small></div>
            <div class="cloud-feature-grid">${featureChecks}</div>
          </section>
          <section class="cloud-permission-section" aria-label="Template access">
            <div class="cloud-permission-heading"><div><span class="cloud-permission-step">03</span><strong>Invoice templates</strong></div><label class="cloud-template-mode">Access<select name="templateAccess"><option value="custom" ${selected(user.templateAccess, "custom")}>Selected</option><option value="all" ${selected(user.templateAccess, "all")}>All templates</option></select></label></div>
            <div class="cloud-template-grid">${checks}</div>
          </section>
          <section class="cloud-permission-section cloud-login-security" aria-label="Browser and IP access">
            <div class="cloud-permission-heading"><div><span class="cloud-permission-step">04</span><strong>Browser &amp; IP security</strong></div><small class="cloud-security-verification ${user.lastLoginAt ? "is-verified" : "is-unverified"}"><i data-lucide="${user.lastLoginAt ? "shield-check" : "shield-alert"}" aria-hidden="true"></i>${user.lastLoginAt ? `Last verified ${escapeHtml(formatAccessDate(user.lastLoginAt))}` : "Not yet verified"}</small></div>
            <div class="cloud-login-security-grid">
              <label>Login rule<select name="loginPolicy"><option value="single_browser_ip" ${selected(user.loginPolicy, "single_browser_ip")}>One browser + one IP</option><option value="unrestricted" ${selected(user.loginPolicy, "unrestricted")}>Any browser / IP</option></select></label>
              <label>Authorized IP<input name="authorizedIp" inputmode="text" autocomplete="off" placeholder="Auto-lock on first login" value="${escapeHtml(user.lockedIp || "")}" /><small>Leave empty to capture the customer’s IP on their next login.</small></label>
              <div class="cloud-login-lock-state"><span>Browser lock</span><strong>${user.lockedBrowserId ? "Linked" : "Not linked"}</strong><small>${user.lockedBrowserId ? "Reset to authorize a different Chrome/browser." : "The next approved login will link this browser."}</small></div>
              <label class="cloud-reset-login-lock"><input type="checkbox" name="resetLoginLock" /><span><strong>Reset browser/IP lock</strong><small>Signs out the current protected session and allows the next approved browser to link.</small></span></label>
            </div>
          </section>
          <footer><div class="cloud-access-save-message"><span>Changes apply the next time this user opens the workspace.</span><strong data-admin-save-status role="alert"></strong></div><button class="btn primary" type="submit">Save access</button></footer>
        </div>
      </details>
    </form>`;
}

function normalizedFeatures(user: UserRecord): FeatureId[] {
  if (user.role === "admin") return featureCatalog.map(([id]) => id);
  return user.featureAccess || [];
}

function getAccessWindowState(user: UserRecord): "active" | "scheduled" | "expired" {
  const now = Date.now();
  if (user.accessStartsAt && now < user.accessStartsAt) return "scheduled";
  if (user.accessEndsAt && now > user.accessEndsAt) return "expired";
  return "active";
}

function accessSortRank(user: UserRecord) {
  if (user.status === "pending") return 0;
  if (getAccessWindowState(user) === "expired") return 1;
  if (user.status === "active") return 2;
  return 3;
}

function dateInputValue(value?: number) {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatAccessDate(value?: number, fallback = "") {
  if (!value) return fallback;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(value);
}

function dateArgument(key: "accessStartsAt" | "accessEndsAt", value: FormDataEntryValue | null, endOfDay: boolean) {
  const date = String(value || "").trim();
  if (!date) return { [key]: null };
  return { [key]: new Date(`${date}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`).getTime() };
}

function setText(id: string, value: string | number) {
  const node = document.getElementById(id);
  if (node) node.textContent = String(value);
}

function captchaMarkup() {
  return `<div class="invoice-captcha" data-hcaptcha><span>Loading security check…</span></div>`;
}

function loadHcaptcha() {
  if (window.hcaptcha) return Promise.resolve();
  if (hcaptchaLoader) return hcaptchaLoader;
  const loader = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("invoiceHcaptchaScript") as HTMLScriptElement | null;
    const script = existing || document.createElement("script");
    const finish = () => window.hcaptcha ? resolve() : reject(new Error("The CAPTCHA service did not become ready."));
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", () => reject(new Error("CAPTCHA could not load. Check your connection and try again.")), { once: true });
    if (!existing) {
      script.id = "invoiceHcaptchaScript";
      script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
  hcaptchaLoader = loader.catch((error) => {
    hcaptchaLoader = null;
    throw error;
  });
  return hcaptchaLoader;
}

async function mountCaptcha(form: HTMLFormElement | null) {
  const container = form?.querySelector<HTMLElement>("[data-hcaptcha]");
  if (!form || !container) return;
  if (!config.hcaptchaSiteKey) {
    showAuthError(new Error("CAPTCHA is not configured. Please contact support."));
    return;
  }
  try {
    await loadHcaptcha();
    if (!container.isConnected || !window.hcaptcha || container.dataset.widgetId) return;
    container.textContent = "";
    const widgetId = window.hcaptcha.render(container, {
      sitekey: config.hcaptchaSiteKey,
      callback: (token: string) => {
        form.dataset.captchaToken = token;
        hideAuthError();
      },
      "expired-callback": () => { delete form.dataset.captchaToken; },
      "error-callback": () => {
        delete form.dataset.captchaToken;
        showAuthError(new Error("CAPTCHA verification failed. Please try again."));
      },
    });
    container.dataset.widgetId = String(widgetId);
  } catch (error) {
    container.innerHTML = `<span class="invoice-captcha-failed">CAPTCHA unavailable</span>`;
    showAuthError(error);
  }
}

function captchaTokenFor(form: HTMLFormElement) {
  const token = String(form.dataset.captchaToken || "").trim();
  if (!token) showAuthError(new Error("Complete the CAPTCHA security check before continuing."));
  return token || null;
}

function resetCaptcha(form: HTMLFormElement) {
  delete form.dataset.captchaToken;
  const widgetId = form.querySelector<HTMLElement>("[data-hcaptcha]")?.dataset.widgetId;
  if (widgetId && window.hcaptcha) window.hcaptcha.reset(widgetId);
}

function renderAuthentication(mode: "signIn" | "signUp") {
  if (!gateContent || !supabase) return;
  unmountAuthentication();
  const isSignUp = mode === "signUp";
  gateContent.innerHTML = `
    <section class="invoice-auth-shell" aria-label="${isSignUp ? "Create an Invoice Maker Tool account" : "Sign in to Invoice Maker Tool"}">
      <aside class="invoice-auth-brand">
        <div class="invoice-auth-brand-lockup"><img class="invoice-auth-logo" src="../assets/invoice-tool-logo.png" alt="" /><strong>Invoice Maker Tool</strong></div>
        <div><span class="invoice-auth-eyebrow">SECURE INVOICE WORKSPACE</span><h2>${isSignUp ? "Start creating with confidence." : "Welcome back to your workspace."}</h2><p>Manage clients, templates, invoices, and exports from one protected account.</p></div>
        <ul><li>Private client and invoice data</li><li>Authorized supplier templates</li></ul>
      </aside>
      <div class="invoice-auth-panel">
        <button class="invoice-auth-close" id="invoiceAuthClose" type="button" aria-label="Close authentication">&times;</button>
        <span class="invoice-auth-eyebrow">${isSignUp ? "CREATE YOUR ACCOUNT" : "ACCOUNT ACCESS"}</span>
        <h1>${isSignUp ? "Create your Invoice Maker Tool account" : "Sign in to Invoice Maker Tool"}</h1>
        <p class="invoice-auth-intro">${isSignUp ? "Enter your required profile details before secure verification." : "Welcome back. Sign in to continue to your secure workspace."}</p>
        ${isSignUp ? signupProfileMarkup() : signInFormMarkup()}
        <p class="invoice-auth-switch">${isSignUp ? "Already have an account?" : "New to Invoice Maker Tool?"} <button type="button" id="invoiceAuthSwitch">${isSignUp ? "Sign in" : "Create an account"}</button></p>
      </div>
    </section>`;
  document.getElementById("invoiceAuthClose")?.addEventListener("click", closeAuthentication);
  document.getElementById("invoiceAuthSwitch")?.addEventListener("click", () => renderAuthentication(isSignUp ? "signIn" : "signUp"));
  const form = document.getElementById(isSignUp ? "invoiceSignupProfile" : "invoiceSignInForm") as HTMLFormElement | null;
  void mountCaptcha(form);
  if (isSignUp) form?.addEventListener("submit", continueSignup);
  else bindSignInForm();
}

function signInFormMarkup() {
  return `<form class="invoice-signup-profile invoice-signin-form" id="invoiceSignInForm">
    <button class="invoice-google-button" id="invoiceGoogleSignIn" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.25a4.49 4.49 0 0 1-1.95 2.94v2.26h3.16c1.85-1.7 2.89-4.21 2.89-6.84Z"/><path fill="#34A853" d="M12 21.75c2.64 0 4.86-.88 6.48-2.38l-3.16-2.26c-.88.59-2 .94-3.32.94-2.55 0-4.71-1.72-5.48-4.04H3.26v2.34A9.78 9.78 0 0 0 12 21.75Z"/><path fill="#FBBC05" d="M6.52 14a5.88 5.88 0 0 1 0-3.75V7.91H3.26a9.78 9.78 0 0 0 0 8.44L6.52 14Z"/><path fill="#EA4335" d="M12 6.21c1.44 0 2.73.49 3.75 1.46l2.81-2.81A9.42 9.42 0 0 0 3.26 7.91l3.26 2.34C7.29 7.93 9.45 6.21 12 6.21Z"/></svg><span>Continue with Google</span></button>
    <div class="invoice-auth-divider"><span>or sign in with email</span></div>
    <label>Email Address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com" /></label>
    <label>Password<input name="password" type="password" autocomplete="current-password" required placeholder="Enter your password" /></label>
    <div class="invoice-auth-forgot"><button type="button" id="invoiceForgotPassword">Forgot password?</button></div>
    ${captchaMarkup()}
    <div class="invoice-auth-error" id="invoiceAuthError" role="alert" hidden></div>
    <button class="btn primary invoice-auth-continue" type="submit">Sign in <span aria-hidden="true">&rarr;</span></button>
  </form>`;
}

function signupProfileMarkup() {
  const previous = readPendingProfile();
  return `<form class="invoice-signup-profile" id="invoiceSignupProfile">
    <div class="invoice-auth-field-row">
      <label>First Name<input name="firstName" autocomplete="given-name" required value="${escapeHtml(previous?.firstName || "")}" /></label>
      <label>Last Name<input name="lastName" autocomplete="family-name" required value="${escapeHtml(previous?.lastName || "")}" /></label>
    </div>
    <label>Email Address<input name="email" type="email" autocomplete="email" required value="${escapeHtml(previous?.email || "")}" /></label>
    <label>Phone Number<input name="phoneNumber" type="tel" autocomplete="tel" required placeholder="+44 7700 900000" value="${escapeHtml(previous?.phoneNumber || "")}" /></label>
    <label>Password<input name="password" type="password" autocomplete="new-password" minlength="8" required placeholder="Create a secure password" /></label>
    ${captchaMarkup()}
    <div class="invoice-auth-error" id="invoiceAuthError" role="alert" hidden></div>
    <button class="btn primary invoice-auth-continue" type="submit">Create account <span aria-hidden="true">&rarr;</span></button>
  </form>`;
}

function renderRequiredProfile(email: string, profile: { firstName?: string; lastName?: string; phoneNumber?: string }) {
  if (!gateContent) return;
  gateContent.innerHTML = `<section class="invoice-auth-shell" aria-label="Complete your Invoice Maker Tool profile">
    <aside class="invoice-auth-brand">
      <div class="invoice-auth-brand-lockup"><img class="invoice-auth-logo" src="../assets/invoice-tool-logo.png" alt="" /><strong>Invoice Maker Tool</strong></div>
      <div><span class="invoice-auth-eyebrow">ONE LAST STEP</span><h2>Complete your secure profile.</h2><p>These required details identify your account to the administrator who controls template access.</p></div>
      <ul><li>Private client and invoice data</li><li>Administrator-controlled access</li></ul>
    </aside>
    <div class="invoice-auth-panel">
      <span class="invoice-auth-eyebrow">REQUIRED PROFILE</span><h1>Complete your Invoice Maker Tool account</h1>
      <p class="invoice-auth-intro">Your secure sign-in is complete. Add the required contact details to request workspace access.</p>
      <form class="invoice-signup-profile" id="invoiceRequiredProfile">
        <div class="invoice-auth-field-row">
          <label>First Name<input name="firstName" autocomplete="given-name" required value="${escapeHtml(profile.firstName || "")}" /></label>
          <label>Last Name<input name="lastName" autocomplete="family-name" required value="${escapeHtml(profile.lastName || "")}" /></label>
        </div>
        <label>Email Address<input type="email" value="${escapeHtml(email)}" disabled /></label>
        <label>Phone Number<input name="phoneNumber" type="tel" autocomplete="tel" required placeholder="+44 7700 900000" value="${escapeHtml(profile.phoneNumber || "")}" /></label>
        <div class="invoice-auth-error" id="invoiceAuthError" role="alert" hidden></div>
        <button class="btn primary invoice-auth-continue" type="submit">Save and continue <span aria-hidden="true">&rarr;</span></button>
      </form>
      <p class="invoice-auth-switch"><button type="button" id="invoiceProfileSignOut">Use a different account</button></p>
    </div>
  </section>`;
  document.getElementById("invoiceRequiredProfile")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (!form.reportValidity() || !supabase) return;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const phoneNumber = String(data.get("phoneNumber") || "").trim();
    const fullName = `${firstName} ${lastName}`.trim();
    setAuthBusy(form, true, "Saving…");
    try {
      const { data: updated, error: authError } = await supabase.auth.updateUser({ data: {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        phone_number: phoneNumber,
      } });
      if (authError) throw authError;
      authUser = updated.user;
      const { error: profileError } = await supabase.rpc("ensure_current_user", {
        p_name: fullName,
        p_first_name: firstName,
        p_last_name: lastName,
        p_phone_number: phoneNumber,
        p_image_url: String(updated.user.user_metadata?.avatar_url || "") || null,
      });
      if (profileError) throw profileError;
      sessionStorage.removeItem(pendingProfileKey);
      location.assign(getWorkspaceRedirectUrl());
    } catch (error) {
      showAuthError(error);
      setAuthBusy(form, false);
    }
  });
  document.getElementById("invoiceProfileSignOut")?.addEventListener("click", async () => {
    await supabase?.auth.signOut({ scope: "local" });
    location.assign(location.origin + location.pathname);
  });
}

async function continueSignup(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const captchaToken = captchaTokenFor(form);
  if (!captchaToken) return;
  const data = new FormData(form);
  const profile = {
    firstName: String(data.get("firstName") || "").trim(),
    lastName: String(data.get("lastName") || "").trim(),
    email: String(data.get("email") || "").trim().toLowerCase(),
    phoneNumber: String(data.get("phoneNumber") || "").trim(),
  };
  sessionStorage.setItem(pendingProfileKey, JSON.stringify(profile));
  setAuthBusy(form, true, "Creating account…");
  try {
    if (!supabase) throw new Error("The account service is not ready. Please try again.");
    const { data: result, error } = await supabase.auth.signUp({
      email: profile.email,
      password: String(data.get("password") || ""),
      options: {
        captchaToken,
        emailRedirectTo: getWorkspaceRedirectUrl(),
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          full_name: `${profile.firstName} ${profile.lastName}`.trim(),
          phone_number: profile.phoneNumber,
        },
      },
    });
    if (error) throw error;
    if (result.session) {
      location.assign(getWorkspaceRedirectUrl());
      return;
    }
    renderEmailVerification(profile.email);
  } catch (error) {
    resetCaptcha(form);
    showAuthError(error);
    setAuthBusy(form, false);
  }
}

function bindSignInForm() {
  const form = document.getElementById("invoiceSignInForm") as HTMLFormElement | null;
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !supabase) return;
    const captchaToken = captchaTokenFor(form);
    if (!captchaToken) return;
    const data = new FormData(form);
    setAuthBusy(form, true, "Signing in…");
    try {
      const { data: result, error } = await supabase.auth.signInWithPassword({
        email: String(data.get("email") || "").trim().toLowerCase(),
        password: String(data.get("password") || ""),
        options: { captchaToken },
      });
      if (error) throw error;
      if (!result.session) throw new Error("Sign-in could not be completed. Please try again.");
      location.assign(getWorkspaceRedirectUrl());
    } catch (error) {
      resetCaptcha(form);
      showAuthError(error);
      setAuthBusy(form, false);
    }
  });
  document.getElementById("invoiceForgotPassword")?.addEventListener("click", renderPasswordResetRequest);
  document.getElementById("invoiceGoogleSignIn")?.addEventListener("click", async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: getWorkspaceRedirectUrl() } });
      if (error) throw error;
    } catch (error) {
      showAuthError(error);
    }
  });
}

function renderPasswordResetRequest() {
  if (!gateContent || !supabase) return;
  gateContent.innerHTML = `<section class="invoice-auth-shell" aria-label="Reset your Invoice Maker Tool password">
    <aside class="invoice-auth-brand">
      <div class="invoice-auth-brand-lockup"><img class="invoice-auth-logo" src="../assets/invoice-tool-logo.png" alt="" /><strong>Invoice Maker Tool</strong></div>
      <div><span class="invoice-auth-eyebrow">SECURE ACCOUNT RECOVERY</span><h2>Return to your workspace safely.</h2><p>We will send a secure password-reset link to the email registered with your account.</p></div>
      <ul><li>Private recovery link</li><li>Supabase protected account</li></ul>
    </aside>
    <div class="invoice-auth-panel">
      <button class="invoice-auth-close" id="invoiceAuthClose" type="button" aria-label="Close authentication">&times;</button>
      <span class="invoice-auth-eyebrow">PASSWORD RESET</span><h1>Reset your password</h1>
      <p class="invoice-auth-intro">Enter your account email. If it is registered, Invoice Maker Tool will send recovery instructions.</p>
      <form class="invoice-signup-profile" id="invoicePasswordResetRequest">
        <label>Email Address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com" /></label>
        ${captchaMarkup()}
        <div class="invoice-auth-error" id="invoiceAuthError" role="alert" hidden></div>
        <button class="btn primary invoice-auth-continue" type="submit">Send reset link <span aria-hidden="true">&rarr;</span></button>
      </form>
      <p class="invoice-auth-switch">Remembered your password? <button type="button" id="invoiceBackToSignIn">Sign in</button></p>
    </div>
  </section>`;
  document.getElementById("invoiceAuthClose")?.addEventListener("click", closeAuthentication);
  document.getElementById("invoiceBackToSignIn")?.addEventListener("click", () => renderAuthentication("signIn"));
  const form = document.getElementById("invoicePasswordResetRequest") as HTMLFormElement | null;
  void mountCaptcha(form);
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !supabase) return;
    const captchaToken = captchaTokenFor(form);
    if (!captchaToken) return;
    const email = String(new FormData(form).get("email") || "").trim().toLowerCase();
    setAuthBusy(form, true, "Sending…");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: getPasswordRecoveryRedirectUrl(), captchaToken });
      if (error) throw error;
      form.innerHTML = `<div class="invoice-verification-note invoice-auth-success"><strong>Check your email</strong><span>If ${escapeHtml(email)} is registered, a secure Invoice Maker Tool password-reset link has been sent.</span></div>`;
    } catch (error) {
      resetCaptcha(form);
      showAuthError(error);
      setAuthBusy(form, false);
    }
  });
}

function renderPasswordRecovery() {
  if (!gateContent || !supabase) return;
  gateContent.innerHTML = `<section class="invoice-auth-shell" aria-label="Choose a new Invoice Maker Tool password">
    <aside class="invoice-auth-brand">
      <div class="invoice-auth-brand-lockup"><img class="invoice-auth-logo" src="../assets/invoice-tool-logo.png" alt="" /><strong>Invoice Maker Tool</strong></div>
      <div><span class="invoice-auth-eyebrow">SECURE ACCOUNT RECOVERY</span><h2>Create a new secure password.</h2><p>Your recovery link has been verified by Supabase Auth.</p></div>
      <ul><li>Encrypted account access</li><li>No email-address change required</li></ul>
    </aside>
    <div class="invoice-auth-panel">
      <span class="invoice-auth-eyebrow">NEW PASSWORD</span><h1>Choose your new password</h1>
      <p class="invoice-auth-intro">Use at least eight characters. You will sign in again after the password is updated.</p>
      <form class="invoice-signup-profile" id="invoicePasswordRecovery">
        <label>New Password<input name="password" type="password" autocomplete="new-password" minlength="8" required placeholder="Enter a new password" /></label>
        <label>Confirm Password<input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required placeholder="Confirm your new password" /></label>
        <div class="invoice-auth-error" id="invoiceAuthError" role="alert" hidden></div>
        <button class="btn primary invoice-auth-continue" type="submit">Update password <span aria-hidden="true">&rarr;</span></button>
      </form>
    </div>
  </section>`;
  const form = document.getElementById("invoicePasswordRecovery") as HTMLFormElement | null;
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !supabase) return;
    const data = new FormData(form);
    const password = String(data.get("password") || "");
    if (password !== String(data.get("confirmPassword") || "")) {
      showAuthError(new Error("The passwords do not match."));
      return;
    }
    setAuthBusy(form, true, "Updating…");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut({ scope: "local" });
      history.replaceState(null, "", location.pathname);
      authUser = null;
      renderAuthentication("signIn");
      setCloudStatus("Password updated. Sign in with your new password.", "success");
    } catch (error) {
      showAuthError(error);
      setAuthBusy(form, false);
    }
  });
}

function renderEmailVerification(email: string) {
  const form = document.getElementById("invoiceSignupProfile") as HTMLFormElement | null;
  if (!form) return;
  form.outerHTML = `<form class="invoice-signup-profile" id="invoiceVerifyEmail">
    <div class="invoice-verification-note"><strong>Check your email</strong><span>Enter the one-time verification code sent to ${escapeHtml(email)}.</span></div>
    <label>Verification Code<input name="code" inputmode="numeric" autocomplete="one-time-code" required placeholder="Enter verification code" /></label>
    <div class="invoice-auth-error" id="invoiceAuthError" role="alert" hidden></div>
    <button class="btn primary invoice-auth-continue" type="submit">Verify and continue <span aria-hidden="true">&rarr;</span></button>
  </form>`;
  const verifyForm = document.getElementById("invoiceVerifyEmail") as HTMLFormElement;
  verifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!verifyForm.reportValidity() || !supabase) return;
    const code = String(new FormData(verifyForm).get("code") || "").trim();
    setAuthBusy(verifyForm, true, "Verifying…");
    try {
      const { data: result, error } = await supabase.auth.verifyOtp({ email, token: code, type: "signup" });
      if (error) throw error;
      if (!result.session) throw new Error("The verification code could not be completed.");
      location.assign(getWorkspaceRedirectUrl());
    } catch (error) {
      showAuthError(error);
      setAuthBusy(verifyForm, false);
    }
  });
}

function setAuthBusy(form: HTMLFormElement, busy: boolean, label = "") {
  form.querySelectorAll("input, button").forEach((control) => ((control as HTMLInputElement | HTMLButtonElement).disabled = busy));
  const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (!submit) return;
  if (!submit.dataset.originalLabel) submit.dataset.originalLabel = submit.innerHTML;
  submit.innerHTML = busy ? escapeHtml(label) : submit.dataset.originalLabel;
}

function showAuthError(error: unknown) {
  const box = document.getElementById("invoiceAuthError");
  if (!box) return;
  const candidate = error as { errors?: Array<{ longMessage?: string; message?: string }> };
  box.textContent = candidate?.errors?.[0]?.longMessage || candidate?.errors?.[0]?.message || messageFrom(error);
  box.hidden = false;
}

function hideAuthError() {
  const box = document.getElementById("invoiceAuthError");
  if (!box) return;
  box.textContent = "";
  box.hidden = true;
}

function unmountAuthentication() {
}

function closeAuthentication() {
  unmountAuthentication();
  clearAuthenticationRequest();
  unlockWorkspace();
  showPublicLanding();
}

function readPendingProfile(): { firstName: string; lastName: string; email: string; phoneNumber: string } | null {
  try {
    const raw = sessionStorage.getItem(pendingProfileKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function renderPendingApproval() {
  if (!gateContent) return;
  gateContent.innerHTML = `<section class="cloud-pending-card" aria-labelledby="cloudPendingTitle">
    <div class="cloud-pending-animation" aria-hidden="true">
      <span class="cloud-pending-orbit cloud-pending-orbit-one"></span>
      <span class="cloud-pending-orbit cloud-pending-orbit-two"></span>
      <span class="cloud-pending-shield"><img src="../assets/invoice-tool-logo.png" alt="" /></span>
    </div>
    <span class="cloud-pending-eyebrow">VERIFICATION PENDING</span>
    <h1 id="cloudPendingTitle">Administrator approval required</h1>
    <p>Your account has been verified successfully. Access to Invoice Maker Tool is pending until an administrator activates your workspace and authorizes your invoice templates.</p>
    <div class="cloud-pending-status"><span></span><strong>Waiting for administrator approval</strong></div>
    <small>You can safely close this page and sign in again after access is approved.</small>
    <button class="btn ghost" id="cloudSignOut" type="button">Sign out</button>
  </section>`;
  lockWorkspace();
  document.getElementById("cloudSignOut")?.addEventListener("click", async () => {
    await supabase?.auth.signOut({ scope: "local" });
    location.assign(location.origin + location.pathname);
  });
}

function renderGate(title: string, description: string, canSignOut = false) {
  if (!gateContent) return;
  gateContent.innerHTML = `<div class="cloud-message-card"><span class="cloud-message-icon">IS</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p>${canSignOut ? '<button class="btn primary" id="cloudSignOut" type="button">Sign out</button>' : ""}</div>`;
  lockWorkspace();
  document.getElementById("cloudSignOut")?.addEventListener("click", async () => {
    await supabase?.auth.signOut({ scope: "local" });
    location.assign(location.origin + location.pathname);
  });
}

function lockWorkspace() {
  document.documentElement.classList.add("cloud-locked");
  if (gate) gate.hidden = false;
}

function unlockWorkspace() {
  document.documentElement.classList.remove("cloud-locked");
  if (gate) gate.hidden = true;
  signalReady();
}

function signalReady() {
  if (readyDispatched) return;
  readyDispatched = true;
  if (window.InvoiceCloud) window.InvoiceCloud.ready = true;
  window.dispatchEvent(new CustomEvent("invoice-cloud-ready", { detail: window.InvoiceCloud?.currentUser || null }));
}

function setCloudStatus(message: string, state: string) {
  if (!cloudStatus) return;
  cloudStatus.textContent = message;
  cloudStatus.dataset.state = state;
}

function messageFrom(error: unknown) {
  const seen = new Set<unknown>();
  const readMessage = (value: unknown): string => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (!value || typeof value !== "object" || seen.has(value)) return "";
    seen.add(value);
    if (value instanceof Error && value.message.trim()) return value.message.trim();
    const candidate = value as Record<string, unknown>;
    for (const key of ["message", "reason", "error_description", "details", "hint", "data", "error", "context"]) {
      const message = readMessage(candidate[key]);
      if (message) return message;
    }
    return "";
  };
  const message = readMessage(error).replace(/^.*?Uncaught Error:\s*/i, "");
  return message && message !== "[object Object]"
    ? message
    : "The cloud service could not complete the request. Please refresh and try again.";
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
}

function selected(value: string, expected: string) { return value === expected ? "selected" : ""; }
function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}
