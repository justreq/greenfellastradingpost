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
			let owner = "";

			if (!user) {
				const { data } = await supabase.auth.signInAnonymously();
				await supabase.auth.updateUser({ data: { displayName: "Guest" } });
				const { error } = await supabase.from("users").insert({ id: (data.user as User).id, display_name: "Guest" });
				if (error) throw error;

				owner = data.user.id;
			} else owner = user.id;

			const { error } = await supabase
				.from("break_spots")
				.update({ owner_id: owner })
				.eq("id", JSON.parse(localStorage.getItem("spotCart") as string).spot_id);
			if (error) throw error;
			localStorage.removeItem("spotCart");
		} else if (localStorage.getItem("cart") != null) {
			localStorage.removeItem("cart");
		}

		if (route.includes("psa")) {
			localStorage.removeItem("psa-form-data");
		}

		location.href = PUBLIC_BASE + route;
	});
</script>
