import { PlayerService } from '$lib/server/services/player.service';
import { z } from 'zod';
import { parseFormData } from '$lib/server/form-data';
import type { Actions, PageServerLoad } from './$types';
import { zfd } from 'zod-form-data';
import { error, fail } from '@sveltejs/kit';
import { RegionService } from '$lib/server/services/region.service';

export const actions = {
  default: async ({ fetch, request }) => {
    const [formError, form] = await parseFormData(
      zfd.formData({
        steamid: zfd.text(z.string().trim().nonempty().max(100)),
        name: zfd.text(
          z
            .string()
            .trim()
            .min(3, 'Player name must have at least 3 characters')
            .max(50)
            .optional()
        ),
      }),
      await request.formData()
    );
    if (formError) {
      return fail(formError.status, { error: formError });
    }
    const playerService = PlayerService.create(fetch);
    const [playerError, player] = await playerService.createSteam(form.steamid, {
      name: form.name || undefined,
    });
    if (playerError) {
      return fail(playerError.status, { error: playerError });
    }
    return { player };
  },
} satisfies Actions;

export const load = (async (event) => {
  const regionService = RegionService.create(event);
  const [regionsError, regions] = await regionService.get();
  if (regionsError) {
    throw error(regionsError.status, regionsError);
  }
  return { regions };
}) satisfies PageServerLoad;
