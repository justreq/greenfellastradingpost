<script lang="ts">
	import { page } from "$app/state";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import Filters from "$lib/components/Filters.svelte";
	import SortingOptions from "$lib/components/SortingOptions.svelte";
	import { filtersList, globalPopupState } from "$lib/globals.js";
	import { onMount } from "svelte";

	$filtersList = {
		special: [
			{ name: "Numbered", value: "numbered" },
			{ name: "Graded", value: "graded" },
			{ name: "Autographed", value: "auto" },
			{ name: "Has Patch", value: "patch" },
		],
		prices: [
			{ name: "Free - $100", value: "lowest" },
			{ name: "$101 - $250", value: "affordable" },
			{ name: "$251 - $500", value: "midrange" },
			{ name: "$501 - $1000", value: "premium" },
			{ name: "$1000+", value: "luxury" },
		],
		sets: page.data.cards.map((e: any) => ({ name: `${e.brand} ${e.set}`, value: `${e.brand.toLowerCase().split(" ").join("-")}-${e.set.toLowerCase().split(" ").join("-")}` })).filter((e: any, index: any, array: any) => array.map((e: { value: any }) => e.value).indexOf(e.value) == index),
		players: page.data.cards.map((e: any) => ({ name: e.player, value: e.player.toLowerCase().split(" ").join("-") })).filter((e: any, index: any, array: any) => array.map((e: { value: any }) => e.value).indexOf(e.value) == index),
	};

	let sortingMethods = ["default", "name", "price", "newest"];

	let sortReversed = $state(false);
	let sortingMethod = $state(0);

	let priceFilters: string[] = $state([]);
	let setFilters: string[] = $state([]);
	let playerFilters: string[] = $state([]);
	let specialFilters: string[] = $state([]);

	let optionsLoaded = $state(false);

	const getFilters = (type: string) => {
		switch (type) {
			case "prices":
				return priceFilters;
			case "sets":
				return setFilters;
			case "players":
				return playerFilters;
			case "special":
				return specialFilters;
			default:
				return [];
		}
	};

	const itemsPerPage = 50;

	let searchParams: URLSearchParams = $state(new URLSearchParams());

	const setSortIcon = () => ((document.getElementById("button-sorting-options-icon") as HTMLImageElement).src = `/icons/sort${["", "-alpha", "-number", "-number"][sortingMethod]}${["", "-reversed"][Number(sortReversed)]}.svg`);

	const sortProductList = (a: any, b: any) => {
		switch (sortingMethod) {
			case 0:
				return a.reputation - b.reputation;
			case 1:
				return page.data.cards.find((e: { id: any }) => e.id == a.id).player.localeCompare(page.data.cards.find((e: { id: any }) => e.id == b.id).player);
			case 2:
				return a.price - b.price;
			case 3:
				return new Date(b.created).getTime() - new Date(a.created).getTime();
			default:
				return 0;
		}
	};

	const setFilterIcon = () => ((document.getElementById("button-filters-icon") as HTMLImageElement).src = `/icons/filter${["-remove", ""][Number(priceFilters.length == 0 && setFilters.length == 0 && playerFilters.length == 0 && specialFilters.length == 0)]}.svg`);

	const filterProductList = (e: any) => {
		const itemData = page.data.cards.find((card: { id: any }) => card.id == e.id);
		let isValid = false;

		if (priceFilters.length == 0 && setFilters.length == 0 && playerFilters.length == 0 && specialFilters.length == 0) return true;

		if (priceFilters.includes("lowest") && e.price <= 100.0) isValid = true;
		if (priceFilters.includes("affordable") && e.price > 100.0 && e.price <= 250.0) isValid = true;
		if (priceFilters.includes("midrange") && e.price > 250.0 && e.price <= 500.0) isValid = true;
		if (priceFilters.includes("premium") && e.price > 500.0 && e.price <= 1000.0) isValid = true;
		if (priceFilters.includes("luxury") && e.price > 1000.0) isValid = true;

		if (setFilters.length > 0 && setFilters.includes(`${itemData.brand.toLowerCase().split(" ").join("-")}-${itemData.set.toLowerCase().split(" ").join("-")}`)) isValid = true;
		if (playerFilters.length > 0 && playerFilters.includes(itemData.player.toLowerCase().split(" ").join("-"))) isValid = true;

		if (specialFilters.includes("numbered") && itemData.number != "") isValid = true;
		if (specialFilters.includes("graded") && itemData.grade != "") isValid = true;
		if (specialFilters.includes("auto") && itemData.auto) isValid = true;
		if (specialFilters.includes("patch") && itemData.patch) isValid = true;

		return isValid;
	};

	// svelte-ignore non_reactive_update
	let currentPage = 1;

	const setPage = (page: number) => {
		currentPage = page;

		(document.getElementById("page") as HTMLInputElement).value = page.toString();
		(document.getElementById("page") as HTMLInputElement).disabled = page == 1;
	};

	const submitMarketplaceForm = (page = currentPage) => {
		(document.getElementById("sortby") as HTMLInputElement).value = ["default", "name", "price", "newest"][sortingMethod] + (sortReversed ? "-reversed" : "");
		Object.keys($filtersList).forEach((e) => {
			(document.getElementById(e) as HTMLInputElement).value = getFilters(e).join("_");
			(document.getElementById(e) as HTMLInputElement).disabled = getFilters(e).length == 0;
		});

		setSortIcon();
		setFilterIcon();
		setPage(page);
		(document.getElementById("marketplace-form") as HTMLFormElement).submit();
	};

	let productList: any[] = $state([]);

	onMount(() => {
		localStorage.setItem("redirect-route", `/marketplace`);
		searchParams = new URLSearchParams(window.location.search);
		sortReversed = searchParams.get("sortby") != null ? ((searchParams.get("sortby") as string).split("-").length < 2 ? false : (searchParams.get("sortby") as string).includes("reversed") ? true : false) : false;
		sortingMethod = searchParams.get("sortby") != null ? (sortingMethods.includes((searchParams.get("sortby") as string).split("-")[0]) ? sortingMethods.indexOf((searchParams.get("sortby") as string).split("-")[0]) : 0) : 0;
		priceFilters = searchParams.get("prices") != null ? (searchParams.get("prices") as string).split("_").filter((e) => $filtersList.prices.map((f) => f.value).includes(e)) : [];
		setFilters = searchParams.get("sets") != null ? (searchParams.get("sets") as string).split("_").filter((e) => $filtersList.sets.map((f) => f.value).includes(e)) : [];
		playerFilters = searchParams.get("players") != null ? (searchParams.get("players") as string).split("_").filter((e) => $filtersList.players.map((f) => f.value).includes(e)) : [];
		specialFilters = searchParams.get("special") != null ? (searchParams.get("special") as string).split("_").filter((e) => $filtersList.special.map((f) => f.value).includes(e)) : [];
		currentPage = searchParams.get("page") != null ? (isNaN(parseInt(searchParams.get("page") as string)) ? 1 : Math.max(1, parseInt(searchParams.get("page") as string))) : 1;
		setSortIcon();
		setFilterIcon();

		productList = page.data.cards.filter((e: { retail: boolean }) => filterProductList(e) && e.retail == true).sort(sortProductList);
		if (sortReversed) productList.reverse();

		optionsLoaded = true;
	});
