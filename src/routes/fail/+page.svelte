<script lang="ts">
	import { PUBLIC_BASE } from "$env/static/public";
	import { onMount } from "svelte";

	onMount(() => {
		let route = localStorage.getItem("redirect-route") ?? "";

		localStorage.removeItem("redirect-route");
		localStorage.removeItem("singleItemCart");
		location.href = PUBLIC_BASE + route;
	});
</script>
