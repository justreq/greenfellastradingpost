import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { supabase } }) => {
	const cards = await supabase.from("cards").select().eq("retail", true);

	return {
		cards: cards.data ?? [],
	};
}) satisfies LayoutServerLoad;
