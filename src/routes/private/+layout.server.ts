import { isSuperUser } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { supabase, user } }) => {
	if (!isSuperUser(user)) throw redirect(302, "/");
	const cards = await supabase.from("cards").select();

	return {
		cards: cards.data ?? [],
	};
}) satisfies LayoutServerLoad;
