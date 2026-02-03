import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from './infrastructure/logger';

// 1. Initialize the app immediately at the top level for Vercel
const app = createApp();

async function startServer() {
    try {
        // We use the 'app' instance created above
        const server = app.listen(env.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${env.PORT}`);
            logger.info({ port: env.PORT, env: env.NODE_ENV }, "🚀 Server started");
        });

        const shutdown = () => {
            console.log('\nStopping server gracefully...');
            server.close(async () => {
                console.log('HTTP server closed.');
                process.exit(0);
            });

            setTimeout(() => {
                console.error('Forceful shutdown');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        logger.fatal({ err: error }, "💀 FATAL ERROR during server startup");
        process.exit(1);
    }
};

// 2. Only run the listener if we ARE NOT on Vercel
// Vercel sets the VERCEL environment variable automatically
if (!process.env.VERCEL) {
    startServer();
}

// 3. EXPORT the app for Vercel
export default app;