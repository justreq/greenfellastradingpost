import { supabase } from "$lib/supabaseClient";

export async function load() {
	const products = await supabase.from("products").select();
	const cards = await supabase.from("cards").select();

	return {
		products: products.data ?? [],
		cards: cards.data ?? [],
	};
}
