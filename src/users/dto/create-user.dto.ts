import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().nonempty(),
  displayName: z.string().nonempty(),
  email: z.string().email().nonempty(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;