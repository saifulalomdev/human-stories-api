import { eq, and, gt } from "drizzle-orm";
import { db } from "../db";
import { sessions } from "../schema/session";
import { SessionCreate } from "../validators/sessions";

export const sessionsRepository = {
    /**
     * Create a new session (JTI record)
     */
    async create(input: SessionCreate) {
        const [session] = await db
            .insert(sessions)
            .values(input)
            .returning();
        return session;
    },

    /**
     * Finds a valid, non-revoked session by its JTI (id)
     */
    async findValidSession(jti: string) {
        const [session] = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.id, jti),
                    eq(sessions.isRevoked, false),
                    gt(sessions.expiresAt, new Date()) // Ensure DB hasn't expired it yet
                )
            )
            .limit(1);
        return session || null;
    },

    /**
     * Revokes a single session (Logout)
     */
    async revokeSession(jti: string) {
        await db
            .update(sessions)
            .set({ isRevoked: true })
            .where(eq(sessions.id, jti));
    },

    /**
     * Revokes all sessions for a user (Global Logout / Password Reset)
     */
    async revokeAllUserSessions(userId: string) {
        await db
            .update(sessions)
            .set({ isRevoked: true })
            .where(eq(sessions.userId, userId));
    },
    async deleteSession(jti: string) {
        return await db.delete(sessions)
            .where(eq(sessions.id, jti));
    }
};