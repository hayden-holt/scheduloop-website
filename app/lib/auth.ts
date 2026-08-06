export type AuthSession = {
  idToken: string;
  refreshToken: string;
  localId: string;
  email: string;
  displayName: string;
  expiresAt: number;
  remember: boolean;
  profile?: {
    businessName?: string;
    businessType?: string;
  };
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  businessName: string;
  businessType: string;
};

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
const AUTH_STORAGE_KEY = "scheduleloop.auth.v1";
const AUTH_EVENT = "scheduleloop-auth-change";

export class AuthError extends Error {
  code: string;

  constructor(message: string, code = "auth/error") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export function hasFirebaseConfig() {
  const key = API_KEY.trim();
  return key.length > 12 && !key.includes("your-") && !key.includes("YOUR_");
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const session = readStoredSession();
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    clearStoredSession();
    return null;
  }
  return session;
}

export async function restoreAuthSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined") return null;
  const session = readStoredSession(true);
  if (!session) return null;

  if (session.expiresAt > Date.now() + 60000) return session;
  if (!hasFirebaseConfig() || !session.refreshToken) {
    clearStoredSession();
    return null;
  }

  try {
    return await refreshSession(session);
  } catch {
    clearStoredSession();
    return null;
  }
}

export function onAuthSessionChange(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(AUTH_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(AUTH_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export async function signInWithEmail(
  email: string,
  password: string,
  remember: boolean,
) {
  ensureFirebaseReady();
  const data = await firebaseJson<FirebaseAuthResponse>(
    "accounts:signInWithPassword",
    {
      email,
      password,
      returnSecureToken: true,
    },
  );

  return persistSession(
    {
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      localId: data.localId,
      email: data.email,
      displayName: data.displayName || data.email,
      expiresAt: Date.now() + Number(data.expiresIn) * 1000,
      remember,
    },
    remember,
  );
}

export async function createAccount(input: SignUpInput) {
  ensureFirebaseReady();
  const data = await firebaseJson<FirebaseAuthResponse>("accounts:signUp", {
    email: input.email,
    password: input.password,
    returnSecureToken: true,
  });

  if (input.name.trim()) {
    await firebaseJson("accounts:update", {
      idToken: data.idToken,
      displayName: input.name.trim(),
      returnSecureToken: false,
    }).catch(() => undefined);
  }

  return persistSession(
    {
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      localId: data.localId,
      email: data.email,
      displayName: input.name.trim() || data.email,
      expiresAt: Date.now() + Number(data.expiresIn) * 1000,
      remember: true,
      profile: {
        businessName: input.businessName.trim(),
        businessType: input.businessType,
      },
    },
    true,
  );
}

export async function sendPasswordReset(email: string) {
  ensureFirebaseReady();
  await firebaseJson("accounts:sendOobCode", {
    requestType: "PASSWORD_RESET",
    email,
  });
}

export function signOut() {
  if (typeof window === "undefined") return;
  clearStoredSession();
  emitAuthChange();
}

export function safeRedirectTarget(value: string | null, fallback = "/dashboard") {
  if (!value) return fallback;
  try {
    const url = new URL(value, "https://scheduleloop.local");
    if (url.origin !== "https://scheduleloop.local") return fallback;
    if (["/sign-in", "/sign-up", "/forgot-password"].includes(url.pathname)) {
      return fallback;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

async function refreshSession(session: AuthSession) {
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: session.refreshToken,
      }),
    },
  );
  const data = (await response.json().catch(() => ({}))) as {
    id_token?: string;
    refresh_token?: string;
    expires_in?: string;
    user_id?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.id_token || !data.refresh_token) {
    throw new AuthError(translateFirebaseError(data.error?.message), data.error?.message);
  }

  return persistSession(
    {
      ...session,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      localId: data.user_id ?? session.localId,
      expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000,
    },
    session.remember,
  );
}

async function firebaseJson<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new AuthError(translateFirebaseError(data.error?.message), data.error?.message);
  }

  return data;
}

function ensureFirebaseReady() {
  if (!hasFirebaseConfig()) {
    throw new AuthError(
      "Sign in is currently available to invited early-access businesses. Request a walkthrough if you need access.",
      "auth/missing-config",
    );
  }
}

function persistSession(session: AuthSession, remember: boolean) {
  if (typeof window === "undefined") return session;
  clearStoredSession();
  const target = remember ? window.localStorage : window.sessionStorage;
  target.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
  return session;
}

function readStoredSession(allowExpired = false): AuthSession | null {
  if (typeof window === "undefined") return null;
  const stores = [window.localStorage, window.sessionStorage];
  for (const store of stores) {
    const raw = store.getItem(AUTH_STORAGE_KEY);
    if (!raw) continue;
    try {
      const session = JSON.parse(raw) as AuthSession;
      if (!session.idToken || !session.email) continue;
      if (!allowExpired && session.expiresAt <= Date.now()) continue;
      return session;
    } catch {
      store.removeItem(AUTH_STORAGE_KEY);
    }
  }
  return null;
}

function clearStoredSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function emitAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

function translateFirebaseError(message?: string) {
  switch (message) {
    case "EMAIL_NOT_FOUND":
    case "USER_NOT_FOUND":
      return "We could not find an account with those details.";
    case "INVALID_PASSWORD":
    case "INVALID_LOGIN_CREDENTIALS":
      return "Please check your email address and password.";
    case "INVALID_EMAIL":
      return "The email address is not valid.";
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "Too many attempts. Please try again shortly.";
    case "EMAIL_EXISTS":
      return "An account already exists for that email address.";
    case "WEAK_PASSWORD : Password should be at least 6 characters":
    case "WEAK_PASSWORD":
      return "Use a password with at least 6 characters.";
    case "OPERATION_NOT_ALLOWED":
      return "Email and password sign-in is not enabled for this Firebase project.";
    case "MISSING_PASSWORD":
      return "Enter your password to continue.";
    default:
      return "Something went wrong. Please try again.";
  }
}

type FirebaseAuthResponse = {
  idToken: string;
  refreshToken: string;
  localId: string;
  email: string;
  displayName?: string;
  expiresIn: string;
};
