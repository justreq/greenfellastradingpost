import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals: { supabase } }) => {
	if (params.service && !["singles", "breaks", "repacks", "psa", "consignments"].includes(params.service)) throw redirect(302, "/");

	const streams = await supabase.from("streams").select();

	if (params.service == "breaks") {
		const breakSpots = await supabase.from("break_spots").select();
		const users = await supabase.from("users").select();

		return {
			type: params.service,
			streams: streams.data == null ? [] : streams.data.filter((e) => e.type == params.service),
			breakSpots: breakSpots.data ?? [],
			users: users.data ?? [],
		};
	}

	return {
		type: params.service,
		streams: streams.data == null ? [] : streams.data.filter((e) => e.type == params.service),
	};
}) satisfies PageServerLoad;
