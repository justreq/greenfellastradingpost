<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyCheckbox from "$lib/components/FancyCheckbox.svelte";

	let currentPage = parseInt(page.url.searchParams.get("page") ?? "1", 10);
	if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

	let filters: { [index: string]: string[] } = {
		prices: [],
		brands: [],
		years: [],
		sets: [],
		players: [],
		types: [],
		variants: [],
	};

	let showPriceFilters = false;
	let showBrandFilters = false;
	let showYearFilters = false;
	let showPaniniSetFilters = false;
	let showToppsSetFilters = false;
	let showDonrussSetFilters = false;
	let showPlayerFilters = false;
	let showTypeFilters = false;
	let showVariantFilters = false;

	let sortMethods = ["Popularity", "Price", "Newest", "Name"];
	let sortMethod = 0;
	let sortAscending = true;

	const toggleFilter = (filters: { [index: string]: string[] }, filterType: string, filter: string) => {
		let value = (document.getElementById(`filter-${filter}`) as HTMLInputElement).checked;

		if (value) filters[filterType].push(filter);
		else filters[filterType].splice(filters[filterType].indexOf(filter), 1);
	};

	const applyFilters = (event: Event) => {
		let target = event.target as HTMLInputElement;

		if (target.id == "page-input") {
			if (currentPage == 1) {
				page.url.searchParams.delete("page");
			} else page.url.searchParams.set("page", currentPage.toString());
		}

		let query = page.url.searchParams.toString();
		goto("/collection" + (query.length > 0 ? "?" : "") + query);
	};
</script>

<svelte:head>
	<title>Collection - Greenfellas' Trading Post</title>
</svelte:head>

<!-- <input type="number" min="1" name="page" id="page-input" bind:value={currentPage} oninput={applyFilters} /> -->

