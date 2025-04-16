<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyCheckbox from "$lib/components/FancyCheckbox.svelte";
	import { onMount } from "svelte";

	let areSortingOptionsVisible = true;
	let areFiltersVisible = false;

	let searchParams = new URLSearchParams(window.location.search);
	let currentPage = searchParams.get("page") != null ? parseInt(searchParams.get("page") as string) : 1;

	const setPage = (newPage: number) => {
		if (currentPage == newPage) return;

		(document.getElementById("page") as HTMLInputElement).value = newPage.toString();
		(document.getElementById("collection-form") as HTMLFormElement).submit();
	};
</script>

<header>
	<form id="collection-form" class="flex gap-4 px-4 [&>*:not(article)]:bg-glass-sm [&>*:not(article)]:rounded-lg [&>button]:h-12 [&>button]:aspect-square [&>button]:flex [&>button>img]:m-auto [&>button>img]:h-3/5">
		<button
			type="button"
			onclick={() => {
				areSortingOptionsVisible = true;
				areFiltersVisible = false;
			}}
		>
			<img src="/icons/ascending.svg" alt="Sorting Options Button" />
		</button>
		<button
			type="button"
			onclick={() => {
				areSortingOptionsVisible = false;
				areFiltersVisible = true;
			}}
		>
			<img src="/icons/filter.svg" alt="Filters Button" />
		</button>
		<article class="absolute left-0 top-0 w-screen max-h-screen overflow-y-scroll z-20 [&>article]:bg-primary [&>article]:w-full [&>article]:min-h-[20vh] [&>article]:h-96" class:hidden={!areSortingOptionsVisible && !areFiltersVisible}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="w-full h-[80vh] bg-red-500/40 lg:hidden"
				onclick={() => {
					areSortingOptionsVisible = false;
					areFiltersVisible = false;
				}}
			></div>
			<article class:hidden={!areSortingOptionsVisible}></article>
			<article class:hidden={!areFiltersVisible}>filters</article>
		</article>
		<button
			type="button"
			onclick={() => {
				setPage(Math.max(1, currentPage - 1));
			}}
		>
			<img src="/icons/left.svg" alt="Previous Page Button" />
		</button>
		<div class="flex-grow flex">
			<input type="number" name="page" id="page" bind:value={currentPage} class="hidden" />
			<p class="h-min m-auto">Page {currentPage}</p>
		</div>
		<button
			type="button"
			onclick={() => {
				setPage(Math.max(1, currentPage + 1));
			}}
		>
			<img src="/icons/right.svg" alt="Next Page Button" />
		</button>
	</form>
</header>
