import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const repackChecklist = await supabase.from("repack_checklist").select();
	return {
		repackChecklist: repackChecklist.data ?? [],
	};
}) satisfies PageServerLoad;
