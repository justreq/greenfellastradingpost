import { supabase } from "$lib/supabaseClient";

export async function load() {
	const products = await supabase.from("products").select();

	return {
		products: products.data ?? [],
	};
}
