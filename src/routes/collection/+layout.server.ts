import { supabase } from "$lib/supabaseClient";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
	const cards = await supabase.from("cards").select();
	const products = await supabase.from("products").select();

	return {
		cards: cards.data ?? [],
		products: products.data ?? [],
	};
}) satisfies LayoutServerLoad;
