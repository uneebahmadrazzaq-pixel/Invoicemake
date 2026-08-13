import { Clerk } from "@clerk/clerk-js";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

type CloudConfig = { clerkPublishableKey?: string; convexUrl?: string };
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
};

declare global {
  interface Window {
    __INVOICE_CLOUD_CONFIG__?: CloudConfig;
    InvoiceCloud?: {
      saveStorage: (storageKey: string, value: unknown, activeTemplateId?: string) => void;
      currentUser?: UserRecord;
      ready?: boolean;
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
] as const;

const refs = {
  ensureUser: makeFunctionReference<"mutation">("users:ensureCurrentUser"),
  me: makeFunctionReference<"query">("users:me"),
  listUsers: makeFunctionReference<"query">("users:listForAdmin"),
  updateAccess: makeFunctionReference<"mutation">("users:updateAccess"),
  listData: makeFunctionReference<"query">("storage:listMine"),
  generateUploadUrl: makeFunctionReference<"mutation">("storage:generateUploadUrl"),
  commitData: makeFunctionReference<"mutation">("storage:commitMine"),
};

const config = window.__INVOICE_CLOUD_CONFIG__ || {};
const gate = document.getElementById("cloudAuthGate") as HTMLElement | null;
const gateContent = document.getElementById("cloudAuthContent") as HTMLElement | null;
const cloudStatus = document.getElementById("cloudConnectionStatus") as HTMLElement | null;
const publicSignIn = document.getElementById("publicSignIn") as HTMLAnchorElement | null;
const publicSignUp = document.getElementById("publicSignUp") as HTMLAnchorElement | null;
const saveTimers = new Map<string, number>();
let clerk: Clerk | null = null;
let convex: ConvexHttpClient | null = null;
let readyDispatched = false;
let authenticatedSessionDetected = false;
let activeAuthMount: HTMLDivElement | null = null;
let activeAuthMode: "signIn" | "signUp" | null = null;

const cloudApi: NonNullable<Window["InvoiceCloud"]> = {
  saveStorage(storageKey, value, activeTemplateId) {
    if (!storageKeys.includes(storageKey) || !convex || !clerk?.session || !window.InvoiceCloud?.currentUser) return;
    window.clearTimeout(saveTimers.get(storageKey));
    const timer = window.setTimeout(async () => {
      try {
        await uploadStorageValue(storageKey, value, activeTemplateId);
        setCloudStatus("Saved to Convex", "success");
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
  if (!clerk) return;
  event.preventDefault();
  void openFreshAuthentication("signIn");
});
publicSignUp?.addEventListener("click", (event) => {
  if (!clerk) return;
  event.preventDefault();
  void openFreshAuthentication("signUp");
});
document.addEventListener("click", protectWorkspaceEntry, true);

void initialize();

async function initialize() {
  unlockWorkspace();
  if (!config.clerkPublishableKey || !config.convexUrl) {
    unlockWorkspace();
    setCloudStatus("Cloud setup required", "error");
    console.warn("Clerk and Convex are not active until CLERK_PUBLISHABLE_KEY and CONVEX_URL are configured.");
    return;
  }

  try {
    clerk = new Clerk(config.clerkPublishableKey);
    const workspaceRedirectUrl = getWorkspaceRedirectUrl();
    await clerk.load({
      signInForceRedirectUrl: workspaceRedirectUrl,
      signUpForceRedirectUrl: workspaceRedirectUrl,
      signInFallbackRedirectUrl: workspaceRedirectUrl,
      signUpFallbackRedirectUrl: workspaceRedirectUrl,
      appearance: {
        options: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: "#7c3aed",
          colorBackground: "#ffffff",
          colorForeground: "#11172b",
          colorInputBackground: "#ffffff",
          colorInputText: "#11172b",
          borderRadius: "0.85rem",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        },
      },
    });
    if (!clerk.isSignedIn || !clerk.user || !clerk.session) {
      showPublicLanding();
      window.setTimeout(showPublicLanding, 0);
      unlockWorkspace();
      setCloudStatus("Sign in to sync", "working");
      return;
    }

    authenticatedSessionDetected = true;
    convex = new ConvexHttpClient(config.convexUrl);
    const primaryEmail = clerk.user.primaryEmailAddress?.emailAddress || clerk.user.emailAddresses[0]?.emailAddress || "";
    const pendingProfile = readPendingProfile();
    const firstName = clerk.user.firstName || pendingProfile?.firstName;
    const lastName = clerk.user.lastName || pendingProfile?.lastName;
    const phoneNumber = clerk.user.primaryPhoneNumber?.phoneNumber || clerk.user.phoneNumbers[0]?.phoneNumber || pendingProfile?.phoneNumber;
    const displayName = clerk.user.fullName || [firstName, lastName].filter(Boolean).join(" ") || clerk.user.username || primaryEmail.split("@")[0] || "Invoice user";
    const existingUser = await authenticatedCall<UserRecord | null>("query", refs.me, {});
    if (!existingUser && (!firstName || !lastName || !phoneNumber)) {
      renderRequiredProfile(primaryEmail, { firstName, lastName, phoneNumber });
      lockWorkspace();
      return;
    }
    await authenticatedCall("mutation", refs.ensureUser, {
      email: primaryEmail,
      name: displayName,
      firstName,
      lastName,
      phoneNumber,
      imageUrl: clerk.user.imageUrl || undefined,
    });
    sessionStorage.removeItem(pendingProfileKey);
    const user = await authenticatedCall<UserRecord>("query", refs.me, {});
    cloudApi.currentUser = user;
    mountIdentity(user);
    applyAdminVisibility(user);

    if (user.status !== "active") {
      signalReady();
      renderGate(
        user.status === "suspended" ? "Account suspended" : "Waiting for administrator approval",
        user.status === "suspended"
          ? "An administrator has suspended this workspace. Contact the site owner to restore access."
          : "Your sign-in is complete. An administrator must activate your account and authorize invoice templates.",
        true,
      );
      return;
    }
    if (user.role !== "admin" && user.templateAccess === "custom" && user.allowedTemplateIds.length === 0) {
      signalReady();
      renderGate("No templates assigned", "Your account is active, but an administrator has not assigned any invoice templates yet.", true);
      return;
    }

    const mustReload = await hydrateUserData(user);
    if (mustReload) {
      location.reload();
      return;
    }
    if (user.role === "admin") await initializeAdminPanel();
    unlockWorkspace();
    openAuthorizedWorkspace();
    history.replaceState(null, "", `${location.pathname}${location.search}#tool`);
    setCloudStatus("Connected to Convex", "success");
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
  if (!clerk) {
    renderGate("Preparing secure sign in", "Connecting to the account service. Please try again in a moment.");
    lockWorkspace();
    return;
  }
  lockWorkspace();
  renderAuthentication(mode);
}

function getWorkspaceRedirectUrl() {
  const returnLocation = new URL(location.href);
  returnLocation.searchParams.set("auth", "workspace");
  returnLocation.hash = "tool";
  return returnLocation.toString();
}

async function openFreshAuthentication(mode: "signIn" | "signUp") {
  if (clerk?.isSignedIn) await clerk.signOut();
  await startAuthentication(mode);
}

async function authenticatedCall<T = unknown>(kind: "query" | "mutation", reference: any, args: Record<string, unknown>): Promise<T> {
  if (!convex || !clerk?.session) throw new Error("Cloud session is unavailable.");
  const token = await clerk.session.getToken({ template: "convex", skipCache: false });
  if (!token) throw new Error("Clerk could not issue the Convex access token. Check the Clerk JWT template named ‘convex’. ");
  convex.setAuth(token);
  return (kind === "query" ? convex.query(reference, args) : convex.mutation(reference, args)) as Promise<T>;
}

async function uploadStorageValue(storageKey: string, value: unknown, activeTemplateId?: string) {
  const content = JSON.stringify(value ?? null);
  const uploadUrl = await authenticatedCall<string>("mutation", refs.generateUploadUrl, {});
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: new Blob([content], { type: "application/json" }),
  });
  if (!response.ok) throw new Error(`Convex data upload failed (${response.status}).`);
  const { storageId } = await response.json() as { storageId: string };
  await authenticatedCall("mutation", refs.commitData, {
    storageKey,
    storageId,
    byteLength: new Blob([content]).size,
    activeTemplateId,
  });
}

async function hydrateUserData(user: UserRecord) {
  const subject = clerk!.user!.id;
  const previousOwner = localStorage.getItem(ownerKey);
  if (previousOwner && previousOwner !== subject) {
    storageKeys.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(templateAccessKey);
  }
  localStorage.setItem(ownerKey, subject);

  const rows = await authenticatedCall<Array<{ storageKey: string; url: string | null }>>("query", refs.listData, {});
  const serverData = new Map<string, unknown>();
  for (const row of rows) {
    if (!row.url) continue;
    const response = await fetch(row.url);
    if (!response.ok) throw new Error(`Could not load ${row.storageKey} from Convex.`);
    serverData.set(row.storageKey, await response.json());
  }
  const mayMigrateLocalData = !previousOwner || previousOwner === subject;

  if (rows.length === 0 && mayMigrateLocalData) {
    for (const storageKey of storageKeys) {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;
      let value: unknown;
      try { value = JSON.parse(raw); } catch { value = raw; }
      const activeTemplateId = storageKey === storageKeys[0] ? (value as any)?.current?.templateId : undefined;
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
  document.querySelectorAll(".studio-user-card strong, .studio-profile strong").forEach((node) => { node.textContent = user.name; });
  document.querySelectorAll(".studio-user-card > span, .studio-profile small").forEach((node) => {
    node.textContent = user.role === "admin" ? "Administrator" : "Authorized User";
  });
  const userButton = document.getElementById("clerkUserButton") as HTMLDivElement | null;
  if (userButton && clerk) {
    userButton.innerHTML = `<button class="cloud-account-button" type="button" aria-label="Sign out">${escapeHtml(initials(user.name))}</button>`;
    userButton.querySelector("button")?.addEventListener("click", () => void clerk?.signOut({ redirectUrl: location.origin + location.pathname }));
  }
  const logout = document.getElementById("backToWebsite");
  logout?.addEventListener("click", async (event) => {
    event.preventDefault();
    await clerk?.signOut({ redirectUrl: location.origin + location.pathname });
  }, { capture: true });
}

function applyAdminVisibility(user: UserRecord) {
  const isAdmin = user.role === "admin" && user.status === "active";
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

async function initializeAdminPanel() {
  const nav = document.getElementById("adminNavItem");
  const panel = document.getElementById("admin");
  if (nav) nav.hidden = false;
  if (panel) panel.hidden = false;
  await renderAdminUsers();
  document.getElementById("refreshAdminUsers")?.addEventListener("click", () => void renderAdminUsers());
}

async function renderAdminUsers() {
  const target = document.getElementById("adminUsers");
  if (!target) return;
  target.innerHTML = '<div class="cloud-loading-row">Loading users from Convex…</div>';
  try {
    const users = await authenticatedCall<UserRecord[]>("query", refs.listUsers, {});
    target.innerHTML = users
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((user) => adminUserMarkup(user))
      .join("");
    target.querySelectorAll<HTMLFormElement>("[data-admin-user]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
        if (button) { button.disabled = true; button.textContent = "Saving…"; }
        try {
          await authenticatedCall("mutation", refs.updateAccess, {
            userId: form.dataset.adminUser,
            role: data.get("role"),
            status: data.get("status"),
            templateAccess: data.get("templateAccess"),
            allowedTemplateIds: data.getAll("templates"),
          });
          setCloudStatus("User permissions updated", "success");
          await renderAdminUsers();
        } catch (error) {
          alert(messageFrom(error));
          if (button) { button.disabled = false; button.textContent = "Save access"; }
        }
      });
    });
  } catch (error) {
    target.innerHTML = `<div class="cloud-error-row">${escapeHtml(messageFrom(error))}</div>`;
  }
}

function adminUserMarkup(user: UserRecord) {
  const checks = templateCatalog.map(([id, name]) => `
    <label class="cloud-template-check">
      <input type="checkbox" name="templates" value="${id}" ${user.allowedTemplateIds.includes(id) ? "checked" : ""} />
      <span>${escapeHtml(name)}</span>
    </label>`).join("");
  return `
    <form class="cloud-user-card" data-admin-user="${escapeHtml(user._id)}">
      <header><div class="cloud-avatar">${escapeHtml(initials(user.name))}</div><div><h3>${escapeHtml(user.name)}</h3><p>${escapeHtml(user.email)}${user.phoneNumber ? ` &middot; ${escapeHtml(user.phoneNumber)}` : ""}</p></div><span class="cloud-status ${user.status}">${user.status}</span></header>
      <div class="cloud-access-grid">
        <label>Account status<select name="status"><option value="pending" ${selected(user.status, "pending")}>Pending</option><option value="active" ${selected(user.status, "active")}>Active</option><option value="suspended" ${selected(user.status, "suspended")}>Suspended</option></select></label>
        <label>Role<select name="role"><option value="user" ${selected(user.role, "user")}>User</option><option value="admin" ${selected(user.role, "admin")}>Administrator</option></select></label>
        <label>Template access<select name="templateAccess"><option value="custom" ${selected(user.templateAccess, "custom")}>Selected templates</option><option value="all" ${selected(user.templateAccess, "all")}>All templates</option></select></label>
      </div>
      <details class="cloud-template-access" ${user.templateAccess === "custom" ? "open" : ""}><summary>Authorized templates (${user.allowedTemplateIds.length})</summary><div>${checks}</div></details>
      <footer><button class="btn primary" type="submit">Save access</button></footer>
    </form>`;
}

function renderAuthentication(mode: "signIn" | "signUp") {
  if (!gateContent || !clerk) return;
  unmountAuthentication();
  activeAuthMode = mode;
  const isSignUp = mode === "signUp";
  gateContent.innerHTML = `
    <section class="invoice-auth-shell" aria-label="${isSignUp ? "Create an Invoice Studio account" : "Sign in to Invoice Studio"}">
      <aside class="invoice-auth-brand">
        <div class="invoice-auth-brand-lockup"><span class="invoice-auth-emblem" aria-hidden="true"></span><strong>Invoice Studio</strong></div>
        <div><span class="invoice-auth-eyebrow">SECURE INVOICE WORKSPACE</span><h2>${isSignUp ? "Start creating with confidence." : "Welcome back to your workspace."}</h2><p>Manage clients, templates, invoices, and exports from one protected account.</p></div>
        <ul><li>Private client and invoice data</li><li>Authorized supplier templates</li><li>Secure Convex cloud storage</li></ul>
      </aside>
      <div class="invoice-auth-panel">
        <button class="invoice-auth-close" id="invoiceAuthClose" type="button" aria-label="Close authentication">&times;</button>
        <span class="invoice-auth-eyebrow">${isSignUp ? "CREATE YOUR ACCOUNT" : "ACCOUNT ACCESS"}</span>
        <h1>${isSignUp ? "Create your Invoice Studio account" : "Sign in to Invoice Studio"}</h1>
        <p class="invoice-auth-intro">${isSignUp ? "Enter your required profile details before secure verification." : "Welcome back. Sign in to continue to your secure workspace."}</p>
        ${isSignUp ? signupProfileMarkup() : '<div class="invoice-clerk-mount" id="invoiceClerkMount"></div>'}
        <p class="invoice-auth-switch">${isSignUp ? "Already have an account?" : "New to Invoice Studio?"} <button type="button" id="invoiceAuthSwitch">${isSignUp ? "Sign in" : "Create an account"}</button></p>
      </div>
    </section>`;
  document.getElementById("invoiceAuthClose")?.addEventListener("click", closeAuthentication);
  document.getElementById("invoiceAuthSwitch")?.addEventListener("click", () => renderAuthentication(isSignUp ? "signIn" : "signUp"));
  if (isSignUp) {
    document.getElementById("invoiceSignupProfile")?.addEventListener("submit", continueSignup);
  } else {
    mountClerkAuthentication("signIn");
  }
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
    <button class="btn primary invoice-auth-continue" type="submit">Continue securely <span aria-hidden="true">&rarr;</span></button>
  </form>`;
}

function renderRequiredProfile(email: string, profile: { firstName?: string; lastName?: string; phoneNumber?: string }) {
  if (!gateContent) return;
  gateContent.innerHTML = `<section class="invoice-auth-shell" aria-label="Complete your Invoice Studio profile">
    <aside class="invoice-auth-brand">
      <div class="invoice-auth-brand-lockup"><span class="invoice-auth-emblem" aria-hidden="true"></span><strong>Invoice Studio</strong></div>
      <div><span class="invoice-auth-eyebrow">ONE LAST STEP</span><h2>Complete your secure profile.</h2><p>These required details identify your account to the administrator who controls template access.</p></div>
      <ul><li>Private client and invoice data</li><li>Administrator-controlled access</li><li>Secure Convex cloud storage</li></ul>
    </aside>
    <div class="invoice-auth-panel">
      <span class="invoice-auth-eyebrow">REQUIRED PROFILE</span><h1>Complete your Invoice Studio account</h1>
      <p class="invoice-auth-intro">Your secure sign-in is complete. Add the required contact details to request workspace access.</p>
      <form class="invoice-signup-profile" id="invoiceRequiredProfile">
        <div class="invoice-auth-field-row">
          <label>First Name<input name="firstName" autocomplete="given-name" required value="${escapeHtml(profile.firstName || "")}" /></label>
          <label>Last Name<input name="lastName" autocomplete="family-name" required value="${escapeHtml(profile.lastName || "")}" /></label>
        </div>
        <label>Email Address<input type="email" value="${escapeHtml(email)}" disabled /></label>
        <label>Phone Number<input name="phoneNumber" type="tel" autocomplete="tel" required placeholder="+44 7700 900000" value="${escapeHtml(profile.phoneNumber || "")}" /></label>
        <button class="btn primary invoice-auth-continue" type="submit">Save and continue <span aria-hidden="true">&rarr;</span></button>
      </form>
      <p class="invoice-auth-switch"><button type="button" id="invoiceProfileSignOut">Use a different account</button></p>
    </div>
  </section>`;
  document.getElementById("invoiceRequiredProfile")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    sessionStorage.setItem(pendingProfileKey, JSON.stringify({
      firstName: String(data.get("firstName") || "").trim(),
      lastName: String(data.get("lastName") || "").trim(),
      email,
      phoneNumber: String(data.get("phoneNumber") || "").trim(),
    }));
    location.reload();
  });
  document.getElementById("invoiceProfileSignOut")?.addEventListener("click", () => void clerk?.signOut({ redirectUrl: location.origin + location.pathname }));
}

function continueSignup(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const profile = {
    firstName: String(data.get("firstName") || "").trim(),
    lastName: String(data.get("lastName") || "").trim(),
    email: String(data.get("email") || "").trim().toLowerCase(),
    phoneNumber: String(data.get("phoneNumber") || "").trim(),
  };
  sessionStorage.setItem(pendingProfileKey, JSON.stringify(profile));
  form.outerHTML = '<div class="invoice-clerk-mount" id="invoiceClerkMount"></div>';
  mountClerkAuthentication("signUp", profile);
}

function mountClerkAuthentication(mode: "signIn" | "signUp", profile = readPendingProfile()) {
  if (!clerk) return;
  const target = document.getElementById("invoiceClerkMount") as HTMLDivElement | null;
  if (!target) return;
  activeAuthMount = target;
  const redirectUrl = getWorkspaceRedirectUrl();
  const appearance = {
    elements: {
      rootBox: { width: "100%" },
      cardBox: { width: "100%", boxShadow: "none" },
      card: { width: "100%", padding: "0", background: "transparent", boxShadow: "none" },
      header: { display: "none" },
      footer: { display: "none" },
      socialButtonsBlockButton: { minHeight: "48px", borderColor: "#d9ddec" },
      formFieldInput: { minHeight: "48px", borderColor: "#d9ddec", boxShadow: "none" },
      formButtonPrimary: { minHeight: "50px", background: "linear-gradient(135deg, #6d32ed, #9837f3)", boxShadow: "0 12px 24px rgba(116, 51, 238, .22)" },
      dividerLine: { background: "#e1e4ed" },
      dividerText: { color: "#758099" },
    },
  };
  const shared = { routing: "hash" as const, forceRedirectUrl: redirectUrl, fallbackRedirectUrl: redirectUrl, appearance };
  if (mode === "signUp") {
    clerk.mountSignUp(target, {
      ...shared,
      signInForceRedirectUrl: redirectUrl,
      signInFallbackRedirectUrl: redirectUrl,
      initialValues: profile ? { firstName: profile.firstName, lastName: profile.lastName, emailAddress: profile.email, phoneNumber: profile.phoneNumber } : undefined,
    });
  } else {
    clerk.mountSignIn(target, {
      ...shared,
      signUpForceRedirectUrl: redirectUrl,
      signUpFallbackRedirectUrl: redirectUrl,
    });
  }
}

function unmountAuthentication() {
  if (!clerk || !activeAuthMount || !activeAuthMode) return;
  if (activeAuthMode === "signUp") clerk.unmountSignUp(activeAuthMount);
  else clerk.unmountSignIn(activeAuthMount);
  activeAuthMount = null;
  activeAuthMode = null;
}

function closeAuthentication() {
  unmountAuthentication();
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

function renderGate(title: string, description: string, canSignOut = false) {
  if (!gateContent) return;
  gateContent.innerHTML = `<div class="cloud-message-card"><span class="cloud-message-icon">IS</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p>${canSignOut ? '<button class="btn primary" id="cloudSignOut" type="button">Sign out</button>' : ""}</div>`;
  document.getElementById("cloudSignOut")?.addEventListener("click", () => void clerk?.signOut({ redirectUrl: location.origin + location.pathname }));
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
  return error instanceof Error ? error.message.replace(/^.*?Uncaught Error:\s*/i, "") : String(error);
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
}

function selected(value: string, expected: string) { return value === expected ? "selected" : ""; }
function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}
