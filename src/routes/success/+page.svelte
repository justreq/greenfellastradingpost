<script lang="ts">
	import { page } from "$app/state";
	import { PUBLIC_BASE } from "$env/static/public";
	import type { User } from "@supabase/supabase-js";
	import { onMount } from "svelte";
	let { supabase, user } = $derived(page.data);

	onMount(async () => {
		let route = localStorage.getItem("redirect-route") ?? "";
		localStorage.removeItem("redirect-route");

		if (localStorage.getItem("spotCart") != null) {
			const { error } = await supabase
				.from("break_spots")
				.update({ owner_id: user.id })
				.eq("id", JSON.parse(localStorage.getItem("spotCart") as string).spot_id);
			if (error) throw error;
			localStorage.removeItem("spotCart");

			const { error: userError } = await supabase.from("users").insert({ id: (user as User).id, email: "", display_name: (user as User).user_metadata.displayName });
			if (userError) throw userError;
		}

		if (route.includes("psa")) {
			localStorage.removeItem("psa-form-data");
		}

		location.href = PUBLIC_BASE + route;
	});
</script>
