import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from './infrastructure/logger';

async function startServer() {
    try {
        const app = await createApp();

        const server = app.listen(env.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${env.PORT}`);
            logger.info({ port: env.PORT, env: env.NODE_ENV }, "🚀 Server started");
        });

        // --- GRACEFUL SHUTDOWN LOGIC ---
        const shutdown = () => {
            console.log('\nStopping server gracefully...');
            server.close(async () => {
                console.log('HTTP server closed.');

                process.exit(0);
            });

            setTimeout(() => {
                console.error('Could not close connections in time, forcefully shutting down');
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

startServer();