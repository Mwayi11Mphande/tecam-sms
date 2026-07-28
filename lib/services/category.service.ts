import { api } from "@/lib/api";

export const categoryService = {
  getAll: (shopId: string) => api.get<any[]>("/categories", { shopId }),

  create: (data: { name: string; shopId: string }) => api.post<any>("/categories", data),

  update: (id: string, data: { name: string }) => api.put<any>(`/categories/${id}`, data),

  delete: (id: string) => api.delete<any>(`/categories/${id}`),
};
