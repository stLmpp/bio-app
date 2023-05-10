import { z } from 'zod';

export const AuthRegisterSchema = z.object({
  userId: z.string(),
});

export interface AuthRegisterBody {
  email: string;
  username: string;
  password: string;
  regionId?: number;
}
