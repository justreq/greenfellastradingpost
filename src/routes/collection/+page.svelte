<script lang="ts">
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import { onMount } from "svelte";
	let { data } = $props();

	const itemsPerPage = 15;

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
			scrollTo({ top: 0 });
			document.body.classList.add("!overflow-y-hidden");
		} else {
			document.body.querySelector("footer")?.firstElementChild?.classList.remove("!invisible");
			document.body.classList.remove("!overflow-y-hidden");
			submitCollectionForm();
		}
	};

	let sortingMethods = ["popularity", "name", "price", "newest"];
	// svelte-ignore non_reactive_update
	let sortReversed = $state(searchParams.get("sortby") != null ? ((searchParams.get("sortby") as string).split("-").length < 2 ? false : (searchParams.get("sortby") as string).split("-")[1] == "reversed" ? true : false) : false);
	// svelte-ignore non_reactive_update
	let sortingMethod = $state(searchParams.get("sortby") != null ? (sortingMethods.includes((searchParams.get("sortby") as string).split("-")[0]) ? sortingMethods.indexOf((searchParams.get("sortby") as string).split("-")[0]) : 0) : 0);

	const setSortIcon = () => ((document.getElementById("button-sorting-options-icon") as HTMLImageElement).src = `/icons/sort${["", "-alpha", "-number", "-number"][sortingMethod]}${["", "-reversed"][Number(sortReversed)]}.svg`);

	const setSort = (reversed: boolean, method: number) => {
		sortReversed = reversed;
		sortingMethod = method;

		(document.getElementById("sortby") as HTMLInputElement).value = sortingMethods[sortingMethod] + (sortReversed ? "-reversed" : "");
		setSortIcon();
	};

	const sortProductList = (a: any, b: any) => {
		switch (sortingMethod) {
			case 0:
				return a.reputation - b.reputation;
			case 1:
				return data.cards.find((e) => e.id == a.item_id).player.localeCompare(data.cards.find((e) => e.id == b.item_id).player);
			case 2:
				return a.price - b.price;
			case 3:
				return a.created - b.created;
			default:
				return 0;
		}
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

	const clearFilters = () => {
		Object.keys(filtersList).forEach((type) => {
			(document.getElementById(type) as HTMLInputElement).value = "";
			(document.getElementById(type) as HTMLInputElement).disabled = true;
		});

		priceFilters = [];
		yearFilters = [];
		setFilters = [];
		playerFilters = [];
		otherFilters = [];
	};

	const filterProductList = (e: any) => {
		const itemData = data.cards.find((card) => card.id == e.item_id);
		let isValid = false;

		if (priceFilters.length == 0 && yearFilters.length == 0 && setFilters.length == 0 && otherFilters.length == 0) return true;

		if (priceFilters.includes("lowest") && e.price <= 10.0) isValid = true;
		if (priceFilters.includes("affordable") && e.price > 10.0 && e.price <= 25.0) isValid = true;
		if (priceFilters.includes("midrange") && e.price > 25.0 && e.price <= 75.0) isValid = true;
		if (priceFilters.includes("premium") && e.price > 75.0 && e.price <= 150.0) isValid = true;
		if (priceFilters.includes("luxury") && e.price > 150.0) isValid = true;

		if (yearFilters.length > 0 && yearFilters.includes(itemData.year.toLowerCase())) isValid = true;
		if (setFilters.length > 0 && setFilters.includes(`${itemData.brand.toLowerCase().split(" ").join("-")}-${itemData.set.toLowerCase().split(" ").join("-")}`)) isValid = true;
		if (playerFilters.length > 0 && playerFilters.includes(itemData.player.toLowerCase().split(" ").join("-"))) isValid = true;

		if (otherFilters.includes("numbered") && itemData.number != "") isValid = true;
		if (otherFilters.includes("auto") && itemData.auto) isValid = true;
		if (otherFilters.includes("patch") && itemData.patch) isValid = true;

		return isValid;
	};

	// svelte-ignore non_reactive_update
	let currentPage = searchParams.get("page") != null ? (isNaN(parseInt(searchParams.get("page") as string)) ? 1 : Math.max(1, parseInt(searchParams.get("page") as string))) : 1;

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

	const productList = data.products.filter(filterProductList).sort(sortProductList);
	// svelte-ignore state_referenced_locally
	if (sortReversed) productList.reverse();
</script>

<header>
	<form id="collection-form" class="lg:relative grid grid-cols-[3rem_1fr_1fr_1fr_1fr_3rem] lg:flex gap-4 px-4 lg:px-0 [&>div]:bg-glass [&>button]:bg-glass [&>button]:uppercase [&>div]:rounded-lg [&>button]:rounded-lg">
		<FancyButton iconPath="/icons/sort.svg" id="sorting-options" text="Sort By" onclick={() => setCollectionModals(true, false)} className="col-span-3 lg:hidden" />
		<FancyButton iconPath="/icons/filter.svg" text="Filters" onclick={() => setCollectionModals(false, true)} className="col-span-3 lg:hidden" />
		<article class="absolute lg:static lg:block left-0 top-0 w-screen lg:w-fit max-h-screen lg:max-h-max overflow-y-scroll lg:overflow-y-auto z-20 [&>article]:absolute [&>article]:lg:top-14 [&>article]:lg:block [&>article]:bg-primary [&>article]:p-2 [&>article]:pb-24 [&>article]:w-full [&>article]:lg:w-max [&>article]:min-h-[40vh] [&>article]:gap-2 [&>article>button]:uppercase [&>article>button]:h-min [&>article>button]:p-2 [&>article>button]:bg-secondary [&>article>button]:rounded-lg [&>article>hr]:col-span-2 [&>article>hr]:border-none [&>article>hr]:h-0.5 [&>article>hr]:bg-secondary [&>article>hr]:rounded-full" class:hidden={!areSortingOptionsVisible && !areFiltersVisible}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="w-full h-[60vh] bg-black/40 lg:hidden" onclick={() => setCollectionModals(false, false)}></div>
			<article class:hidden={!areSortingOptionsVisible} class="grid grid-cols-2 auto-rows-min">
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
			<article class:hidden={!areFiltersVisible} class="flex flex-col [&>*]:w-full [&>p]:text-lg [&>p]:pl-4">
				<button type="submit" onclick={() => submitCollectionForm()} class="!bg-tertiary col-span-2">Apply Filters</button>
				<button type="button" onclick={() => clearFilters()} class="!bg-tertiary col-span-2">Clear Filters</button>
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
		<FancyButton
			iconPath="/icons/left.svg"
			onclick={() => {
				submitCollectionForm(sortReversed, sortingMethod, Math.max(1, currentPage - 1));
			}}
			disabled={currentPage <= 1}
			className="w-min justify-self-center"
		/>
		<div class="col-span-4 flex">
			<input type="number" name="page" id="page" value={currentPage.toString()} class="hidden" />
			<p class="h-min m-auto">Items {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, productList.length)} ({productList.length})</p>
		</div>
		<FancyButton
			iconPath="/icons/right.svg"
			onclick={() => {
				submitCollectionForm(sortReversed, sortingMethod, Math.max(1, currentPage + 1));
			}}
			disabled={currentPage >= Math.ceil(data.products.length / itemsPerPage)}
			className="w-min justify-self-center"
		/>
	</form>
</header>
<article class="flex flex-wrap px-2 justify-evenly mx-auto mt-4 gap-2">
	{#each productList.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage) as product}
		<CardProductThumbnail id={product.id} />
	{/each}
</article>
