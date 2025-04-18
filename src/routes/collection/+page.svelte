<script lang="ts">
	import FancyButton from "$lib/components/FancyButton.svelte";
	import { onMount } from "svelte";
	let { data } = $props();

	let filtersList: { [key: string]: { name: string; value: string }[] } = {
		prices: [
			{ name: "Free - $10", value: "lowest" },
			{ name: "$11 - $25", value: "affordable" },
			{ name: "$26 - $75", value: "midrange" },
			{ name: "$75 - $150", value: "premium" },
			{ name: "$151+", value: "luxury" },
		],
		years: data.cards.map((e) => ({ name: e.year, value: e.year.toLowerCase() })),
		sets: data.cards.map((e) => ({ name: `${e.brand} ${e.set}`, value: `${e.brand.toLowerCase().split(" ").join("-")}-${e.set.toLowerCase().split(" ").join("-")}` })),
		players: data.cards.map((e) => ({ name: e.player, value: e.player.toLowerCase().split(" ").join("-") })),
		other: [
			{ name: "Is Numbered", value: "numbered" },
			{ name: "Has Auto", value: "auto" },
			{ name: "Has Patch", value: "patch" },
		],
	};

	let searchParams = new URLSearchParams(window.location.search);
	let areSortingOptionsVisible = $state(false);
	let areFiltersVisible = $state(false);

	const setCollectionModals = (sortingOptions: boolean, filters: boolean) => {
		areSortingOptionsVisible = sortingOptions;
		areFiltersVisible = filters;

		if (sortingOptions || filters) {
			document.body.querySelector("footer")?.firstElementChild?.classList.add("!invisible");
		} else {
			document.body.querySelector("footer")?.firstElementChild?.classList.remove("!invisible");
			submitCollectionForm();
		}
	};

	let sortingMethods = ["popularity", "name", "price", "newest"];
	let sortReversed = $state(searchParams.get("sortby") != null ? ((searchParams.get("sortby") as string).split("-").length < 2 ? false : (searchParams.get("sortby") as string).split("-")[1] == "reversed" ? true : false) : false);
	let sortingMethod = $state(searchParams.get("sortby") != null ? (sortingMethods.includes((searchParams.get("sortby") as string).split("-")[0]) ? sortingMethods.indexOf((searchParams.get("sortby") as string).split("-")[0]) : 0) : 0);

	const setSortIcon = () => ((document.getElementById("sorting-options-button-icon") as HTMLImageElement).src = `/icons/sort${["", "-alpha", "-number", "-number"][sortingMethod]}${["", "-reversed"][Number(sortReversed)]}.svg`);
	const setSort = (reversed: boolean, method: number) => {
		sortReversed = reversed;
		sortingMethod = method;

		(document.getElementById("sortby") as HTMLInputElement).value = sortingMethods[sortingMethod] + (sortReversed ? "-reversed" : "");
		setSortIcon();
	};

	let priceFilters = $state(searchParams.get("prices") != null ? (searchParams.get("prices") as string).split("_").filter((e) => filtersList.prices.map((f) => f.value).includes(e)) : []);
	let yearFilters = $state(searchParams.get("years") != null ? (searchParams.get("years") as string).split("_").filter((e) => filtersList.years.map((f) => f.value).includes(e)) : []);
	let setFilters = $state(searchParams.get("sets") != null ? (searchParams.get("sets") as string).split("_").filter((e) => filtersList.sets.map((f) => f.value).includes(e)) : []);
	let playerFilters = $state(searchParams.get("players") != null ? (searchParams.get("players") as string).split("_").filter((e) => filtersList.players.map((f) => f.value).includes(e)) : []);
	let otherFilters = $state(searchParams.get("other") != null ? (searchParams.get("other") as string).split("_").filter((e) => filtersList.other.map((f) => f.value).includes(e)) : []);

	const getFilters = (type: string) => {
		switch (type) {
			case "prices":
				return priceFilters;
			case "years":
				return yearFilters;
			case "sets":
				return setFilters;
			case "players":
				return playerFilters;
			case "other":
				return otherFilters;
			default:
				return [];
		}
	};

	const toggleFilter = (type: string, filter: string) => {
		if (getFilters(type).includes(filter)) getFilters(type).splice(getFilters(type).indexOf(filter), 1);
		else getFilters(type).push(filter);

		(document.getElementById(type) as HTMLInputElement).value = getFilters(type).join("_");
		(document.getElementById(type) as HTMLInputElement).disabled = getFilters(type).length == 0;
	};

	let currentPage = $state(searchParams.get("page") != null ? (isNaN(parseInt(searchParams.get("page") as string)) ? 1 : Math.max(1, parseInt(searchParams.get("page") as string))) : 1);

	const setPage = (page: number) => {
		currentPage = page;

		(document.getElementById("page") as HTMLInputElement).value = currentPage.toString();
		(document.getElementById("page") as HTMLInputElement).disabled = currentPage == 1;
	};

	const submitCollectionForm = (reversed = sortReversed, method = sortingMethod, page = currentPage) => {
		setSort(reversed, method);

		Object.keys(filtersList).forEach((e) => {
			(document.getElementById(e) as HTMLInputElement).disabled = getFilters(e).length == 0;
		});

		setPage(page);
		(document.getElementById("collection-form") as HTMLFormElement).submit();
	};

	onMount(() => {
		setSortIcon();
	});
