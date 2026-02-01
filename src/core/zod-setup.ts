import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// This file must be imported at the very top of your entry point
extendZodWithOpenApi(z);

export { z };