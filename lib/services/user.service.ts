import { api } from "@/lib/api";

export const userService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) =>
    api.get<any[]>("/users", params as any),

  getById: (id: string) => api.get<any>(`/users/${id}`),

  create: (data: { fullName: string; email: string; password: string; role: string; shopId?: string }) =>
    api.post<any>("/users", data),

  createCashier: (data: { fullName: string; email: string; password: string }) =>
    api.post<any>("/users/create-cashier", data),

  update: (id: string, data: any) => api.put<any>(`/users/${id}`, data),

  delete: (id: string) => api.delete<any>(`/users/${id}`),

  getStaff: () => api.get<any[]>("/users/get-staff"),

  resetPassword: (id: string, password: string) =>
    api.put<any>(`/users/${id}/reset-password`, { password }),
};
