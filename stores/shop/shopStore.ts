import { create } from "zustand";
import { Shop } from "@/lib/api/types";
import { getShop } from "@/services/shop/shop.api";

type ShopState = {
  shop: Shop | null;
  loading: boolean;
  fetchShop: () => Promise<void>;
};

export const useShopStore = create<ShopState>((set) => ({
  shop: null,
  loading: false,

  fetchShop: async () => {
    set({ loading: true });

    try {
      const shop = await getShop();
      set({ shop });
    } catch (error) {
      console.error("Failed to fetch shop", error);
    } finally {
      set({ loading: false });
    }
  },
}));