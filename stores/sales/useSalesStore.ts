// stores/useSalesStore.ts

import { create } from "zustand"
import { Sale } from "@/lib/api/types"
import { getSales } from "@/services/sales/sales.api"

type SalesStore = {
  sales: Sale[]
  isLoading: boolean
  error: string | null

  fetchSales: () => Promise<void>

  addSale: (sale: Sale) => void

  clearSales: () => void
}

export const useSalesStore =
  create<SalesStore>((set) => ({
    sales: [],

    isLoading: false,

    error: null,

    fetchSales: async () => {
      try {
        set({
          isLoading: true,
          error: null,
        })

        const sales = await getSales()

        set({
          sales,
          isLoading: false,
        })
      } catch (error: any) {
        console.error(
          "FETCH SALES ERROR:",
          error
        )

        set({
          error:
            error?.message ||
            "Failed to fetch sales",
          isLoading: false,
        })
      }
    },

    addSale: (sale) =>
      set((state) => ({
        sales: [sale, ...state.sales],
      })),

    clearSales: () =>
      set({
        sales: [],
      }),
  }))
