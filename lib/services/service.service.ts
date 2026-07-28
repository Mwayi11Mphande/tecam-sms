import { api } from "@/lib/api";

export const serviceApi = {
  getAll: (shopId?: string) =>
    api.get<any[]>("/services", shopId ? { shopId } as any : undefined),

  create: (data: { name: string; price: number; shopId?: string }) =>
    api.post<any>("/services", data),

  update: (id: string, data: { name?: string; price?: number; isActive?: boolean }) =>
    api.put<any>(`/services/${id}`, data),

  delete: (id: string) => api.delete<any>(`/services/${id}`),
};
