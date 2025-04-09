<script lang="ts">
	import { page } from "$app/state";
	import { supabase } from "$lib/supabaseClient";

	let isNavMenuVisible = false;
	let isProfileMenuVisible = false;

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

<header class="sticky top-0 h-24 border-b-2 w-screen px-8 xl:px-16 bg-glass flex justify-between border-secondary/80 z-10 [&_a]:my-auto [&>div]:lg:block [&>div]:bg-primary [&>div]:lg:bg-transparent [&>div]:absolute [&>div]:lg:static [&>div]:top-[calc(6rem+1px)] [&>div]:w-full [&>div]:lg:w-auto [&>div]:left-0 [&>div>nav]:p-2 [&>div>nav]:flex [&>div>nav]:flex-col [&>div>nav]:lg:flex-row [&>div>nav]:lg:gap-8 [&>div>nav]:xl:gap-16 [&>div>nav]:lg:h-full [&>div>nav]:lg:justify-center [&>div>nav]:gap-2 [&>div>nav]:w-full [&>button>img]:h-1/2 [&>button>img]:my-auto">
	<button
		type="button"
		onclick={() => {
			isProfileMenuVisible = false;
			isNavMenuVisible = !isNavMenuVisible;
		}}
		class="lg:hide"
	>
		<img src="/icons/menu.svg" alt="Navigation Menu Button" draggable="false" />
	</button>
	<a href="/" class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] h-4/5 aspect-square lg:duration-200 lg:hover:scale-110"><img src="/images/favicon.png" alt="Logo Mobile" draggable="false" class="h-full" /></a>
	<button
		type="button"
		onclick={() => {
			isNavMenuVisible = false;
			isProfileMenuVisible = !isProfileMenuVisible;
		}}
		class="lg:hidden"
	>
		<img src="/icons/user-circle.svg" alt="Profile Menu Button" draggable="false" />
	</button>
	<div class:hidden={!isNavMenuVisible}>
		<nav>
			<a
				href="/"
				class:fancy-anchor-on={page.route.id == "/"}
				onclick={() => {
					isNavMenuVisible = false;
				}}
			>
				Home
			</a>
			<a
				href="/collection"
				class:fancy-anchor-on={page.route.id?.includes("collection")}
				onclick={() => {
					isNavMenuVisible = false;
				}}
			>
				Collection
			</a>
			<a
				href="/store"
				class:fancy-anchor-on={page.route.id?.includes("store")}
				onclick={() => {
					isNavMenuVisible = false;
				}}
			>
				GTP Store
			</a>
			<a
				href="/contact"
				class:fancy-anchor-on={page.route.id?.includes("contact")}
				onclick={() => {
					isNavMenuVisible = false;
				}}
			>
				Contact Us
			</a>
		</nav>
	</div>
	{#await getUser then { data }}
		<div class:hidden={!isProfileMenuVisible}>
			<nav>
				{#if data.user}
					<a href="/" class="fancy-button">{data.user.user_metadata.displayName}</a>
				{:else}
					<a
						href="/signup"
						class="fancy-button"
						class:fancy-anchor-on={page.route.id?.includes("signup")}
						onclick={() => {
							isProfileMenuVisible = false;
						}}
					>
						Sign Up
					</a>
					<a
						href="/login"
						class="fancy-button"
						class:fancy-anchor-on={page.route.id?.includes("login")}
						onclick={() => {
							isProfileMenuVisible = false;
						}}
					>
						Log In
					</a>
				{/if}
			</nav>
		</div>
	{/await}
</header>
