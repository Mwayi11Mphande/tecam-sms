const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: { total: number; page: number; limit: number };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
    params?: Record<string, string | number | undefined>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
      });
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Request failed");
    return json;
  }

  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return this.request<T>("GET", path, undefined, params);
  }

  post<T>(path: string, body?: any) {
    return this.request<T>("POST", path, body);
  }

  put<T>(path: string, body?: any) {
    return this.request<T>("PUT", path, body);
  }

  patch<T>(path: string, body?: any) {
    return this.request<T>("PATCH", path, body);
  }

  delete<T>(path: string) {
    return this.request<T>("DELETE", path);
  }
}

export const api = new ApiClient(API_BASE);
export type { ApiResponse };
