import { z } from 'zod';
import { createUserSchema } from './create-user.dto';

// Define the UpdateUser schema by making all fields optional
export const updateUserSchema = createUserSchema.partial();

// Export the inferred type for UpdateUser
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
