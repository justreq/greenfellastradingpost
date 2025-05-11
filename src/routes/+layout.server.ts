import { supabase } from "$lib/supabaseClient";

export const load = async () => {
	const users = await supabase.from("users").select();
	const cards = await supabase.from("cards").select();
	const products = await supabase.from("products").select();
	const breaks = await supabase.from("breaks").select();
	const breakSpots = await supabase.from("break_spots").select();
	const repacks = await supabase.from("repacks").select();

	return {
		users: users.data ?? [],
		cards: cards.data ?? [],
		products: products.data ?? [],
		break: (breaks.data as any[])[0] ?? null,
		breakSpots: breakSpots.data ?? [],
		repack: (repacks.data as any[])[0] ?? null,
	};
};
