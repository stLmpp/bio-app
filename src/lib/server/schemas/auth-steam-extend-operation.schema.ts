import { z } from 'zod';

export const AuthSteamExtendOperationSchema = z.object({
  suggestedPlayerName: z.string(),
});

export interface AuthSteamExtendOperationBody {
  secondsToExtend: number;
}
