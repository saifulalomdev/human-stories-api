import { serve } from '@hono/node-server';
import app from './index.js';

serve({
    fetch: app.fetch,
    port: 5000
}, (info) => {
    console.log(`🚀 Server running on http://localhost:${info.port}`)
});

