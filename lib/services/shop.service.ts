import { api } from "@/lib/api";

export const shopService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get<any[]>("/shops", params as any),

  getById: (id: string) => api.get<any>(`/shops/${id}`),

  create: (data: {
    name: string;
    ownerId?: string;
    phone?: string;
    email?: string;
    address?: string;
    plan?: string;
    ownerData?: { fullName: string; email: string; password: string };
  }) => api.post<any>("/shops", data),

  update: (id: string, data: any) => api.put<any>(`/shops/${id}`, data),

  delete: (id: string) => api.delete<any>(`/shops/${id}`),

  updateSubscription: (id: string, data: { plan: string; status?: string }) =>
    api.put<any>(`/shops/${id}/subscription`, data),

  approve: (id: string) => api.post<any>(`/shops/${id}/approve`),

  suspend: (id: string, reason: string) => api.post<any>(`/shops/${id}/suspend`, { reason }),

  closeDay: (id: string) => api.post<any>(`/shops/${id}/close-day`),

  getDailyCloses: (id: string) => api.get<any[]>(`/shops/${id}/daily-closes`),
};
