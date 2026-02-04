import z from "zod";

export const SaleSchema: z.ZodType<any> = z.object({
  id: z.string(), // transaction id

  cashierId: z.string(),
  cashierName: z.string(),

  items: z.lazy(() => z.array(SaleSchema).min(1)),

  subtotal: z.number().positive(),
  taxRate: z.number().min(0).max(1),
  taxAmount: z.number().min(0),

  discount: z.number().min(0).default(0),

  totalAmount: z.number().positive(),

  paymentMethod: z.enum(["cash", "card", "mobile_money"]),
  amountPaid: z.number().positive(),
  changeGiven: z.number().min(0),

  totalProfit: z.number(),

  status: z.enum(["completed", "held", "cancelled", "refunded"]),

  createdAt: z.date(),
});
