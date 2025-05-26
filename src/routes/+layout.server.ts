import { supabase } from "$lib/supabaseClient";

export const load = async () => {
	const users = await supabase.from("users").select();
	const streams = await supabase.from("streams").select();

	return {
		users: users.data ?? [],
		streams: streams.data ?? [],
	};
};
