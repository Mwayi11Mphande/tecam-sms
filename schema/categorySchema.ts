import z from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),

  createdAt: z.date(),
});
