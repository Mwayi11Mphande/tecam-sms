import { api } from "@/lib/api";

export const expenseService = {
  getAll: (params?: { category?: string; startDate?: string; endDate?: string }) =>
    api.get<any[]>("/expenses", params as any),

  create: (data: {
    category: string;
    description: string;
    amount: number;
    receiptUrl?: string;
    notes?: string;
    expenseDate?: string;
  }) => api.post<any>("/expenses", data),

  getCategories: () => api.get<string[]>("/expenses/categories"),

  getTotal: (params?: { startDate?: string; endDate?: string }) =>
    api.get<any>("/expenses/total", params as any),
};
