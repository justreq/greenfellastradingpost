<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyCheckbox from "$lib/components/FancyCheckbox.svelte";
	import { onMount } from "svelte";

	let currentPage = parseInt(page.url.searchParams.get("page") ?? "1", 10);
	if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

	let filters: { [index: string]: string[] } = {
		prices: [],
		brands: [],
		years: [],
		sets: [],
		players: [],
		variants: [],
	};

	let showPriceFilters = false;
	let showBrandFilters = false;
	let showYearFilters = false;
	let showPaniniSetFilters = false;
	let showToppsSetFilters = false;
	let showDonrussSetFilters = false;
	let showPlayerFilters = false;
	let showVariantFilters = false;

	let sortMethods = ["Popularity", "Price", "Newest", "Name"];
	let sortMethod = 0;
	let sortAscending = true;

	const toggleFilter = (filters: { [index: string]: string[] }, filterType: string, filter: string) => {
		let value = (document.getElementById(`filter-${filterType}-${filter}`) as HTMLInputElement).checked;

		if (value && !filters[filterType].includes(filter)) filters[filterType].push(filter);
		else filters[filterType].splice(filters[filterType].indexOf(filter), 1);
	};

	const applyFilters = () => {
		if (currentPage == 1) {
			page.url.searchParams.delete("page");
		} else page.url.searchParams.set("page", currentPage.toString());

		Object.keys(filters).forEach((key) => {
			if (filters[key].length == 0) page.url.searchParams.delete(key);
			else page.url.searchParams.set(key, filters[key].join("_"));
		});

		let query = page.url.searchParams.toString();
		goto("/collection" + (query.length > 0 ? "?" : "") + query);
	};

	const clearFilters = () => {
		Object.keys(filters).forEach((key) => {
			filters[key] = [];
		});

		applyFilters();
	};

	onMount(() => {
		Object.keys(filters).forEach((key) => {
			let list = page.url.searchParams.get(key)?.split("_");
			if (!list) list = [];

			filters[key] = list;

			//list.forEach((filter) => (document.getElementById(`filter-${key}-${filter}`) as HTMLElement).click());
		});
	});
</script>

<svelte:head>
	<title>Collection - Greenfellas' Trading Post</title>
</svelte:head>

