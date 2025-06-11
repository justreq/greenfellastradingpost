<script lang="ts">
	import { page } from "$app/state";
	import { globalPopupState, cartContents } from "$lib/globals";
	import HeaderNav from "./HeaderNav.svelte";
	import ProfileNav from "./ProfileNav.svelte";
	let { user } = $derived(page.data);
</script>

<header class="sticky top-0 h-16 lg:h-24 border-0 border-b-2 w-screen px-8 xl:px-16 bg-glass flex justify-between z-20 [&_a]:my-auto [&>div]:lg:block [&>div]:bg-primary [&>div]:lg:bg-transparent [&>div]:absolute [&>div]:lg:static [&>div]:top-16 [&>div]:lg:top-24 [&>div]:w-full [&>div]:lg:w-auto [&>div]:left-0 [&>div>nav]:p-2 [&>div>nav]:flex [&>div>nav]:flex-col [&>div>nav]:lg:flex-row [&>div>nav]:lg:gap-8 [&>div>nav]:xl:gap-16 [&>div>nav]:lg:h-full [&>div>nav]:lg:justify-center [&>div>nav]:gap-2 [&>div>nav]:w-full [&>button]:h-1/2 [&>button]:lg:h-1/3 [&>button]:aspect-square [&>button>img]:h-full [&>button]:my-auto">
	<button
		type="button"
		onclick={() => {
			$globalPopupState = "headernav";
		}}
		class="lg:hidden"
	>
		<img src="/icons/navigation.svg" alt="Navigation Menu Button" draggable="false" />
	</button>
	<a
		href="/"
		onclick={() => {
			$globalPopupState = "none";
		}}
		class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] h-4/5 aspect-square duration-200 md:hover:scale-110 hidden lg:block"
	>
		<img src="/images/favicon.png" alt="Logo Mobile" draggable="false" class="h-full" />
	</a>
	<nav class="hidden lg:flex gap-8"><HeaderNav /></nav>
	<article class="flex gap-4">
		<article class="hidden lg:flex">
			{#if user && !user.is_anonymous}
				<button type="button" onclick={() => ($globalPopupState = "profile")} class="fancy-button text-center my-auto">{user.user_metadata.displayName || user.user_metadata.full_name}</button>
			{:else}
				<ProfileNav />
			{/if}
		</article>
		<button id="cart-button" type="button" onclick={() => ($globalPopupState = "checkout")} class="h-1/2 aspect-square my-auto lg:bg-secondary lg:p-3 rounded-lg transition-all duration-200 md:hover:bg-tertiary/80 md:hover:scale-105">
			<img src="/icons/cart{$cartContents.length == 0 ? '-empty' : ''}.svg" alt="Cart Button" draggable="false" class="h-full" />
		</button>
	</article>
	<button
		type="button"
		onclick={() => {
			$globalPopupState = "profile";
		}}
		class="lg:hidden"
	>
		<img src="/icons/user-circle.svg" alt="Profile Menu Button" draggable="false" />
	</button>
</header>
