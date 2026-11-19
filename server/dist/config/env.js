import { z } from 'zod';
const envSchema = z.object({
    PORT: z.preprocess((value) => (value === '' ? undefined : value), z
        .string()
        .regex(/^\d+$/, 'PORT must contain only digits')
        .transform(Number)
        .pipe(z.number().int().min(1).max(65535))
        .default(4000)),
    NODE_ENV: z.enum(['development', 'test', 'production']),
});
export const env = envSchema.parse(process.env);
