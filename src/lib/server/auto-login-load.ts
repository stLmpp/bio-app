import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';
import { safeDecode } from '$lib/server/safe-decode-jwt';
import { http } from '$lib/server/http';
import { AUTH_AUTO_LOGIN_END_POINT } from '$env/static/private';
import { AutoLoginSchema } from '$lib/server/auto-login.schema';
import { type Cookies, redirect } from '@sveltejs/kit';

export function autoLoginLoad(admin = false) {
  return async ({ cookies, locals }: { cookies: Cookies; locals: App.Locals }) => {
    const accessToken = cookies.get(ACCESS_TOKEN_COOKIE_KEY);
    if (!accessToken) {
      throw redirect(301, '/');
    }
    const decoded = safeDecode(accessToken);
    if (!decoded?.exp || Date.now() >= decoded.exp * 1000) {
      cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
      locals.player = null;
      locals.user = null;
      throw redirect(301, '/');
    }
    const [response, responseError] = await http(AUTH_AUTO_LOGIN_END_POINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      fetch,
      schema: AutoLoginSchema,
    });
    if (responseError) {
      cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
      locals.player = null;
      locals.user = null;
      throw redirect(301, '/');
    }
    locals.user = response.user;
    locals.player = response.player;
    if (admin && !response.user.admin) {
      throw redirect(301, '/b');
    }
    return {
      user: response.user,
      player: response.player,
    };
  };
}
