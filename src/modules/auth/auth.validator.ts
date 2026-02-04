import { users } from "@/db/schemas/index.js";
import { createInsertSchema } from 'drizzle-zod';
import z from "zod";

export const userBaseSchema = createInsertSchema(users, {
    name: (s) => s.min(2).max(10),
    email: (s) => s.email("Pleas provide a valid email!")
});

export const userRegisterSchema = userBaseSchema.pick({
    name: true,
    email: true
}).openapi("Register user input");

export const userLoginSchema = userBaseSchema.pick({
    email: true
}).openapi("Login user input");

export const authResponse= z.object({
    user: userBaseSchema,
    accessToken: z.jwt()
})


export type InsertUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect