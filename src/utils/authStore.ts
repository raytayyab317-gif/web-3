import { UserAccount, UserSession } from '../types/constructex';

const USERS_STORAGE_KEY = 'constructex_users_v1';
const SESSION_STORAGE_KEY = 'constructex_session_v1';

function getSafeStorage(): Storage | null {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

export function loadUsers(storageOverride?: Storage | null): UserAccount[] {
  const storage = storageOverride === undefined ? getSafeStorage() : storageOverride;
  if (!storage) return [];
  try {
    const raw = storage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadSession(storageOverride?: Storage | null): UserSession | null {
  const storage = storageOverride === undefined ? getSafeStorage() : storageOverride;
  if (!storage) return null;
  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function registerUser(
  fullName: string,
  email: string,
  password: string,
  storageOverride?: Storage | null
): { ok: true; session: UserSession } | { ok: false; error: string } {
  const cleanName = fullName.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2) {
    return { ok: false, error: 'Please enter your full name.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' };
  }

  const users = loadUsers(storageOverride);
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now().toString(36)}`,
    fullName: cleanName,
    email: cleanEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  const storage = storageOverride === undefined ? getSafeStorage() : storageOverride;
  if (storage) {
    storage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
  }

  const session: UserSession = {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    signedInAt: new Date().toISOString(),
  };

  if (storage) {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  return { ok: true, session };
}

export function authenticateUser(
  email: string,
  password: string,
  storageOverride?: Storage | null
): { ok: true; session: UserSession } | { ok: false; error: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (!password) {
    return { ok: false, error: 'Please enter your password.' };
  }

  const users = loadUsers(storageOverride);
  const match = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!match || match.password !== password) {
    return {
      ok: false,
      error: 'Invalid email or password. Create an account if you are new to ConstructEx.',
    };
  }

  const session: UserSession = {
    id: match.id,
    fullName: match.fullName,
    email: match.email,
    signedInAt: new Date().toISOString(),
  };

  const storage = storageOverride === undefined ? getSafeStorage() : storageOverride;
  if (storage) {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  return { ok: true, session };
}

export function clearSession(storageOverride?: Storage | null): void {
  const storage = storageOverride === undefined ? getSafeStorage() : storageOverride;
  if (!storage) return;
  storage.removeItem(SESSION_STORAGE_KEY);
}
