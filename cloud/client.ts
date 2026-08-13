import { Clerk } from "@clerk/clerk-js";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

type CloudConfig = { clerkPublishableKey?: string; convexUrl?: string };
type UserRecord = {
  _id: string;
  email: string;
  name: string;
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
  void startAuthentication("signIn");
});
publicSignUp?.addEventListener("click", (event) => {
  if (!clerk) return;
  event.preventDefault();
  void startAuthentication("signUp");
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
    await clerk.load({ signInFallbackRedirectUrl: location.href, signUpFallbackRedirectUrl: location.href });
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
    const displayName = clerk.user.fullName || clerk.user.username || primaryEmail.split("@")[0] || "Invoice user";
    await authenticatedCall("mutation", refs.ensureUser, {
      email: primaryEmail,
      name: displayName,
      imageUrl: clerk.user.imageUrl || undefined,
    });
    const user = await authenticatedCall<UserRecord>("query", refs.me, {});
    cloudApi.currentUser = user;
    mountIdentity(user);

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
  const returnLocation = new URL(location.href);
  returnLocation.searchParams.set("auth", "workspace");
  returnLocation.hash = "tool";
  const redirectUrl = returnLocation.toString();
  if (mode === "signUp") {
    await clerk.redirectToSignUp({ redirectUrl });
    return;
  }
  await clerk.redirectToSignIn({ redirectUrl });
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

async function initializeAdminPanel() {
  const nav = document.getElementById("adminNavItem");
  if (nav) nav.hidden = false;
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
      <header><div class="cloud-avatar">${escapeHtml(initials(user.name))}</div><div><h3>${escapeHtml(user.name)}</h3><p>${escapeHtml(user.email)}</p></div><span class="cloud-status ${user.status}">${user.status}</span></header>
      <div class="cloud-access-grid">
        <label>Account status<select name="status"><option value="pending" ${selected(user.status, "pending")}>Pending</option><option value="active" ${selected(user.status, "active")}>Active</option><option value="suspended" ${selected(user.status, "suspended")}>Suspended</option></select></label>
        <label>Role<select name="role"><option value="user" ${selected(user.role, "user")}>User</option><option value="admin" ${selected(user.role, "admin")}>Administrator</option></select></label>
        <label>Template access<select name="templateAccess"><option value="custom" ${selected(user.templateAccess, "custom")}>Selected templates</option><option value="all" ${selected(user.templateAccess, "all")}>All templates</option></select></label>
      </div>
      <details class="cloud-template-access" ${user.templateAccess === "custom" ? "open" : ""}><summary>Authorized templates (${user.allowedTemplateIds.length})</summary><div>${checks}</div></details>
      <footer><button class="btn primary" type="submit">Save access</button></footer>
    </form>`;
}

function renderSignIn() {
  if (!gateContent || !clerk) return;
  gateContent.innerHTML = '<div class="cloud-message-card"><span class="cloud-message-icon">IS</span><h1>Invoice Studio</h1><p>Sign in to open your secure workspace.</p><button class="btn primary" id="cloudHostedSignIn" type="button">Sign in securely</button></div>';
  document.getElementById("cloudHostedSignIn")?.addEventListener("click", () => void clerk?.redirectToSignIn({ redirectUrl: location.href }));
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
