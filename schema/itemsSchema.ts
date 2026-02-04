import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string(), // Firestore doc id

  name: z.string().min(2).max(100),
  sku: z.string().min(2).max(100),
  category: z.string().min(2).max(100),

  price: z.number().positive(), // selling price
  cost: z.number().positive(),  // buying price (for profit)

  stock: z.number().int().min(0),

  barcode: z.string().max(100).optional(),
  weight: z.number().positive().optional(),
  description: z.string().max(500).optional(),

  supplierId: z.string().optional(),

  isActive: z.boolean().default(true),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Item = z.infer<typeof ItemSchema>;