<section class="flex justify-center gap-16 px-16 [&>*>div]:bg-glass-sm [&>*>div]:border-secondary/60 [&>*>div]:rounded-xl">
	<aside class="flex flex-col gap-4 [&_*]:whitespace-nowrap [&>div>button]:w-full [&>div>button]:justify-between [&>div>div]:max-h-0 [&>div>div]:overflow-hidden [&>div>div]:duration-200 [&>div>div]:transition-[max-height] [&>div>div>button]:p-4 [&>div>div>button]:pl-2">
		<div class="p-4">
			<h2 class="text-3xl">Filters</h2>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showPriceFilters ? 'minus' : 'plus'}.svg" text="Prices" reverse onclick={() => (showPriceFilters = !showPriceFilters)} />
			<div class:!max-h-screen={showPriceFilters}>
				<FancyCheckbox text="$1 - $10" id="filter-1-10" onclick={() => toggleFilter(filters, "prices", "1-10")} />
				<FancyCheckbox text="$11 - $25" id="filter-11-25" onclick={() => toggleFilter(filters, "prices", "11-25")} />
				<FancyCheckbox text="$26 - $50" id="filter-26-50" onclick={() => toggleFilter(filters, "prices", "26-50")} />
				<FancyCheckbox text="$51 - $100" id="filter-51-100" onclick={() => toggleFilter(filters, "prices", "51-100")} />
				<FancyCheckbox text="$101+" id="filter-101+" onclick={() => toggleFilter(filters, "prices", "101+")} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showBrandFilters ? 'minus' : 'plus'}.svg" text="Brands" reverse onclick={() => (showBrandFilters = !showBrandFilters)} />
			<div class:!max-h-screen={showBrandFilters}>
				<FancyCheckbox text="Panini" id="filter-panini" onclick={() => toggleFilter(filters, "brands", "panini")} />
				<FancyCheckbox text="Topps" id="filter-topps" onclick={() => toggleFilter(filters, "brands", "topps")} />
				<FancyCheckbox text="Donruss" id="filter-donruss" onclick={() => toggleFilter(filters, "brands", "donruss")} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showYearFilters ? 'minus' : 'plus'}.svg" text="Years" reverse onclick={() => (showYearFilters = !showYearFilters)} />
			<div class:!max-h-screen={showYearFilters}>
				{#each { length: new Date().getFullYear() - 2020 }, i}
					<FancyCheckbox text={(2020 + i).toString()} id="filter-{2020 + i}" onclick={() => toggleFilter(filters, "years", (2020 + i).toString())} />
				{/each}
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showPaniniSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Panini)" reverse onclick={() => (showPaniniSetFilters = !showPaniniSetFilters)} />
			<div class:!max-h-screen={showPaniniSetFilters}>
				<FancyCheckbox text="Prizm" id="filter-prizm" onclick={() => toggleFilter(filters, "sets", "prizm")} />
				<FancyCheckbox text="Immaculate" id="filter-immaculate" onclick={() => toggleFilter(filters, "sets", "immaculate")} />
				<FancyCheckbox text="Impeccable" id="filter-impeccable" onclick={() => toggleFilter(filters, "sets", "impeccable")} />
				<FancyCheckbox text="Select" id="filter-select" onclick={() => toggleFilter(filters, "sets", "select")} />
				<FancyCheckbox text="Obsidian" id="filter-obsidian" onclick={() => toggleFilter(filters, "sets", "obsidian")} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showToppsSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Topps)" reverse onclick={() => (showToppsSetFilters = !showToppsSetFilters)} />
			<div class:!max-h-screen={showToppsSetFilters}>
				<FancyCheckbox text="Chrome" id="filter-chrome" onclick={() => toggleFilter(filters, "sets", "chrome")} />
				<FancyCheckbox text="Finest" id="filter-finest" onclick={() => toggleFilter(filters, "sets", "finest")} />
				<FancyCheckbox text="Stadium Club" id="filter-stadiumclub" onclick={() => toggleFilter(filters, "sets", "stadiumclub")} />
				<FancyCheckbox text="Match Attax" id="filter-matchattax" onclick={() => toggleFilter(filters, "sets", "matchattax")} />
				<FancyCheckbox text="Living Set" id="filter-livingset" onclick={() => toggleFilter(filters, "sets", "livingset")} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showDonrussSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Donruss)" reverse onclick={() => (showDonrussSetFilters = !showDonrussSetFilters)} />
			<div class:!max-h-screen={showDonrussSetFilters}>
				<FancyCheckbox text="Donruss Soccer" id="filter-donrusssoccer" onclick={() => toggleFilter(filters, "sets", "donrusssoccer")} />
				<FancyCheckbox text="The Beautiful Game" id="filter-thebeautifulgame" onclick={() => toggleFilter(filters, "sets", "thebeautifulgame")} />
				<FancyCheckbox text="Kit Kings" id="filter-kitkings" onclick={() => toggleFilter(filters, "sets", "kitkings")} />
				<FancyCheckbox text="Net Marvels" id="filter-netmarvels" onclick={() => toggleFilter(filters, "sets", "netmarvels")} />
				<FancyCheckbox text="Pitch Kings" id="filter-pitchkings" onclick={() => toggleFilter(filters, "sets", "pitchkings")} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showPlayerFilters ? 'minus' : 'plus'}.svg" text="Players" reverse onclick={() => (showPlayerFilters = !showPlayerFilters)} />
			<div class:!max-h-screen={showPlayerFilters}>
				<FancyCheckbox text="Lionel Messi" id="filter-lionelmessi" onclick={() => toggleFilter(filters, "players", "lionelmessi")} />
				<FancyCheckbox text="Cristiano Ronaldo" id="filter-cristianoronaldo" onclick={() => toggleFilter(filters, "players", "cristianoronaldo")} />
				<FancyCheckbox text="Kylian Mbappe" id="filter-kylianmbappe" onclick={() => toggleFilter(filters, "players", "kylianmbappe")} />
				<FancyCheckbox text="Lamine Yamal" id="filter-lamineyamal" onclick={() => toggleFilter(filters, "players", "lamineyamal")} />
				<FancyCheckbox text="Maxence Lacroix" id="filter-maxencelacroix" onclick={() => toggleFilter(filters, "players", "maxencelacroix")} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showTypeFilters ? 'minus' : 'plus'}.svg" text="Types" reverse onclick={() => (showTypeFilters = !showTypeFilters)} />
			<div class:!max-h-screen={showTypeFilters}>
				<FancyCheckbox text="Rookie" id="filter-rookie" onclick={() => toggleFilter(filters, "types", "rookie")} />
				<FancyCheckbox text="Legend" id="filter-legend" onclick={() => toggleFilter(filters, "types", "legend")} />
				<FancyCheckbox text="Team" id="filter-team" onclick={() => toggleFilter(filters, "types", "team")} />
				<FancyCheckbox text="Action Shot" id="filter-actionshot" onclick={() => toggleFilter(filters, "types", "actionshot")} />
				<FancyCheckbox text="Special Event" id="filter-specialevent" onclick={() => toggleFilter(filters, "types", "specialevent")} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showVariantFilters ? 'minus' : 'plus'}.svg" text="Variants" reverse onclick={() => (showVariantFilters = !showVariantFilters)} />
			<div class:!max-h-screen={showVariantFilters}>
				<FancyCheckbox text="Numbered" id="filter-numbered" onclick={() => toggleFilter(filters, "variants", "numbered")} />
				<FancyCheckbox text="Auto" id="filter-auto" onclick={() => toggleFilter(filters, "variants", "auto")} />
				<FancyCheckbox text="Refractor" id="filter-refractor" onclick={() => toggleFilter(filters, "variants", "refractor")} />
				<FancyCheckbox text="Holographic" id="filter-holographic" onclick={() => toggleFilter(filters, "variants", "holographic")} />
				<FancyCheckbox text="Memorabilia" id="filter-memorabilia" onclick={() => toggleFilter(filters, "variants", "memorabilia")} />
			</div>
		</div>
	</aside>
	<article class="flex-grow max-w-[93rem]">
		<header class="flex justify-between [&>div]:bg-glass-sm [&>div]:border-secondary/60 [&>div]:rounded-xl">
			<div class="p-4 w-fit">
				<h2 class="text-3xl">GTP Card Collection</h2>
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
				<button type="button" onclick={() => (sortMethod = sortMethod == sortMethods.length - 1 ? 0 : sortMethod + 1)}><img src="/icons/right.svg" draggable="false" /></button>
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
