<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { redirect } from "@sveltejs/kit";
	import { onMount } from "svelte";

	let { supabase, user } = $derived(page.data);

	onMount(async () => {
		if (user == null || (localStorage.getItem("spotCart") == null && localStorage.getItem("tempCart") == null && localStorage.getItem("cart") == null)) redirect(302, "/");

		const { error } = await supabase
			.from("break_spots")
			.update({ owner_id: user.id })
			.eq("id", JSON.parse(localStorage.getItem("spotCart") as string).spot_id);
		if (error) throw error;
		localStorage.removeItem("spotCart");
		goto("/break#stream");
	});
</script>

<h2>Great Success!</h2>
