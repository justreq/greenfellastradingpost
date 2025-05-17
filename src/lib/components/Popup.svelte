<script lang="ts">
	import { globalPopupState } from "$lib/globals";
	import { sineInOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";
	import AuthForm from "./AuthForm.svelte";
	import { currentUser, supabase } from "$lib/supabaseClient";
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import HeaderNav from "./HeaderNav.svelte";
	import ProfileNav from "./ProfileNav.svelte";
	import SortingOptions from "./SortingOptions.svelte";
	import Filters from "./Filters.svelte";

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
	<div bind:this={popupElement} class="fixed sm:flex left-0 top-0 w-screen h-screen z-30 overflow-scroll bg-black/80" class:hidden={!visible} transition:fade={{ delay: visible ? 150 : 0, duration: 100 }}>
		<div
			class="h-[60vh] sm:absolute sm:w-full sm:h-full"
			onclick={() => {
				$globalPopupState = "none";
			}}
		></div>
		<article class="bg-glass-sm sm:m-auto w-full max-w-[640px] min-h-[50vh] sm:min-h-0 rounded-t-lg sm:rounded-b-lg bottom-0 pb-24 sm:p-4 {className}" transition:fly={{ duration: 200, y: 500, easing: sineInOut }}>
			{#if $globalPopupState == "headernav"}
				<nav class="pt-8 sm:py-2 px-2 flex flex-col gap-4 [&>*]:bg-text/10">
					<HeaderNav />
				</nav>
			{:else if $globalPopupState == "profile"}
				<article class="[&>*]:sm:py-4">
					<ProfileNav />
				</article>
			{:else if $globalPopupState == "signup" || $globalPopupState == "login"}
				<article class="flex flex-col gap-2 p-2"><AuthForm authType={$globalPopupState} /></article>
			{:else if $globalPopupState == "sorts"}
				<SortingOptions />
			{:else if $globalPopupState == "filters"}
				<Filters />
			{:else if $globalPopupState == "checkout"}
				<div>checkout</div>
			{/if}
		</article>
	</div>
{/if}
