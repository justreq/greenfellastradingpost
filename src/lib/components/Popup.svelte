<script lang="ts">
	import { globalPopupState } from "$lib/globals";
	import { sineInOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";
	import AuthForm from "./AuthForm.svelte";
	import { currentUser, supabase } from "$lib/supabaseClient";
	import { page } from "$app/state";

	let { className = "" } = $props();
	// svelte-ignore non_reactive_update
	let popupElement: HTMLElement;
	let visible = $state($globalPopupState != "none");

	$effect(() => {
		visible = $globalPopupState != "none";

		if (visible) {
			if (popupElement != null) {
				popupElement.scrollTo({ top: 0 });
				popupElement.focus();
			}

			document.body.querySelector("footer")?.firstElementChild?.classList.add("!invisible");
			document.body.classList.add("!overflow-y-hidden");
		} else {
			globalPopupState.set("none");
			document.body.querySelector("footer")?.firstElementChild?.classList.remove("!invisible");
			document.body.classList.remove("!overflow-y-hidden");
		}
	});
</script>

{#if $globalPopupState != "none"}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div bind:this={popupElement} class="fixed left-0 top-0 w-screen h-screen z-30 overflow-scroll bg-black/80" class:hidden={!visible} transition:fade={{ delay: visible ? 150 : 0, duration: 100 }}>
		<div
			class="h-[60vh]"
			onclick={() => {
				$globalPopupState = "none";
			}}
		></div>
		<article class="bg-glass-sm w-full min-h-[50vh] rounded-t-lg bottom-0 pb-24 {className}" transition:fly={{ duration: 200, y: 500, easing: sineInOut }}>
			{#if $globalPopupState == "headernav"}
				<div class="pt-8 px-2 flex flex-col gap-4 [&>*]:bg-text/10">
					<a
						href="/"
						class:fancy-anchor-on={page.url.pathname == "/"}
						onclick={() => {
							$globalPopupState = "none";
						}}
					>
						Home
					</a>
					<a
						href="/collection"
						class:fancy-anchor-on={page.route.id?.includes("collection")}
						onclick={() => {
							$globalPopupState = "none";
						}}
					>
						Collection
					</a>
					<a
						href="/store"
						class:fancy-anchor-on={page.route.id?.includes("store")}
						onclick={() => {
							$globalPopupState = "none";
						}}
					>
						GTP Store
					</a>
					<a
						href="/contact"
						class:fancy-anchor-on={page.route.id?.includes("contact")}
						onclick={() => {
							$globalPopupState = "none";
						}}
					>
						Contact Us
					</a>
				</div>
			{:else if $globalPopupState == "profile"}
				{#if $currentUser}
					<div class="pt-8 px-2 flex flex-col gap-4">
						<a href="/" class="fancy-button text-center">{$currentUser.user_metadata.displayName || $currentUser.user_metadata.full_name}</a>
						<button
							class="fancy-button border-none bg-text/40 font-bold"
							type="button"
							onclick={async () => {
								await supabase.auth.signOut();
							}}
						>
							Sign Out
						</button>
					</div>
				{:else}
					<div class="pt-8 px-2 flex flex-col gap-4 [&>button]:py-8 [&>button]:font-bold [&>button]:rounded-lg [&>button]:transition-transform [&>button]:duration-200 [&>button:hover]:md:scale-105">
						<button
							class="bg-text text-primary"
							onclick={() => {
								$globalPopupState = "login";
							}}
						>
							Log In
						</button>
						<p class="text-center">or</p>
						<button
							class="bg-accent2/80"
							onclick={() => {
								$globalPopupState = "signup";
							}}
						>
							Sign Up
						</button>
					</div>
				{/if}
			{:else if $globalPopupState == "signup" || $globalPopupState == "login"}
				<article class="flex flex-col gap-2 p-2"><AuthForm authType={$globalPopupState} /></article>
			{:else if $globalPopupState == "sorts"}
				<div>sorts</div>
			{:else if $globalPopupState == "filters"}
				<div>filters</div>
			{:else if $globalPopupState == "checkout"}
				<div>checkout</div>
			{/if}
		</article>
	</div>
{/if}
