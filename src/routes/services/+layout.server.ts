import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { supabase } }) => {
	const streams = await supabase.from("streams").select();

	return {
		streams: streams.data ?? [],
	};
}) satisfies LayoutServerLoad;
