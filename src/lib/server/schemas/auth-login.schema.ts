import { z } from 'zod';

export const AuthLoginSchema = z.object({
  accessToken: z.string(),
});

export interface AuthLoginBody {
  usernameOrEmail: string;
  password: string;
}
