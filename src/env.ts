import { z } from "zod";
import type { ImportMetaEnv } from "./vite-env";

/**
 * Environment variables schema using Zod for runtime validation
 * This ensures type safety and validates that all required env vars are present
 * Must match the ImportMetaEnv interface in vite-env.d.ts
 */
const EnvSchema = z.object({
  // Vite built-in variables
  BASE_URL: z.string(),
  DEV: z.boolean(),
  MODE: z.string(),
  PROD: z.boolean(),
  SSR: z.boolean(),

  // Custom environment variables
  VITE_BASE_PATH: z.string(),
  // Add more custom variables here
  // IMPORTANT: Also add them to ImportMetaEnv in vite-env.d.ts
  // Example:
  // VITE_API_URL: z.string().url(),
  // VITE_API_KEY: z.string().min(1),
}) satisfies z.ZodType<ImportMetaEnv>;

/**
 * Type inference from the schema
 */
type EnvType = z.infer<typeof EnvSchema>;

/**
 * Parse and validate environment variables at runtime
 */
function validateEnv(): EnvType {
  try {
    const parsed = EnvSchema.parse(import.meta.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment variable validation failed:");
      console.error(error.format());
    }
    throw new Error(
      "Failed to validate environment variables. Check console for details."
    );
  }
}

/**
 * Validated and typed environment variables
 * Use this throughout the app instead of import.meta.env
 */
const env = validateEnv();

export default env;