</script>

<section class="w-full mx-auto [&>*]:w-screen [&>*]:2xl:w-[90rem] [&>*]:2xl:mx-auto">
	<header class="px-4 2xl:px-0">
		<form id="marketplace-form" class="lg:relative grid grid-cols-[3rem_1fr_1fr_1fr_1fr_3rem] lg:flex lg:justify-end gap-4 lg:px-0 [&>button]:bg-glass [&>button]:uppercase [&>div]:rounded-lg [&>button]:rounded-lg">
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
					if (currentPage > 1) submitMarketplaceForm(Math.max(1, currentPage - 1));
				}}
				className="w-min justify-self-center"
			/>
			<div class="bg-glass col-span-4 flex">
				<input type="number" name="page" id="page" value={currentPage.toString()} class="hidden" />
				<p class="h-min m-auto px-4 whitespace-nowrap">{productList.length == 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, productList.length)} ({productList.length})</p>
			</div>
			<FancyButton
				iconPath="/icons/right.svg"
				onclick={() => {
					if (currentPage < Math.ceil(productList.length / itemsPerPage)) submitMarketplaceForm(Math.max(1, currentPage + 1));
				}}
				className="w-min justify-self-center"
			/>
		</form>
	</header>
	<article class="flex flex-row flex-wrap justify-center px-2 sm:px-8 lg:pl-80 mx-auto mt-4 gap-8">
		{#each productList.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage) as product}
			<CardProductThumbnail id={product.id} />
		{:else}
			<h3 class="px-4 md:px-16 text-center text-xl md:text-3xl">We are currently curating a collection. Create an account to get notified when we drop more cards.</h3>
		{/each}
	</article>
</section>
