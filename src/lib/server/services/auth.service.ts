import {
  AUTH_AUTO_LOGIN_END_POINT,
  AUTH_END_POINT,
  AUTH_STEAM_END_POINT,
} from '$env/static/private';
import { z } from 'zod';
import { httpServer } from '../http-server';
import { AuthAutoLoginSchema } from '../schemas/auth-auto-login.schema';
import {
  AuthGetSteamAuthUrlSchema,
  type AuthGetSteamAuthUrlQuery,
} from '../schemas/auth-get-steam-auth-url.schema';
import { AuthLoginSchema, type AuthLoginBody } from '../schemas/auth-login.schema';
import {
  AuthRegisterSchema,
  type AuthRegisterBody,
} from '../schemas/auth-register.schema';

// TODO change all $env/dynamic/private
export class AuthService {
  private constructor(private readonly _fetch: typeof fetch) {}

  login(body: AuthLoginBody) {
    return httpServer(`${AUTH_END_POINT}/login`, {
      fetch: this._fetch,
      schema: AuthLoginSchema,
      body,
      method: 'POST',
    });
  }

  register(body: AuthRegisterBody) {
    return httpServer(`${AUTH_END_POINT}/register`, {
      fetch: this._fetch,
      schema: AuthRegisterSchema,
      body,
      method: 'POST',
    });
  }

  autoLogin(accessToken?: string) {
    const headers: { authorization?: string } = {};
    if (accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    }
    return httpServer(AUTH_AUTO_LOGIN_END_POINT, {
      fetch: this._fetch,
      schema: AuthAutoLoginSchema,
      method: 'POST',
      headers,
    });
  }

  getSteamAuthUrl(query: AuthGetSteamAuthUrlQuery) {
    return httpServer(`${AUTH_STEAM_END_POINT}/url`, {
      fetch: this._fetch,
      schema: AuthGetSteamAuthUrlSchema,
      query,
    });
  }

  getSteamAuthToken(operationId: string) {
    return httpServer(`${AUTH_STEAM_END_POINT}/operation/${operationId}/token`, {
      fetch: this._fetch,
      schema: z.object({
        token: z.string(),
      }),
      method: 'POST',
    });
  }

  static create(_fetch: typeof fetch) {
    return new AuthService(_fetch);
  }
}
