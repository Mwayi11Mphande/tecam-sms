import z from "zod";

export const ShopSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(150),

  currency: z.string().default("MWK"),
  taxRate: z.number().min(0).max(1),

  address: z.string().optional(),
  phone: z.string().optional(),

  createdAt: z.date(),
});

