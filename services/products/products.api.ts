// lib/api/products.ts
import { get } from "@/lib/api/requests";
import { Product } from "@/lib/api/types";

export const getProducts = async (): Promise<Product[]> => {
  const response = await get("/products/all-products");
  return response.map((p: any) => ({
    ...p,
    price: Number(p.price),
    cost: Number(p.cost),
  }));
};