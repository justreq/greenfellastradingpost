<script lang="ts">
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";
	import type { Provider } from "@supabase/supabase-js";
	import FancyButton from "./FancyButton.svelte";

	let showHeaderPopup = $state(false);

	let tryGetUser = $state(supabase.auth.getUser());

	const trySignIn = async (provider: Provider | "email") => {
		let { error } = await supabase.auth.signInWithOAuth({ provider: provider as Provider });
		if (error) throw error;
		tryGetUser = supabase.auth.getUser();
	};

	const trySignOut = async () => {
		let { error } = await supabase.auth.signOut();
		if (error) throw error;
		tryGetUser = supabase.auth.getUser();
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<header class="sticky top-0 h-24 pr-0 border-b-2 w-screen px-16 bg-glass flex justify-between border-secondary/80 z-10">
	<nav class="flex gap-16 [&>*]:my-auto">
		<a href="/" class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] h-4/5 duration-200 hover:scale-110"><img src="/favicon.png" alt="Logo" draggable="false" class="h-full" /></a>
		<a href="/" class:fancy-anchor-on={page.route.id == "/"}>Home</a>
		<a href="/collection" class:fancy-anchor-on={page.route.id?.includes("collection")}>Collection</a>
		<a href="/schedule" class:fancy-anchor-on={page.route.id?.includes("schedule")}>Schedule</a>
		<a href="/gtpchase" class:fancy-anchor-on={page.route.id?.includes("gtpchase")}>GTP Chase</a>
		<a href="/gtpstore" class:fancy-anchor-on={page.route.id?.includes("gtpstore")}>GTP Store</a>
		<a href="/contactus" class:fancy-anchor-on={page.route.id?.includes("contactus")}>Contact Us</a>
	</nav>
	<div class="flex flex-col h-min" onmouseleave={() => (showHeaderPopup = false)}>
		{#await tryGetUser then { data }}
			<div class="h-24 pr-16 flex justify-end">
				<button type="button" class="fancy-button self-center" class:fancy-anchor-on={showHeaderPopup} onclick={() => (showHeaderPopup = !showHeaderPopup)}>{data.user?.user_metadata.customUsername || "Sign In"}</button>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div class:translate-x-full={!showHeaderPopup} class="pr-2 pt-2 duration-200 transition-transform">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div class="bg-glass rounded-lg [&>*]:w-full" onclick={() => (showHeaderPopup = false)}>
					{#if data.user == null}
						<FancyButton id="sign-in-with-google" iconPath="/icons/google.svg" text="with Google" onclick={() => trySignIn("google")} canFocus={showHeaderPopup} />
						<FancyButton id="sign-in-with-discord" iconPath="/icons/discord.svg" text="with Discord" onclick={() => trySignIn("discord")} canFocus={showHeaderPopup} />
					{:else}
						<FancyButton id="account-settings" iconPath="/icons/settings.svg" text="Account Settings" canFocus={showHeaderPopup} />
						<FancyButton id="sign-out" iconPath="/icons/sign-out.svg" text="Sign Out" onclick={trySignOut} canFocus={showHeaderPopup} />
					{/if}
				</div>
			</div>
		{/await}
	</div>
</header>
