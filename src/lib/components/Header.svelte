<script lang="ts">
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";
	import type { User } from "@supabase/supabase-js";

	let user: User | null = null;

	let showUserPopup = false;
	let deleteAccountCooldown = 0;

	const trySignOut = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) console.log(error);
	};

	const getUser = async () => {
		let data = await supabase.auth.getUser();
		user = data.data.user;
		return supabase.auth.getUser();
	};

	let userData = getUser();

	supabase.auth.onAuthStateChange((event, session) => {
		if (user?.id != session?.user?.id) userData = getUser();
	});
</script>

<header class="sticky top-0 h-24 pr-0 border-b-2">
	<div class="flex gap-16 [&>*]:my-auto">
		<a href="/" class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] h-4/5 duration-200 hover:scale-110"><img src="/favicon.png" alt="Logo" draggable="false" class="h-full" /></a>
		<a href="/" class:fancy-anchor-on={page.route.id == "/"}>Home</a>
		<a href="/collections" class:fancy-anchor-on={page.route.id?.includes("collections")}>Collections</a>
		<a href="/contactus" class:fancy-anchor-on={page.route.id?.includes("contactus")}>Contact Us</a>
	</div>

	{#await userData then user}
		{#if user.data.user == null}
			<div class="flex gap-4 pr-16 [&>*]:border-text [&>*]:self-center">
				<a href="/auth/signup" class:fancy-anchor-on={page.route.id?.includes("auth/signup")}>Sign Up</a>
				<a href="/auth/login" class:fancy-anchor-on={page.route.id?.includes("auth/login")}>Log In</a>
			</div>
		{:else}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="flex flex-col items-end h-min" on:mouseleave={() => (showUserPopup = false)}>
				<div class="h-24 pr-8 flex">
					<button type="button" class="fancy-button self-center" class:fancy-anchor-on={showUserPopup} on:click={() => (showUserPopup = !showUserPopup)}>{user.data.user.user_metadata.displayName}</button>
				</div>
				<div class:translate-x-full={!showUserPopup} class="pt-2 pr-2 duration-200 transition-transform">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div on:click={() => (showUserPopup = false)} class="w-fit flex flex-col bg-primary/80 backdrop-blur-sm rounded-lg [&>*]:h-min [&>*]:flex [&>*]:gap-4 [&>*]:px-3 [&>*]:py-2 [&>*]:rounded-lg [&>*]:transition-colors [&>*]:duration-200 [&>*:hover]:bg-secondary [&>*>img]:w-5">
						<button type="button">
							<img src="/icons/settings.svg" alt="" />
							Account Settings
						</button>
						<button type="button" on:click={trySignOut}>
							<img src="/icons/log-out.svg" alt="" />
							Log Out
						</button>
						<button
							type="button"
							on:mousedown={() => {
								deleteAccountCooldown++;
								console.log(deleteAccountCooldown);
							}}
						>
							<img src="/icons/delete.svg" alt="" />
							Delete Account
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/await}
</header>
