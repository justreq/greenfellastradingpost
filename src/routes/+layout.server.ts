import { supabase } from "$lib/supabaseClient";

export const load = async () => {
	const cards = await supabase.from("cards").select();
	const products = await supabase.from("products").select();

	return {
		cards: cards.data ?? [],
		products: products.data ?? [],
	};
};
