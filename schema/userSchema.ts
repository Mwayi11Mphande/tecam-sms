import z from "zod"

export const UserSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),

  role: z.enum(["admin", "cashier"]),

  isActive: z.boolean().default(true),

  createdAt: z.date(),
});
