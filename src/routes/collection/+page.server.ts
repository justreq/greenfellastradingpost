import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const products = await supabase.from("products").select();

	return {
		products: products.data ?? [],
	};
}) satisfies PageServerLoad;
