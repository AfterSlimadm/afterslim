/**
 * Authenticated fetch wrapper for internal API routes.
 * Injects x-api-key header when NEXT_PUBLIC_API_SECRET is set.
 * Returns typed JSON responses with built-in error handling.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers);

  const key = process.env.NEXT_PUBLIC_API_SECRET;
  if (key) headers.set("x-api-key", key);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(path, { ...init, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new ApiError(res.status, body);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

/**
 * Convenience methods for common HTTP verbs.
 */
export const api = {
  get: <T = unknown>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "GET" }),

  post: <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "DELETE" }),
};
