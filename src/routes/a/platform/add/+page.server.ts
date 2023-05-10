import { parseFormData } from '$lib/server/form-data';
import { PlatformService } from '$lib/server/services/platform.service';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions } from './$types';

export const actions = {
  default: async ({ fetch, request }) => {
    const [formDataError, formData] = await parseFormData(
      zfd.formData({
        name: zfd.text(z.string().trim().nonempty().max(100)),
        shortName: zfd.text(z.string().trim().nonempty().max(10)),
      }),
      await request.formData()
    );
    if (formDataError) {
      return fail(formDataError.status, { error: formDataError });
    }
    const platformService = PlatformService.create(fetch);
    const [responseError] = await platformService.post(formData);
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    throw redirect(StatusCodes.MOVED_PERMANENTLY, '/a/platform');
  },
} satisfies Actions;
