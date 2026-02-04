import { db } from "@/db/index.js";
import { InsertUser } from "./auth.validator.js";
import { users } from "@/db/schemas/index.js";

export const userRepo = {
    create: async (userData: InsertUser) => {
        const [newUser] = await db
            .insert(users)
            .values(userData)
            .returning()
        return newUser
    },
    findByEmail: async (email: string) => {
        return await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        });
    }
}