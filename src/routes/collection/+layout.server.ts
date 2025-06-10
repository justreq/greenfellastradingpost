import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { supabase } }) => {
	const cards = await supabase.from("cards").select();

	return {
		cards: cards.data ?? [],
	};
}) satisfies LayoutServerLoad;
