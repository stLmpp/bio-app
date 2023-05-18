import { parseFormData } from '$lib/server/form-data';
import { ModeService } from '$lib/server/services/mode.service';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions } from './$types';

export const actions = {
  default: async ({ fetch, request }) => {
    const [formDataError, formData] = await parseFormData(
      zfd.formData({
        name: zfd.text(z.string().trim().nonempty().max(100)),
        playerQuantity: zfd.numeric(z.number().min(1).max(10)),
      }),
      await request.formData()
    );
    if (formDataError) {
      return fail(formDataError.status, { error: formDataError });
    }
    const modeService = ModeService.create(fetch);
    const [responseError] = await modeService.post(formData);
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    throw redirect(301, '/a/mode');
  },
} satisfies Actions;
