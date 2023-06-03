import { z } from 'zod';

export const AuthGetSteamAuthUrlSchema = z.object({
  url: z.string(),
});

export interface AuthGetSteamAuthUrlQuery {
  replyTo: string;
  redirectTo: string;
}
