import { api } from "@/lib/api";

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>("/auth/login", { email, password }),

  register: (data: { fullName: string; email: string; password: string; shopName: string; phone?: string }) =>
    api.post<{ token: string; user: any; shop: any }>("/auth/register", data),

  getProfile: () => api.get<any>("/auth/me"),

  updateProfile: (data: { fullName?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    api.put<any>("/auth/profile", data),
};
