// lib/api/sales.ts

import { post } from "@/lib/api/requests"

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