<script lang="ts">
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";

	let getUser = supabase.auth.getUser();

	supabase.auth.onAuthStateChange((event) => {
		getUser = supabase.auth.getUser();

		if (event === "INITIAL_SESSION") {
			// handle initial session
		} else if (event === "SIGNED_IN") {
			// handle sign in event
		} else if (event === "SIGNED_OUT") {
			// handle sign out event
		} else if (event === "PASSWORD_RECOVERY") {
			// handle password recovery event
		} else if (event === "TOKEN_REFRESHED") {
			// handle token refreshed event
		} else if (event === "USER_UPDATED") {
			// handle user updated event
		}
	});
</script>

<header class="sticky top-0 h-24 border-b-2 w-screen px-16 bg-glass flex justify-between border-secondary/80 z-10 [&>*]:flex [&>*]:gap-16 [&_a]:my-auto">
	<nav>
		<a href="/" class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] h-4/5 duration-200 hover:scale-110"><img src="/images/favicon.png" alt="Logo" draggable="false" class="h-full" /></a>
		<a href="/" class:fancy-anchor-on={page.route.id == "/"}>Home</a>
		<a href="/collection" class:fancy-anchor-on={page.route.id?.includes("collection")}>Collection</a>
		<a href="/store" class:fancy-anchor-on={page.route.id?.includes("store")}>GTP Store</a>
		<a href="/contact" class:fancy-anchor-on={page.route.id?.includes("contact")}>Contact Us</a>
	</nav>
	{#await getUser then { data }}
		<div class="!gap-8">
			{#if data.user}
				<a href="/" class="fancy-button">{data.user.user_metadata.displayName}</a>
			{:else}
				<a href="/signup" class="fancy-button" class:fancy-anchor-on={page.route.id?.includes("signup")}>Sign Up</a>
				<a href="/login" class="fancy-button" class:fancy-anchor-on={page.route.id?.includes("login")}>Log In</a>
			{/if}
		</div>
	{/await}
</header>
