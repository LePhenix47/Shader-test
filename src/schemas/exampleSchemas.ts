import { z } from 'zod';

// Example user schema
export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(0).max(120).optional(),
});

export type User = z.infer<typeof userSchema>;

// Example form schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

export type LoginForm = z.infer<typeof loginSchema>;

// Example API response schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;
