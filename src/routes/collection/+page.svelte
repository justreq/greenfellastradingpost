<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	import FancyButton from "$lib/components/FancyButton.svelte";
	import FancyCheckbox from "$lib/components/FancyCheckbox.svelte";
	import { onMount } from "svelte";
	import { InfiniteLoader, LoaderState } from "svelte-infinite";

	const loaderState = new LoaderState();
	const allItems: string[] = $state([]);

	const loadMore = async () => {
		for (let i = 0; i < 30; i++) {
			allItems.push("47c8d853-115e-4f89-94c8-b7b4875432e8");
		}

		loaderState.loaded();
	};

	loadMore();

	let filters: { [index: string]: string[] } = {
		prices: [],
		brands: [],
		years: [],
		sets: [],
		players: [],
		variants: [],
	};

	let showPriceFilters = $state(false);
	let showBrandFilters = $state(false);
	let showYearFilters = $state(false);
	let showPaniniSetFilters = $state(false);
	let showToppsSetFilters = $state(false);
	let showDonrussSetFilters = $state(false);
	let showPlayerFilters = $state(false);
	let showVariantFilters = $state(false);

	let sortMethods = $state(["Popularity", "Price", "Newest", "Name"]);
	let sortMethod = $state(0);
	let sortAscending = $state(true);

	const toggleFilter = (filterType: string, filter: string, list: { [index: string]: string[] } = filters) => {
		let value = (document.getElementById(`filter-${filterType}-${filter}`) as HTMLInputElement).checked;

		if (value) {
			if (!list[filterType].includes(filter)) list[filterType].push(filter);
		} else list[filterType].splice(list[filterType].indexOf(filter), 1);
	};

	const applyFilters = () => {
		Object.keys(filters).forEach((key) => {
			if (filters[key].length == 0) page.url.searchParams.delete(key);
			else page.url.searchParams.set(key, filters[key].join("_"));
		});

		let query = page.url.searchParams.toString();
		goto("/collection" + (query.length > 0 ? "?" : "") + query);
	};

	const clearFilters = () => {
		Object.keys(filters).forEach((key) => {
			filters[key].forEach((filter) => {
				(document.getElementById(`filter-${key}-${filter}`) as HTMLInputElement).click();
			});

			filters[key] = [];
		});
	};

	onMount(() => {
		Object.keys(filters).forEach((key) => {
			let list = page.url.searchParams.get(key)?.split("_");
			if (!list) list = [];

			filters[key] = list;
		});
	});
</script>

