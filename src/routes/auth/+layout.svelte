<script lang="ts">
	import { page } from "$app/state";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="w-fit h-full m-auto py-16">
	<h2 class="mb-4 text-center text-6xl font-heading">Greenfellas' Trading Post</h2>
	<h3 class="bg-primary w-fit mx-auto mb-48 px-4 py-2 rounded-xl text-2xl text-center">{page.route.id?.includes("signup") ? "Sign Up For New Account" : "Log Into Existing Account"}</h3>
	<div>
		{@render children()}
	</div>
</div>
