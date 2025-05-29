import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase } }) => {
	const repackChecklist = await supabase.from("repack_checklist").select();
	return {
		repackChecklist: repackChecklist.data ?? [],
	};
}) satisfies PageServerLoad;
