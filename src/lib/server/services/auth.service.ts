import { AUTH_AUTO_LOGIN_END_POINT, AUTH_END_POINT } from '$env/static/private';
import { httpServer } from '../http-server';
import { AuthAutoLoginSchema } from '../schemas/auth-auto-login.schema';
import { AuthLoginSchema, type AuthLoginBody } from '../schemas/auth-login.schema';
import {
  AuthRegisterSchema,
  type AuthRegisterBody,
} from '../schemas/auth-register.schema';

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

  static create(_fetch: typeof fetch) {
    return new AuthService(_fetch);
  }
}
