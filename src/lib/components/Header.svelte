<script lang="ts">
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";
	import type { User } from "@supabase/supabase-js";
	import { onMount } from "svelte";

	let fetchingUser = true;
	let user: User | null = null;
	let showUserPopup = false;

	$: supabase.auth.onAuthStateChange((event, session) => {
		if (event == "SIGNED_IN") getUser();
	});

	const getUser = async () => {
		const { data, error } = await supabase.auth.getUser();
		user = data.user;

		fetchingUser = false;
	};

	onMount(() => getUser());
</script>

<header class="sticky top-0 h-24 pr-0 border-b-2">
	<div class="flex gap-16 [&>*]:my-auto">
		<a href="/" class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] h-4/5 duration-200 hover:scale-110"><img src="/favicon.png" alt="Logo" draggable="false" class="h-full" /></a>
		<a href="/" class:fancy-anchor-on={page.route.id == "/"}>Home</a>
		<a href="/collections" class:fancy-anchor-on={page.route.id?.includes("collections")}>Collections</a>
		<a href="/contactus" class:fancy-anchor-on={page.route.id?.includes("contactus")}>Contact Us</a>
	</div>
	{#if !fetchingUser}
		{#if user == null}
			<div class="flex gap-4 [&>*]:border-text">
				<a href="/auth/signup" class:fancy-anchor-on={page.route.id?.includes("auth/signup")}>Sign Up</a>
				<a href="/auth/login" class:fancy-anchor-on={page.route.id?.includes("auth/login")}>Log In</a>
			</div>
		{:else}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="flex flex-col h-min" on:mouseleave={() => (showUserPopup = false)}>
				<div class="h-24 flex justify-end pr-8">
					<button type="button" class="my-auto" on:click={() => (showUserPopup = !showUserPopup)}>{user.user_metadata.displayName}</button>
				</div>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div class:translate-x-full={!showUserPopup} class="duration-200 transition-transform p-2" on:click={() => (showUserPopup = false)}>
					<div class="flex flex-col bg-primary/80 backdrop-blur-sm rounded-lg min-w-48 h-48"></div>
				</div>
			</div>
		{/if}
	{/if}
</header>
