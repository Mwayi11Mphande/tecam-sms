// lib/api/sales.ts

import { post, get } from "@/lib/api/requests"
import { Sale } from "@/lib/api/types"

export type SaleItem = {
  productId: string
  quantity: number
}

export type CreateSalePayload = {
  paymentMethod: "CASH" | "CARD" | "MOBILE" | "BANK"
  items: SaleItem[]
  amountPaid: number
}

export const createSale = async (
  data: CreateSalePayload
) => {
  console.log("SALE PAYLOAD:", data)

  const response = await post(
    "/sales/create-sale",
    data
  )

  console.log("SALE RESPONSE:", response)

  return response
}

export const getSales = async (): Promise<Sale[]> => {
  const response = await get("/sales/get-sales")

  return response.map((sale: any) => ({
    ...sale,

    subtotal: Number(sale.subtotal),
    vatRate: Number(sale.vatRate),
    vatAmount: Number(sale.vatAmount),
    total: Number(sale.total),
    amountPaid: Number(sale.amountPaid),
    changeGiven: Number(sale.changeGiven),

    saleItems: sale.saleItems.map((item: any) => ({
      ...item,

      unitPrice: Number(item.unitPrice),
      vatAmount: Number(item.vatAmount),
      vatRate: Number(item.vatRate),
      subtotal: Number(item.subtotal),
      total: Number(item.total),
    })),
  }))
}