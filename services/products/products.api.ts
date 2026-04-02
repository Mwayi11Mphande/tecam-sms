// lib/api/products.ts
import { get, post } from "@/lib/api/requests";
import { Category, Product } from "@/lib/api/types";

export const getProducts = async (): Promise<Product[]> => {
  const response = await get("/products/all-products");
  return response.map((p: any) => ({
    ...p,
    price: Number(p.price),
    cost: Number(p.cost),
  }));
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await get("/categories/get-categories");
  console.log("Categories response:", response);
  return response;
};

export const createProduct = async (data: {
  name: string
  sku: string
  price: number
  cost: number
  stockQty: number
  categoryId: string
}): Promise<Product> => {
  console.log("Product Data", data)
  const response = await post("/products/add-product", data)
  console.log("Add Product Response", response)
  return response
}