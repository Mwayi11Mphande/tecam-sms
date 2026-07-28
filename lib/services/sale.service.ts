import { api } from "@/lib/api";

export const saleService = {
  getAll: (params?: { shopId?: string; page?: number; limit?: number; startDate?: string; endDate?: string }) =>
    api.get<any[]>("/sales", params as any),

  getById: (id: string) => api.get<any>(`/sales/${id}`),

  create: (data: {
    shopId: string;
    items: { productId?: string; serviceId?: string; type: string; name: string; quantity: number; unitPrice: number }[];
    paymentMethod: string;
    amountPaid?: number;
  }) => api.post<any>("/sales", data),

  voidSale: (id: string, reason: string) => api.post<any>(`/sales/${id}/void`, { reason }),
};
