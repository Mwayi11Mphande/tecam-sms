import z from "zod";

export const CartItemSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().min(1),
  total: z.number().positive(),
});
