import { api } from "@/lib/api";

export const paymentService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<any[]>("/payments", params as any),

  record: (data: { shopId: string; amount: number; method: string; reference?: string }) =>
    api.post<any>("/payments/record", data),

  getStats: () => api.get<any>("/payments/stats"),
};
