import { api } from "@/lib/api";

export const productService = {
  getAll: (params?: { shopId?: string; page?: number; limit?: number; search?: string; categoryId?: string }) =>
    api.get<any[]>("/products", params as any),

  getById: (id: string) => api.get<any>(`/products/${id}`),

  create: (data: { name: string; sku: string; price: number; cost: number; stockQty?: number; categoryId?: string; category?: string; shopId: string }) =>
    api.post<any>("/products", data),

  update: (id: string, data: any) => api.put<any>(`/products/${id}`, data),

  delete: (id: string) => api.delete<any>(`/products/${id}`),
};
