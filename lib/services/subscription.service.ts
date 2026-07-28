import { api } from "@/lib/api";

export const subscriptionService = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<any[]>("/shops", params as any),

  update: (shopId: string, data: { plan?: string; status?: string; expiry?: string; amountPaid?: number; paymentMethod?: string }) =>
    api.put<any>(`/shops/${shopId}/subscription`, data),

  getStats: () => api.get<any>("/shops/stats"),
};
