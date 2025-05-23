<script lang="ts">
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import Filters from "$lib/components/Filters.svelte";
	import SortingOptions from "$lib/components/SortingOptions.svelte";
	import { filtersList, globalPopupState } from "$lib/globals.js";
	import { onMount } from "svelte";
	let { data } = $props();

	let sortingMethods = ["popularity", "name", "price", "newest"];

	let sortReversed = $state(false);
	let sortingMethod = $state(0);

	let priceFilters: string[] = $state([]);
	let yearFilters: string[] = $state([]);
	let setFilters: string[] = $state([]);
	let playerFilters: string[] = $state([]);
	let otherFilters: string[] = $state([]);

	let optionsLoaded = $state(false);

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

	const itemsPerPage = 15;

	let searchParams: URLSearchParams = $state(new URLSearchParams());

	const setSortIcon = () => ((document.getElementById("button-sorting-options-icon") as HTMLImageElement).src = `/icons/sort${["", "-alpha", "-number", "-number"][sortingMethod]}${["", "-reversed"][Number(sortReversed)]}.svg`);

	const sortProductList = (a: any, b: any) => {
		switch (sortingMethod) {
			case 0:
				return a.reputation - b.reputation;
			case 1:
				return data.cards.find((e) => e.id == a.item_id).player.localeCompare(data.cards.find((e) => e.id == b.item_id).player);
			case 2:
				return a.price - b.price;
			case 3:
				return new Date(b.created).getTime() - new Date(a.created).getTime();
			default:
				return 0;
		}
	};

	const setFilterIcon = () => ((document.getElementById("button-filters-icon") as HTMLImageElement).src = `/icons/filter${["-remove", ""][Number(priceFilters.length == 0 && yearFilters.length == 0 && setFilters.length == 0 && playerFilters.length == 0 && otherFilters.length == 0)]}.svg`);

	const filterProductList = (e: any) => {
		const itemData = data.cards.find((card) => card.id == e.item_id);
		let isValid = false;

		if (priceFilters.length == 0 && yearFilters.length == 0 && setFilters.length == 0 && playerFilters.length == 0 && otherFilters.length == 0) return true;

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

	let currentPage = $state(1);

	const setPage = (page: number) => {
		currentPage = page;

		(document.getElementById("page") as HTMLInputElement).value = currentPage.toString();
		(document.getElementById("page") as HTMLInputElement).disabled = currentPage == 1;
	};

	const submitCollectionForm = (page = currentPage) => {
		(document.getElementById("sortby") as HTMLInputElement).value = ["popularity", "name", "price", "newest"][sortingMethod] + (sortReversed ? "-reversed" : "");
		Object.keys($filtersList).forEach((e) => {
			(document.getElementById(e) as HTMLInputElement).value = getFilters(e).join("_");
			(document.getElementById(e) as HTMLInputElement).disabled = getFilters(e).length == 0;
		});

		setSortIcon();
		setFilterIcon();
		setPage(page);
		(document.getElementById("collection-form") as HTMLFormElement).submit();
	};

	let productList: any[] = $state([]);

	onMount(() => {
		searchParams = new URLSearchParams(window.location.search);
		sortReversed = searchParams.get("sortby") != null ? ((searchParams.get("sortby") as string).split("-").length < 2 ? false : (searchParams.get("sortby") as string).includes("reversed") ? true : false) : false;
		sortingMethod = searchParams.get("sortby") != null ? (sortingMethods.includes((searchParams.get("sortby") as string).split("-")[0]) ? sortingMethods.indexOf((searchParams.get("sortby") as string).split("-")[0]) : 0) : 0;
		priceFilters = searchParams.get("prices") != null ? (searchParams.get("prices") as string).split("_").filter((e) => $filtersList.prices.map((f) => f.value).includes(e)) : [];
		yearFilters = searchParams.get("years") != null ? (searchParams.get("years") as string).split("_").filter((e) => $filtersList.years.map((f) => f.value).includes(e)) : [];
		setFilters = searchParams.get("sets") != null ? (searchParams.get("sets") as string).split("_").filter((e) => $filtersList.sets.map((f) => f.value).includes(e)) : [];
		playerFilters = searchParams.get("players") != null ? (searchParams.get("players") as string).split("_").filter((e) => $filtersList.players.map((f) => f.value).includes(e)) : [];
		otherFilters = searchParams.get("other") != null ? (searchParams.get("other") as string).split("_").filter((e) => $filtersList.other.map((f) => f.value).includes(e)) : [];
		currentPage = searchParams.get("page") != null ? (isNaN(parseInt(searchParams.get("page") as string)) ? 1 : Math.max(1, parseInt(searchParams.get("page") as string))) : 1;
		setSortIcon();
		setFilterIcon();

		productList = data.products.filter(filterProductList).sort(sortProductList);
		if (sortReversed) productList.reverse();

		optionsLoaded = true;
	});
</script>

<section class="w-full mx-auto [&>*]:w-screen [&>*]:2xl:w-[90rem] [&>*]:2xl:mx-auto">
	<header class="px-4 2xl:px-0">
		<form id="collection-form" class="lg:relative grid grid-cols-[3rem_1fr_1fr_1fr_1fr_3rem] lg:flex lg:justify-end gap-4 lg:px-0 [&>button]:bg-glass [&>button]:uppercase [&>div]:rounded-lg [&>button]:rounded-lg">
			<input type="text" name="sortby" id="sortby" value={sortingMethods[sortingMethod] + (sortReversed ? "-reversed" : "")} class="hidden" />
			<FancyButton iconPath="/icons/sort.svg" id="sorting-options" text="Sort By" onclick={() => ($globalPopupState = "sorts")} className="col-span-3 lg:hidden" />
			{#each Object.keys($filtersList) as filterType}
				<input type="text" name={filterType} id={filterType} disabled={getFilters(filterType).length == 0} value={getFilters(filterType).join("_")} class="hidden" />
			{/each}
			{#if optionsLoaded}
				<div class="pb-24 hidden lg:flex flex-col gap-4 absolute left-0 [&_button]:bg-primary/60 [&_button]:backdrop-blur-sm [&_button]:border-2 [&_button]:border-secondary/60">
					<SortingOptions />
					<hr class="col-span-2 border-none h-0.5 lg:h-1 bg-secondary rounded-full" />
					<Filters />
				</div>
			{/if}
			<FancyButton iconPath="/icons/filter.svg" id="filters" text="Filters" onclick={() => ($globalPopupState = "filters")} className="col-span-3 lg:hidden" />
			<FancyButton
				iconPath="/icons/left.svg"
				onclick={() => {
					submitCollectionForm(Math.max(1, currentPage - 1));
				}}
				disabled={currentPage <= 1}
				className="w-min justify-self-center"
			/>
			<div class="bg-glass col-span-4 flex">
				<input type="number" name="page" id="page" value={currentPage.toString()} class="hidden" />
				<p class="h-min m-auto px-4 whitespace-nowrap">{productList.length == 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, productList.length)} ({productList.length})</p>
			</div>
			<FancyButton
				iconPath="/icons/right.svg"
				onclick={() => {
					submitCollectionForm(Math.max(1, currentPage + 1));
				}}
				disabled={currentPage >= Math.ceil(data.products.length / itemsPerPage)}
				className="w-min justify-self-center"
			/>
		</form>
	</header>
	<article class="flex flex-col sm:flex-row sm:flex-wrap px-2 lg:pl-72 justify-evenly mx-auto mt-4 gap-8">
		{#each productList.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage) as product}
			<CardProductThumbnail id={product.id} />
		{/each}
	</article>
</section>