<section class="flex justify-center gap-16 px-16 [&>*>div]:bg-glass-sm [&>*>div]:border-secondary/60 [&>*>div]:rounded-xl">
	<aside class="flex flex-col gap-4 [&_*]:whitespace-nowrap [&>div_button]:w-full [&>div>button]:justify-between [&>div>div]:max-h-0 [&>div>div]:overflow-hidden [&>div>div]:duration-200 [&>div>div]:transition-[max-height] [&>div>div>button]:p-4 [&>div>div>button]:pl-2">
		<div class="p-4">
			<h2 class="text-5xl text-center">Filters</h2>
		</div>
		<FancyButton text="Apply Filters" className="bg-glass-sm transition-all hover:scale-105" onclick={applyFilters} />
		<FancyButton text="Clear Filters" className="bg-glass-sm transition-all hover:scale-105" onclick={clearFilters} />
		<div>
			<FancyButton iconPath="/icons/{showPriceFilters ? 'minus' : 'plus'}.svg" text="Prices" reverse onclick={() => (showPriceFilters = !showPriceFilters)} />
			<div class:!max-h-screen={showPriceFilters}>
				<FancyCheckbox value={filters.prices.includes("lowest")} text="$1 - $10" id="filter-prices-lowest" onclick={() => toggleFilter(filters, "prices", "lowest")} canFocus={showPriceFilters} />
				<FancyCheckbox value={filters.prices.includes("low")} text="$11 - $25" id="filter-prices-low" onclick={() => toggleFilter(filters, "prices", "low")} canFocus={showPriceFilters} />
				<FancyCheckbox value={filters.prices.includes("base")} text="$26 - $50" id="filter-prices-base" onclick={() => toggleFilter(filters, "prices", "base")} canFocus={showPriceFilters} />
				<FancyCheckbox value={filters.prices.includes("high")} text="$51 - $100" id="filter-prices-high" onclick={() => toggleFilter(filters, "prices", "high")} canFocus={showPriceFilters} />
				<FancyCheckbox value={filters.prices.includes("highest")} text="$101+" id="filter-prices-highest" onclick={() => toggleFilter(filters, "prices", "highest")} canFocus={showPriceFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showBrandFilters ? 'minus' : 'plus'}.svg" text="Brands" reverse onclick={() => (showBrandFilters = !showBrandFilters)} />
			<div class:!max-h-screen={showBrandFilters}>
				<FancyCheckbox value={filters.brands.includes("panini")} text="Panini" id="filter-brands-panini" onclick={() => toggleFilter(filters, "brands", "panini")} canFocus={showBrandFilters} />
				<FancyCheckbox value={filters.brands.includes("topps")} text="Topps" id="filter-brands-topps" onclick={() => toggleFilter(filters, "brands", "topps")} canFocus={showBrandFilters} />
				<FancyCheckbox value={filters.brands.includes("donruss")} text="Donruss" id="filter-brands-donruss" onclick={() => toggleFilter(filters, "brands", "donruss")} canFocus={showBrandFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showYearFilters ? 'minus' : 'plus'}.svg" text="Years" reverse onclick={() => (showYearFilters = !showYearFilters)} />
			<div class:!max-h-screen={showYearFilters}>
				{#each { length: new Date().getFullYear() - 2020 }, i}
					<FancyCheckbox value={filters.years.includes((2020 + i).toString())} text={(2020 + i).toString()} id="filter-years-{2020 + i}" onclick={() => toggleFilter(filters, "years", (2020 + i).toString())} canFocus={showYearFilters} />
				{/each}
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showPaniniSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Panini)" reverse onclick={() => (showPaniniSetFilters = !showPaniniSetFilters)} />
			<div class:!max-h-screen={showPaniniSetFilters}>
				<FancyCheckbox value={filters.sets.includes("prizm")} text="Prizm" id="filter-sets-prizm" onclick={() => toggleFilter(filters, "sets", "prizm")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox value={filters.sets.includes("immaculate")} text="Immaculate" id="filter-sets-immaculate" onclick={() => toggleFilter(filters, "sets", "immaculate")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox value={filters.sets.includes("impeccable")} text="Impeccable" id="filter-sets-impeccable" onclick={() => toggleFilter(filters, "sets", "impeccable")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox value={filters.sets.includes("select")} text="Select" id="filter-sets-select" onclick={() => toggleFilter(filters, "sets", "select")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox value={filters.sets.includes("obsidian")} text="Obsidian" id="filter-sets-obsidian" onclick={() => toggleFilter(filters, "sets", "obsidian")} canFocus={showPaniniSetFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showToppsSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Topps)" reverse onclick={() => (showToppsSetFilters = !showToppsSetFilters)} />
			<div class:!max-h-screen={showToppsSetFilters}>
				<FancyCheckbox value={filters.sets.includes("chrome")} text="Chrome" id="filter-sets-chrome" onclick={() => toggleFilter(filters, "sets", "chrome")} canFocus={showToppsSetFilters} />
				<FancyCheckbox value={filters.sets.includes("finest")} text="Finest" id="filter-sets-finest" onclick={() => toggleFilter(filters, "sets", "finest")} canFocus={showToppsSetFilters} />
				<FancyCheckbox value={filters.sets.includes("stadium-club")} text="Stadium Club" id="filter-sets-stadium-club" onclick={() => toggleFilter(filters, "sets", "stadium-club")} canFocus={showToppsSetFilters} />
				<FancyCheckbox value={filters.sets.includes("match-attax")} text="Match Attax" id="filter-sets-match-attax" onclick={() => toggleFilter(filters, "sets", "match-attax")} canFocus={showToppsSetFilters} />
				<FancyCheckbox value={filters.sets.includes("living-set")} text="Living Set" id="filter-sets-living-set" onclick={() => toggleFilter(filters, "sets", "living-set")} canFocus={showToppsSetFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showDonrussSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Donruss)" reverse onclick={() => (showDonrussSetFilters = !showDonrussSetFilters)} />
			<div class:!max-h-screen={showDonrussSetFilters}>
				<FancyCheckbox value={filters.sets.includes("donruss-soccer")} text="Donruss Soccer" id="filter-sets-donruss-soccer" onclick={() => toggleFilter(filters, "sets", "donruss-soccer")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox value={filters.sets.includes("the-beautiful-game")} text="The Beautiful Game" id="filter-sets-the-beautiful-game" onclick={() => toggleFilter(filters, "sets", "the-beautiful-game")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox value={filters.sets.includes("kit-kings")} text="Kit Kings" id="filter-sets-kit-kings" onclick={() => toggleFilter(filters, "sets", "kit-kings")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox value={filters.sets.includes("net-marvels")} text="Net Marvels" id="filter-sets-net-marvels" onclick={() => toggleFilter(filters, "sets", "net-marvels")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox value={filters.sets.includes("pitch-kings")} text="Pitch Kings" id="filter-sets-pitch-kings" onclick={() => toggleFilter(filters, "sets", "pitch-kings")} canFocus={showDonrussSetFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showPlayerFilters ? 'minus' : 'plus'}.svg" text="Players" reverse onclick={() => (showPlayerFilters = !showPlayerFilters)} />
			<div class:!max-h-screen={showPlayerFilters}>
				<FancyCheckbox value={filters.players.includes("lionel-messi")} text="Lionel Messi" id="filter-players-lionel-messi" onclick={() => toggleFilter(filters, "players", "lionel-messi")} canFocus={showPlayerFilters} />
				<FancyCheckbox value={filters.players.includes("cristiano-ronaldo")} text="Cristiano Ronaldo" id="filter-players-cristiano-ronaldo" onclick={() => toggleFilter(filters, "players", "cristiano-ronaldo")} canFocus={showPlayerFilters} />
				<FancyCheckbox value={filters.players.includes("kylian-mbappe")} text="Kylian Mbappe" id="filter-players-kylian-mbappe" onclick={() => toggleFilter(filters, "players", "kylian-mbappe")} canFocus={showPlayerFilters} />
				<FancyCheckbox value={filters.players.includes("lamine-yamal")} text="Lamine Yamal" id="filter-players-lamine-yamal" onclick={() => toggleFilter(filters, "players", "lamine-yamal")} canFocus={showPlayerFilters} />
				<FancyCheckbox value={filters.players.includes("maxence-lacroix")} text="Maxence Lacroix" id="filter-players-maxence-lacroix" onclick={() => toggleFilter(filters, "players", "maxence-lacroix")} canFocus={showPlayerFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showVariantFilters ? 'minus' : 'plus'}.svg" text="Variants" reverse onclick={() => (showVariantFilters = !showVariantFilters)} />
			<div class:!max-h-screen={showVariantFilters}>
				<FancyCheckbox value={filters.variants.includes("numbered")} text="Numbered" id="filter-variants-numbered" onclick={() => toggleFilter(filters, "variants", "numbered")} canFocus={showVariantFilters} />
				<FancyCheckbox value={filters.variants.includes("auto")} text="Auto" id="filter-variants-auto" onclick={() => toggleFilter(filters, "variants", "auto")} canFocus={showVariantFilters} />
				<FancyCheckbox value={filters.variants.includes("patch")} text="Patch" id="filter-variants-patch" onclick={() => toggleFilter(filters, "variants", "patch")} canFocus={showVariantFilters} />
			</div>
		</div>
	</aside>
	<article class="flex-grow max-w-[93rem]">
		<header class="flex justify-between [&>div]:bg-glass-sm [&>div]:border-secondary/60 [&>div]:rounded-xl">
			<div class="p-4 w-fit">
				<h2 class="text-5xl">GTP Card Collection</h2>
			</div>
			<div class="flex px-4 gap-4 w-fit [&>*]:my-auto [&>button]:w-8 [&>button]:aspect-square [&>button]:p-2 [&>button]:rounded-lg [&>button]:bg-tertiary [&>button]:transition-all [&>button]:duration-200 [&>button:hover]:scale-110 [&>button>img]:h-full [&>button>img]:mx-auto">
				<!-- svelte-ignore a11y_missing_attribute -->
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button type="button" onclick={() => (sortMethod = sortMethod == 0 ? sortMethods.length - 1 : sortMethod - 1)}><img src="/icons/left.svg" draggable="false" /></button>
				<div>
					<FancyButton iconPath="/icons/{sortAscending ? 'ascending' : 'descending'}.svg" text={sortMethods[sortMethod]} reverse onclick={() => (sortAscending = !sortAscending)} className="bg-tertiary justify-between min-w-40 duration-200 transition-transform hover:scale-105" />
				</div>
				<!-- svelte-ignore a11y_missing_attribute -->
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button type="button" onclick={() => (sortMethod = sortMethod == sortMethods.length - 1 ? 0 : sortMethod + 1)} class="mr-8"><img src="/icons/right.svg" draggable="false" /></button>
				<!-- svelte-ignore a11y_missing_attribute -->
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					type="button"
					onclick={() => {
						currentPage = Math.max(1, currentPage - 1);
						applyFilters();
					}}
				>
					<img src="/icons/left.svg" draggable="false" />
				</button>
				<p class="p-2 rounded-lg bg-tertiary duration-200 transition-transform hover:scale-105">Page {currentPage}</p>
				<!-- svelte-ignore a11y_missing_attribute -->
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					type="button"
					onclick={() => {
						currentPage = Math.max(1, currentPage + 1);
						applyFilters();
					}}
				>
					<img src="/icons/right.svg" draggable="false" />
				</button>
			</div>
		</header>
		<article class="mt-4">
			<div class="grid grid-cols-5 gap-8 p-8 rounded-xl bg-glass-sm">
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
				<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
			</div>
		</article>
	</article>
</section>
