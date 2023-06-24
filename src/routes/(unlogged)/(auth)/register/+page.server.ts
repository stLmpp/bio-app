import { parseFormData } from '$lib/server/form-data';
import { AuthService } from '$lib/server/services/auth.service';
import { RegionService } from '$lib/server/services/region.service.js';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const actions = {
  default: async (event) => {
    const [formError, form] = await parseFormData(
      zfd.formData({
        username: zfd.text(z.string().trim().max(50).min(3)),
        email: zfd.text(z.string().trim().email().max(254)),
        password: zfd.text(z.string().min(6)),
        regionId: zfd.numeric(z.number().optional()),
      }),
      await event.request.formData()
    );
    if (formError) {
      return fail(formError.status, { error: formError });
    }
    const authService = AuthService.create(event.fetch);
    const [responseError] = await authService.register(form);
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    const query = new URLSearchParams({
      username: form.username,
    });
    throw redirect(301, `/login?${query.toString()}`, {}, event);
  },
};

export async function load(event) {
  const regionService = RegionService.create(event);
  const [regionsError, regions] = await regionService.get();
  if (regionsError) {
    throw error(regionsError.status, regionsError);
  }
  return { regions };
}
