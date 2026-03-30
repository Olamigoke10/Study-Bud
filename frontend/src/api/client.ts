const API_BASE = "/api";

type TokenPair = {
  access?: string;
  refresh?: string;
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getAccessToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(tokens: TokenPair) {
  if (typeof window === "undefined") return;
  if (tokens.access) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  if (tokens.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

type ApiFetchOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const token = getAccessToken();
  const { body: bodyOption, headers: headersOption, ...rest } = options;

  const headers = new Headers(headersOption);
  headers.set("Accept", "application/json");

  let bodyToSend: BodyInit | undefined = undefined;

  if (bodyOption !== undefined) {
    if (bodyOption instanceof FormData) {
      bodyToSend = bodyOption;
    } else if (
      typeof bodyOption === "object" &&
      bodyOption !== null &&
      !(bodyOption instanceof Blob)
    ) {
      // If it's a plain object, default to sending JSON.
      headers.set("Content-Type", "application/json");
      bodyToSend = JSON.stringify(bodyOption);
    } else {
      bodyToSend = bodyOption as unknown as BodyInit;
    }
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: bodyToSend,
  });

  if (!res.ok) {
    let detail: unknown = null;
    try {
      detail = await res.json();
    } catch {
      // ignore
    }
    throw new Error(`API ${res.status} ${res.statusText}: ${JSON.stringify(detail)}`);
  }

  return (await res.json()) as T;
}

