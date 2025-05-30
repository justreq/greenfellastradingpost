import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals: { supabase } }) => {
	if (params.stream && !["mag", "slab", "break", "repack"].includes(params.stream)) throw redirect(302, "/");

	const streams = await supabase.from("streams").select();

	if (params.stream == "break") {
		const breakSpots = await supabase.from("break_spots").select();
		const users = await supabase.from("users").select();

		return {
			type: params.stream,
			streams: streams.data ?? [],
			breakSpots: breakSpots.data ?? [],
			users: users.data ?? [],
		};
	}

	return {
		type: params.stream,
		streams: streams.data ?? [],
	};
}) satisfies PageServerLoad;
