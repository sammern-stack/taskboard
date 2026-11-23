import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .string()
      .regex(/^\d+$/, 'PORT must contain only digits')
      .transform(Number)
      .pipe(z.number().int().min(1).max(65535))
      .default(4000)
  ),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  MONGODB_URI: z
    .string()
    .regex(
      /^mongodb(?:\+srv)?:\/\//,
      'You must provide a valid mongodb connection string'
    ),
  JWT_SECRET: z.string().min(32)
})

export type ParsedEnv = z.output<typeof envSchema>

export const parseEnv = (input: unknown) => {
  return envSchema.parse(input)
}
