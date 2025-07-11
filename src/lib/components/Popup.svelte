<script lang="ts">
	import { breakIDToShowSpots, globalPopupState } from "$lib/globals";
	import { sineInOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";
	import AuthForm from "./AuthForm.svelte";
	import HeaderNav from "./HeaderNav.svelte";
	import ProfileNav from "./ProfileNav.svelte";
	import SortingOptions from "./SortingOptions.svelte";
	import Filters from "./Filters.svelte";
	import FancyTextInput from "./FancyTextInput.svelte";
	import { page } from "$app/state";
	import BreakSpots from "./BreakSpots.svelte";
	import PsaForm from "./PSAForm.svelte";
	import Checkout from "./Checkout.svelte";
	let { supabase } = $derived(page.data);

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
			$globalPopupState = "none";
			$breakIDToShowSpots = null;
			document.body.querySelector("footer")?.firstElementChild?.classList.remove("!invisible");
			document.body.classList.remove("!overflow-y-hidden");
		}
	});
</script>

{#if $globalPopupState != "none"}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		id="popup-backdrop"
		onclick={(event) => {
			if ((event.target as HTMLElement).id == "popup-backdrop") $globalPopupState = "none";
		}}
		bind:this={popupElement}
		class="sm:py-16 fixed sm:flex left-0 top-0 w-screen h-screen z-30 overflow-scroll bg-black/40"
		class:hidden={!visible}
		transition:fade={{ delay: visible ? 150 : 0, duration: 100 }}
	>
		<article class="mt-[60vh] sm:mt-auto bg-glass-sm sm:m-auto w-full max-w-[640px] min-h-[50vh] sm:min-h-0 rounded-t-lg sm:rounded-b-lg bottom-0 pb-24 sm:p-4 {className}" transition:fly={{ duration: 200, y: 500, easing: sineInOut }}>
			{#if $globalPopupState == "headernav"}
				<nav class="pt-8 sm:py-2 px-2 flex flex-col gap-4 [&>*]:bg-text/10">
					<HeaderNav />
				</nav>
			{:else if $globalPopupState == "profile"}
				<article class="[&>*]:sm:py-4">
					<ProfileNav />
				</article>
			{:else if $globalPopupState == "signup" || $globalPopupState == "login"}
				<article class="flex flex-col gap-2 p-2"><AuthForm authType={$globalPopupState.toString()} /></article>
			{:else if $globalPopupState == "sorts"}
				<SortingOptions />
			{:else if $globalPopupState == "filters"}
				<Filters />
			{:else if $globalPopupState == "createbreakspot"}
				<form
					method="POST"
					onsubmit={async (event) => {
						const data = Object.fromEntries(new FormData(event.target as HTMLFormElement));

						const { error } = await supabase.from("break_spots").insert({ name: data.spot_name, price: data.spot_price, break_id: page.data.break.id });
						if (error) throw error;

						location.reload();
					}}
					class="flex flex-col gap-4 p-4"
				>
					<FancyTextInput name="spot_name" placeholder="Spot Name" required />
					<FancyTextInput name="spot_price" type="number" placeholder="Spot Price" step="any" required />
					<button type="submit" class="fancy-button fancy-anchor-on w-full mt-4">Create New Spot</button>
				</form>
			{:else if $globalPopupState == "breakspots"}
				<BreakSpots />
			{:else if $globalPopupState == "checkout"}
				<Checkout />
			{:else if $globalPopupState == "psaform"}
				<PsaForm />
			{/if}
		</article>
	</div>
{/if}
