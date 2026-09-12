import api from "./api";

export const ACCEPTED_TERMS_VERSION_KEY = "acceptedTermsVersion";
export const ACCEPTED_TERMS_AT_KEY = "acceptedTermsAt";
export const TERMS_VERSION_KEY = "termsVersion";
const TERMS_VERSION_FETCHED_AT_KEY = "termsVersionFetchedAt";

const VERSION_TTL_MS = 5 * 60 * 1000;

export function getAcceptedTermsVersion(): string | null {
  return localStorage.getItem(ACCEPTED_TERMS_VERSION_KEY);
}

export function getCurrentTermsVersion(): string | null {
  return localStorage.getItem(TERMS_VERSION_KEY);
}

export function setTermsAcceptance(data: {
  acceptedTermsVersion?: string;
  acceptedTermsAt?: string;
  termsVersion?: string;
}): void {
  if (data.acceptedTermsVersion) {
    localStorage.setItem(ACCEPTED_TERMS_VERSION_KEY, data.acceptedTermsVersion);
  }
  if (data.acceptedTermsAt) {
    localStorage.setItem(ACCEPTED_TERMS_AT_KEY, data.acceptedTermsAt);
  }
  if (data.termsVersion) {
    localStorage.setItem(TERMS_VERSION_KEY, data.termsVersion);
    localStorage.setItem(TERMS_VERSION_FETCHED_AT_KEY, String(Date.now()));
  }
}

export function clearTerms(): void {
  localStorage.removeItem(ACCEPTED_TERMS_VERSION_KEY);
  localStorage.removeItem(ACCEPTED_TERMS_AT_KEY);
  localStorage.removeItem(TERMS_VERSION_KEY);
  localStorage.removeItem(TERMS_VERSION_FETCHED_AT_KEY);
}

export function hasAcceptedCurrentTerms(): boolean {
  const accepted = getAcceptedTermsVersion();
  const current = getCurrentTermsVersion();
  return !!accepted && !!current && accepted === current;
}

export async function fetchCurrentTermsVersion(): Promise<string | null> {
  try {
    const { data } = await api.get("/auth/terms-version");
    const version: string | null = data?.version ?? null;
    if (version) {
      localStorage.setItem(TERMS_VERSION_KEY, version);
      localStorage.setItem(TERMS_VERSION_FETCHED_AT_KEY, String(Date.now()));
    }
    return version;
  } catch {
    return null;
  }
}

async function getFreshCurrentVersion(): Promise<string | null> {
  const fetchedAt = Number(
    localStorage.getItem(TERMS_VERSION_FETCHED_AT_KEY) || 0,
  );
  if (
    getCurrentTermsVersion() &&
    Date.now() - fetchedAt < VERSION_TTL_MS
  ) {
    return getCurrentTermsVersion();
  }
  const version = await fetchCurrentTermsVersion();
  return version ?? getCurrentTermsVersion();
}

async function reconcileAcceptedFromServer(): Promise<void> {
  try {
    const { data } = await api.get("/auth/me");
    if (data?.acceptedTermsVersion) {
      localStorage.setItem(
        ACCEPTED_TERMS_VERSION_KEY,
        data.acceptedTermsVersion,
      );
    }
    if (data?.acceptedTermsAt) {
      localStorage.setItem(ACCEPTED_TERMS_AT_KEY, data.acceptedTermsAt);
    }
    if (data?.termsVersion) {
      localStorage.setItem(TERMS_VERSION_KEY, data.termsVersion);
      localStorage.setItem(TERMS_VERSION_FETCHED_AT_KEY, String(Date.now()));
    }
  } catch {
    /* mantém o estado local em caso de falha */
  }
}

export async function ensureTermsAccepted(): Promise<boolean> {
  const current = await getFreshCurrentVersion();

  let accepted = getAcceptedTermsVersion();
  if (!accepted) {
    await reconcileAcceptedFromServer();
    accepted = getAcceptedTermsVersion();
  }

  if (!current) return true;
  return accepted === current;
}
