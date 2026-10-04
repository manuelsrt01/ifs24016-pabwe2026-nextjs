import { DELCOM_BASEURL } from "@/lib/config";
import type { ApiResponse } from "@/types";

const TOKEN_KEY = "accessToken";
const hasWindow = () => typeof window !== "undefined";

export const getAccessToken = (): string | null =>
  hasWindow() ? window.localStorage.getItem(TOKEN_KEY) : null;

export const putAccessToken = (token: string): void => {
  if (hasWindow()) window.localStorage.setItem(TOKEN_KEY, token);
};

export const removeAccessToken = (): void => {
  if (hasWindow()) window.localStorage.removeItem(TOKEN_KEY);
};

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

type Params = Record<string, string | number | boolean | null | undefined>;

interface CallOptions {
  method?: string;
  params?: Params;
  body?: unknown;
}

const buildUrl = (path: string, params?: Params): string => {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const queryString = query.toString();
  return `${DELCOM_BASEURL}${path}${queryString ? `?${queryString}` : ""}`;
};

export async function apiCall<T = null>(
  path: string,
  { method = "GET", params, body }: CallOptions = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { Accept: "application/json" };

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData)
    headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(
      "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.",
    );
  }

  let json: ApiResponse<T> | null = null;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    json = null;
  }

  if (!response.ok || json?.status === "fail" || json?.status === "error") {
    throw new ApiRequestError(
      json?.message || `Permintaan gagal (HTTP ${response.status})`,
      response.status,
    );
  }

  return json as ApiResponse<T>;
}

export const apiGet = <T = null>(path: string, params?: Params) =>
  apiCall<T>(path, { method: "GET", params });
export const apiPost = <T = null>(path: string, body?: unknown) =>
  apiCall<T>(path, { method: "POST", body });
export const apiPut = <T = null>(path: string, body?: unknown) =>
  apiCall<T>(path, { method: "PUT", body });
export const apiDelete = <T = null>(path: string) =>
  apiCall<T>(path, { method: "DELETE" });
