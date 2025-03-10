import { supabase } from "$lib/supabaseClient";

export const load = async () => {
	// const products = await supabase.from("products").select();
	// const cards = await supabase.from("cards").select();

	return {
		// products: products.data ?? [],
		// cards: cards.data ?? [],
	};
};
