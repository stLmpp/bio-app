import { z } from 'zod';

export const AuthSteamRegisterWithOperationSchema = z.object({
  token: z.string(),
});

export interface AuthSteamRegisterWithOperationBody {
  name: string;
  email: string;
  regionId?: number;
}
