import type { Actions } from './$types';
import { PUBLIC_USER_END_POINT } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ fetch, request, cookies }) => {
    const formData = await request.formData();
    const response = await fetch(`${PUBLIC_USER_END_POINT}/login`, {
      method: 'POST',
      body: JSON.stringify({
        usernameOrEmail: formData.get('usernameOrEmail'),
        password: formData.get('password'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      return fail(response.status);
    }
    const { accessToken } = await response.json();
    cookies.set('ACCESS_TOKEN', accessToken, { httpOnly: true });
    throw redirect(302, '/b');
  },
} satisfies Actions;
