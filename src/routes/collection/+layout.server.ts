import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { supabase } }) => {
	const cards = await supabase.from("cards").select();
	const products = await supabase.from("products").select();

	return {
		cards: cards.data ?? [],
		products: products.data ?? [],
	};
}) satisfies LayoutServerLoad;
