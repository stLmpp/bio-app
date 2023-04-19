import type { LayoutServerLoad } from './$types';
import { autoLoginLoad } from '$lib/server/auto-login-load';

export const load = autoLoginLoad() satisfies LayoutServerLoad;
