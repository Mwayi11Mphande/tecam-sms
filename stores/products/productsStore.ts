import { Category, Product } from "@/lib/api/types";
import { createProduct, getCategories, getProducts } from "@/services/products/products.api";
import { create } from "zustand";


interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (data: {
    name: string
    sku: string
    price: number
    cost: number
    stockQty: number
    categoryId: string
  }) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProducts();
      set({ products: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch products", loading: false });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCategories();
      set({ categories: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch categories", loading: false });
    }
  },

  addProduct: async (data) => {
    set({ loading: true, error: null });

    try {
      const newProduct = await createProduct(data);

      set((state) => ({
        products: [newProduct, ...state.products],
        loading: false,
      }));

    } catch (err: any) {
      set({
        error: err.message || "Failed to add product",
        loading: false,
      });
    }
  },
}));