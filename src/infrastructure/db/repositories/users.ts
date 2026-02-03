// packages/db/src/repositories/users.ts

import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema/user";
import { UserRegistration, UserUpdate } from "../validators/users";

export const userRepository = {
    // Correct: Method shorthand (no "function" keyword)
    async create(input: UserRegistration) {
        const [user] = await db
            .insert(users)
            .values(input)
            .returning();
        return user;
    },

    // Correct: Short, repository-focused names
    async findByEmail(email: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        return user || null; // Explicitly return null if not found
    },

    async updateById(userId: string, data: UserUpdate) {
        const [updatedUser] = await db
            .update(users)
            .set(data)
            .where(eq(users.id, userId))
            .returning();
        return updatedUser ?? null;
    },
    /**
     * Find a single user by their unique ID
     */
    async findById(id: string) {
        return await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, id),
        });
    }
};