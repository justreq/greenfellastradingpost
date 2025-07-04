export const load = async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const { session } = await safeGetSession();
	const cards = await supabase.from("cards").select().eq("retail", true);

	return {
		session,
		cookies: cookies.getAll(),
		cards: cards.data ?? [],
	};
};
