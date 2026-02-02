import z from 'zod';
import 'dotenv/config'

const envSchema = z.object({
    DATABASE_URL: z.string().url(),

    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    PORT: z.coerce.number().default(5000),

    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_PASSWORD_RESET_SECRET: z.string(),
    JWT_ACCESS_SECRET_EXPIRES_IN: z.string(),
    JWT_REFRESH_SECRET_EXPIRES_IN: z.string(),
    JWT_PASSWORD_RESET_SECRET_EXPIRES_IN: z.string(),

    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_SECURE: z.coerce.boolean(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    MAIL_FROM: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Invalid Environment Variables:", _env.error.format());
    process.exit(1);
}

export const env = _env.data;