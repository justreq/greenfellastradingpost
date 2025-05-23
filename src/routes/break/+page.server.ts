import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const breakSpots = await supabase.from("break_spots").select();
	return {
		breakSpots: breakSpots.data ?? [],
	};
}) satisfies PageServerLoad;
