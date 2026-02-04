import { defineConfig } from "drizzle-kit";
// @ts-ignore - Stop the extension yelling, I just want to build.
import { env } from "./src/config/env";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schemas/*",
    out: "./drizzle",
    dbCredentials: {
        url: env.DATABASE_URL
    }
});