import z from 'zod';

export const email = z.object({
    email: z.email()
})