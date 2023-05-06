import { autoLoginLoad } from '$lib/server/auto-login-load';
import type { LayoutServerLoad } from './$types';

export const load = autoLoginLoad() satisfies LayoutServerLoad;
