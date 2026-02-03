import { db } from "../db";
import { otps } from "../schema/otp";
import { eq, and, gt } from "drizzle-orm";

export const otpRepository = {
    async createOTP(userId: string, code: string, type: "PASSWORD_RESET" | "EMAIL_VERIFICATION") {
        // 1. Delete old OTPs of this type for this user
        await db.delete(otps).where(and(eq(otps.userId, userId), eq(otps.type, type)));

        // 2. Insert new OTP (valid for 5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        return db.insert(otps).values({ userId, code, type, expiresAt }).returning();
    },

    async findValidOTP(userId: string, code: string, type: "PASSWORD_RESET" | "EMAIL_VERIFICATION") {
        const results = await db
            .select()
            .from(otps)
            .where(
                and(
                    eq(otps.userId, userId),
                    eq(otps.code, code),
                    eq(otps.type, type),
                    gt(otps.expiresAt, new Date())
                )
            )
            .limit(1);

        return results[0] || null; // Returns the first match or null
    },

    async deleteOTP(id: string) {
        await db.delete(otps).where(eq(otps.id, id));
    }
};