import { api } from "@/lib/api";

export const supportService = {
  getReports: (params?: { page?: number; limit?: number; status?: string; priority?: string }) =>
    api.get<any[]>("/support/reports", params as any),

  createReport: (data: { title: string; description: string; category: string; priority: string; shopId?: string }) =>
    api.post<any>("/support/reports", data),

  updateReport: (id: string, data: { status?: string; notes?: string }) =>
    api.put<any>(`/support/reports/${id}`, data),

  getStats: () => api.get<any>("/support/reports/stats"),
};