<section class="flex justify-center gap-16 px-16 [&>*>div]:bg-glass-sm [&>*>div]:border-secondary/60 [&>*>div]:rounded-xl">
	<aside class="flex flex-col gap-4 [&_*]:whitespace-nowrap [&>div_button]:w-full [&>div>button]:justify-between [&>div>div]:max-h-0 [&>div>div]:overflow-hidden [&>div>div]:duration-200 [&>div>div]:transition-[max-height] [&>div>div>button]:p-4 [&>div>div>button]:pl-2">
		<div class="p-4">
			<h2 class="text-center">Filters</h2>
		</div>
		<FancyButton text="Apply Filters" className="bg-glass-sm !transition-all hover:scale-105" onclick={applyFilters} />
		<FancyButton text="Clear Filters" className="bg-glass-sm !transition-all hover:scale-105" onclick={clearFilters} />
		<div>
			<FancyButton iconPath="/icons/{showPriceFilters ? 'minus' : 'plus'}.svg" text="Prices" reverse onclick={() => (showPriceFilters = !showPriceFilters)} />
			<div class:!max-h-screen={showPriceFilters}>
				<FancyCheckbox text="$1 - $10" id="filter-prices-lowest" onclick={() => toggleFilter("prices", "lowest")} canFocus={showPriceFilters} />
				<FancyCheckbox text="$11 - $25" id="filter-prices-low" onclick={() => toggleFilter("prices", "low")} canFocus={showPriceFilters} />
				<FancyCheckbox text="$26 - $50" id="filter-prices-base" onclick={() => toggleFilter("prices", "base")} canFocus={showPriceFilters} />
				<FancyCheckbox text="$51 - $100" id="filter-prices-high" onclick={() => toggleFilter("prices", "high")} canFocus={showPriceFilters} />
				<FancyCheckbox text="$101+" id="filter-prices-highest" onclick={() => toggleFilter("prices", "highest")} canFocus={showPriceFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showBrandFilters ? 'minus' : 'plus'}.svg" text="Brands" reverse onclick={() => (showBrandFilters = !showBrandFilters)} />
			<div class:!max-h-screen={showBrandFilters}>
				<FancyCheckbox text="Panini" id="filter-brands-panini" onclick={() => toggleFilter("brands", "panini")} canFocus={showBrandFilters} />
				<FancyCheckbox text="Topps" id="filter-brands-topps" onclick={() => toggleFilter("brands", "topps")} canFocus={showBrandFilters} />
				<FancyCheckbox text="Donruss" id="filter-brands-donruss" onclick={() => toggleFilter("brands", "donruss")} canFocus={showBrandFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showYearFilters ? 'minus' : 'plus'}.svg" text="Years" reverse onclick={() => (showYearFilters = !showYearFilters)} />
			<div class:!max-h-screen={showYearFilters}>
				{#each { length: new Date().getFullYear() - 2020 }, i}
					<FancyCheckbox text={(2020 + i).toString()} id="filter-years-{2020 + i}" onclick={() => toggleFilter("years", (2020 + i).toString())} canFocus={showYearFilters} />
				{/each}
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showPaniniSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Panini)" reverse onclick={() => (showPaniniSetFilters = !showPaniniSetFilters)} />
			<div class:!max-h-screen={showPaniniSetFilters}>
				<FancyCheckbox text="Prizm" id="filter-sets-prizm" onclick={() => toggleFilter("sets", "prizm")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox text="Immaculate" id="filter-sets-immaculate" onclick={() => toggleFilter("sets", "immaculate")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox text="Impeccable" id="filter-sets-impeccable" onclick={() => toggleFilter("sets", "impeccable")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox text="Select" id="filter-sets-select" onclick={() => toggleFilter("sets", "select")} canFocus={showPaniniSetFilters} />
				<FancyCheckbox text="Obsidian" id="filter-sets-obsidian" onclick={() => toggleFilter("sets", "obsidian")} canFocus={showPaniniSetFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showToppsSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Topps)" reverse onclick={() => (showToppsSetFilters = !showToppsSetFilters)} />
			<div class:!max-h-screen={showToppsSetFilters}>
				<FancyCheckbox text="Chrome" id="filter-sets-chrome" onclick={() => toggleFilter("sets", "chrome")} canFocus={showToppsSetFilters} />
				<FancyCheckbox text="Finest" id="filter-sets-finest" onclick={() => toggleFilter("sets", "finest")} canFocus={showToppsSetFilters} />
				<FancyCheckbox text="Stadium Club" id="filter-sets-stadium-club" onclick={() => toggleFilter("sets", "stadium-club")} canFocus={showToppsSetFilters} />
				<FancyCheckbox text="Match Attax" id="filter-sets-match-attax" onclick={() => toggleFilter("sets", "match-attax")} canFocus={showToppsSetFilters} />
				<FancyCheckbox text="Living Set" id="filter-sets-living-set" onclick={() => toggleFilter("sets", "living-set")} canFocus={showToppsSetFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showDonrussSetFilters ? 'minus' : 'plus'}.svg" text="Sets (Donruss)" reverse onclick={() => (showDonrussSetFilters = !showDonrussSetFilters)} />
			<div class:!max-h-screen={showDonrussSetFilters}>
				<FancyCheckbox text="Donruss Soccer" id="filter-sets-donruss-soccer" onclick={() => toggleFilter("sets", "donruss-soccer")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox text="The Beautiful Game" id="filter-sets-the-beautiful-game" onclick={() => toggleFilter("sets", "the-beautiful-game")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox text="Kit Kings" id="filter-sets-kit-kings" onclick={() => toggleFilter("sets", "kit-kings")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox text="Net Marvels" id="filter-sets-net-marvels" onclick={() => toggleFilter("sets", "net-marvels")} canFocus={showDonrussSetFilters} />
				<FancyCheckbox text="Pitch Kings" id="filter-sets-pitch-kings" onclick={() => toggleFilter("sets", "pitch-kings")} canFocus={showDonrussSetFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showPlayerFilters ? 'minus' : 'plus'}.svg" text="Players" reverse onclick={() => (showPlayerFilters = !showPlayerFilters)} />
			<div class:!max-h-screen={showPlayerFilters}>
				<FancyCheckbox text="Lionel Messi" id="filter-players-lionel-messi" onclick={() => toggleFilter("players", "lionel-messi")} canFocus={showPlayerFilters} />
				<FancyCheckbox text="Cristiano Ronaldo" id="filter-players-cristiano-ronaldo" onclick={() => toggleFilter("players", "cristiano-ronaldo")} canFocus={showPlayerFilters} />
				<FancyCheckbox text="Kylian Mbappe" id="filter-players-kylian-mbappe" onclick={() => toggleFilter("players", "kylian-mbappe")} canFocus={showPlayerFilters} />
				<FancyCheckbox text="Lamine Yamal" id="filter-players-lamine-yamal" onclick={() => toggleFilter("players", "lamine-yamal")} canFocus={showPlayerFilters} />
				<FancyCheckbox text="Maxence Lacroix" id="filter-players-maxence-lacroix" onclick={() => toggleFilter("players", "maxence-lacroix")} canFocus={showPlayerFilters} />
			</div>
		</div>
		<div>
			<FancyButton iconPath="/icons/{showVariantFilters ? 'minus' : 'plus'}.svg" text="Variants" reverse onclick={() => (showVariantFilters = !showVariantFilters)} />
			<div class:!max-h-screen={showVariantFilters}>
				<FancyCheckbox text="Numbered" id="filter-variants-numbered" onclick={() => toggleFilter("variants", "numbered")} canFocus={showVariantFilters} />
				<FancyCheckbox text="Auto" id="filter-variants-auto" onclick={() => toggleFilter("variants", "auto")} canFocus={showVariantFilters} />
				<FancyCheckbox text="Patch" id="filter-variants-patch" onclick={() => toggleFilter("variants", "patch")} canFocus={showVariantFilters} />
			</div>
		</div>
	</aside>
	<article class="flex-grow max-w-[93rem]">
		<header class="flex justify-between [&>div]:bg-glass-sm [&>div]:border-secondary/60 [&>div]:rounded-xl">
			<div class="p-4 w-fit">
				<h2 class="">GTP Card Collection</h2>
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
			<InfiniteLoader {loaderState} triggerLoad={loadMore}>
				<div class="grid grid-cols-5 gap-8 p-8 rounded-xl bg-glass-sm">
					{#each allItems as id}
						<CardProductThumbnail {id} />
					{/each}
				</div>
			</InfiniteLoader>
		</article>
	</article>
</section>