</script>

<header>
	<form id="collection-form" class="flex gap-4 px-4 [&>*:not(article)]:bg-glass-sm [&>*:not(article)]:rounded-lg [&>button]:h-12 [&>button]:aspect-square [&>button]:flex [&>button>img]:m-auto [&>button>img]:h-3/5">
		<button type="button" onclick={() => setCollectionModals(true, false)}>
			<img id="sorting-options-button-icon" alt="Sorting Options Button" />
		</button>
		<button type="button" onclick={() => setCollectionModals(false, true)}>
			<img src="/icons/filter.svg" alt="Filters Button" />
		</button>
		<article class="absolute left-0 top-0 w-screen max-h-screen overflow-y-scroll z-20 [&>article]:bg-primary [&>article]:p-2 [&>article]:w-full [&>article]:min-h-[20vh] [&>article]:gap-2 [&>article>button]:uppercase [&>article>button]:h-min [&>article>button]:p-2 [&>article>button]:bg-secondary [&>article>button]:rounded-lg [&>article>hr]:col-span-2 [&>article>hr]:border-none [&>article>hr]:h-0.5 [&>article>hr]:bg-secondary [&>article>hr]:rounded-full" class:hidden={!areSortingOptionsVisible && !areFiltersVisible}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="w-full h-[80vh] bg-black/40 lg:hidden" onclick={() => setCollectionModals(false, false)}></div>
			<article class:!hidden={!areSortingOptionsVisible} class="grid grid-cols-2 auto-rows-min">
				<input type="text" name="sortby" id="sortby" value={sortingMethods[sortingMethod] + (sortReversed ? "-reversed" : "")} class="hidden" />
				<button type="submit" onclick={() => submitCollectionForm()} class="!bg-tertiary col-span-2">Apply Sorting</button>
				<hr />
				<FancyButton iconPath="/icons/sort.svg" text="Default" onclick={() => (sortReversed = false)} isTogglable toggleValue={!sortReversed} />
				<FancyButton iconPath="/icons/sort-reversed.svg" text="Reversed" onclick={() => (sortReversed = true)} isTogglable toggleValue={sortReversed} />
				<hr />
				<FancyButton text="Popularity" onclick={() => (sortingMethod = 0)} isTogglable toggleValue={sortingMethod == 0} />
				<FancyButton text="Name" onclick={() => (sortingMethod = 1)} isTogglable toggleValue={sortingMethod == 1} />
				<FancyButton text="Price" onclick={() => (sortingMethod = 2)} isTogglable toggleValue={sortingMethod == 2} />
				<FancyButton text="Newest" onclick={() => (sortingMethod = 3)} isTogglable toggleValue={sortingMethod == 3} />
			</article>
			<article class:!hidden={!areFiltersVisible} class="flex flex-col [&>*]:w-full [&>p]:text-lg [&>p]:pl-4">
				<button type="submit" onclick={() => submitCollectionForm()} class="!bg-tertiary col-span-2">Apply Filters</button>
				{#each Object.keys(filtersList) as filterType}
					<input type="text" name={filterType} id={filterType} value={getFilters(filterType).join("_")} class="hidden" />
					<p>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</p>
					{#each filtersList[filterType] as filter}
						<FancyButton text={filter.name} id={`filter-${filterType}-${filter.value}`} onclick={() => toggleFilter(filterType, filter.value)} isTogglable toggleValue={getFilters(filterType).includes(filter.value)} />
					{/each}
					<hr />
				{/each}
			</article>
		</article>
		<button
			type="button"
			onclick={() => {
				submitCollectionForm(sortReversed, sortingMethod, Math.max(1, currentPage - 1));
			}}
			disabled={currentPage == 1}
		>
			<img src="/icons/left.svg" alt="Previous Page Button" />
		</button>
		<div class="flex-grow flex">
			<input type="number" name="page" id="page" value={currentPage.toString()} class="hidden" />
			<p class="h-min m-auto">Page {currentPage}</p>
		</div>
		<button
			type="button"
			onclick={() => {
				submitCollectionForm(sortReversed, sortingMethod, Math.max(1, currentPage + 1));
			}}
		>
			<img src="/icons/right.svg" alt="Next Page Button" />
		</button>
	</form>
</header>
