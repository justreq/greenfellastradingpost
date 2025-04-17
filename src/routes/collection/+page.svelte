<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyCheckbox from "$lib/components/FancyCheckbox.svelte";
	import { onMount } from "svelte";

	let searchParams = new URLSearchParams(window.location.search);
	let areSortingOptionsVisible = false;
	let areFiltersVisible = false;

	const setCollectionModals = (sortingOptions: boolean, filters: boolean) => {
		areSortingOptionsVisible = sortingOptions;
		areFiltersVisible = filters;

		if (sortingOptions || filters) {
			document.body.querySelector("footer")?.firstElementChild?.classList.add("!invisible");
			document.body.querySelector("footer")?.classList.add("!bg-primary");
		} else {
			document.body.querySelector("footer")?.firstElementChild?.classList.remove("!invisible");
			document.body.querySelector("footer")?.classList.remove("!bg-primary");
		}
	};

	let sortingDirection = searchParams.get("sortby") != null ? parseInt(searchParams.get("sortby") as string) : 0;
	let sortingMethod = 0;

	const setSort = (direction: number, method: number) => {
		if (sortingDirection == direction && sortingMethod == method) return;

		sortingDirection = direction;
		sortingMethod = method;

		(document.getElementById("sortby") as HTMLInputElement).value = ["popularity", "name", "price", "newest"][sortingMethod] + (sortingDirection ? "-reversed" : "");
	};

	let currentPage = searchParams.get("page") != null ? Math.max(1, parseInt(searchParams.get("page") as string)) : 1;

	const setPage = (newPage: number) => {
		if (currentPage == newPage) return;

		currentPage = newPage;

		(document.getElementById("page") as HTMLInputElement).value = currentPage.toString();
		(document.getElementById("page") as HTMLInputElement).disabled = currentPage == 1;
		(document.getElementById("collection-form") as HTMLFormElement).submit();
	};
</script>

<header>
	<form id="collection-form" class="flex gap-4 px-4 [&>*:not(article)]:bg-glass-sm [&>*:not(article)]:rounded-lg [&>button]:h-12 [&>button]:aspect-square [&>button]:flex [&>button>img]:m-auto [&>button>img]:h-3/5">
		<button type="button" onclick={() => setCollectionModals(true, false)}>
			<img src="/icons/sort.svg" alt="Sorting Options Button" />
		</button>
		<button type="button" onclick={() => setCollectionModals(false, true)}>
			<img src="/icons/filter.svg" alt="Filters Button" />
		</button>
		<article class="absolute left-0 top-0 w-screen max-h-screen overflow-y-scroll z-20 [&>article]:bg-primary [&>article]:p-2 [&>article]:w-full [&>article]:min-h-[20vh] [&>article]:gap-2 [&>article>button]:uppercase [&>article>button]:h-min [&>article>button]:p-2 [&>article>button]:bg-secondary [&>article>button]:rounded-lg" class:hidden={!areSortingOptionsVisible && !areFiltersVisible}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="w-full h-[80vh] bg-black/40 lg:hidden" onclick={() => setCollectionModals(false, false)}></div>
			<article class:!hidden={!areSortingOptionsVisible} class="grid grid-cols-2 auto-rows-min [&>hr]:col-span-2 [&>hr]:border-none [&>hr]:h-0.5 [&>hr]:bg-secondary [&>hr]:rounded-full">
				<input type="text" name="sortby" id="sortby" class="hidden" />
				<button type="submit" onclick={() => (document.getElementById("collection-form") as HTMLFormElement).submit()} class="!bg-tertiary col-span-2">Apply Sorting</button>
				<hr />
				<FancyButton iconPath="/icons/sort.svg" text="Default" onclick={() => setSort(0, sortingMethod)} isTogglable toggleValue={sortingDirection == 0} />
				<FancyButton iconPath="/icons/sort-reversed.svg" text="Reversed" onclick={() => setSort(1, sortingMethod)} isTogglable toggleValue={sortingDirection == 1} />
				<hr />
				<FancyButton text="Popularity" onclick={() => setSort(sortingDirection, 0)} isTogglable toggleValue={sortingMethod == 0} />
				<FancyButton text="Name" onclick={() => setSort(sortingDirection, 1)} isTogglable toggleValue={sortingMethod == 1} />
				<FancyButton text="Price" onclick={() => setSort(sortingDirection, 2)} isTogglable toggleValue={sortingMethod == 2} />
				<FancyButton text="Newest" onclick={() => setSort(sortingDirection, 3)} isTogglable toggleValue={sortingMethod == 3} />
			</article>
			<article class:!hidden={!areFiltersVisible}>filters</article>
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
			<input type="number" name="page" id="page" class="hidden" />
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
