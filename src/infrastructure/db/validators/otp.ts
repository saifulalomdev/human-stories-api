import z from "zod";

const OTP_LENGTH = 6

export const otpSchema = z.object({
    email: z.email("Invalid otp"),
    code: z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digit`),
})