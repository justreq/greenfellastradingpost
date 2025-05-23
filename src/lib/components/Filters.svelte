<script lang="ts">
	import { onMount } from "svelte";
	import FancyButton from "./FancyButton.svelte";
	import { filtersList } from "$lib/globals";

	let priceFilters: string[] = $state([]);
	let yearFilters: string[] = $state([]);
	let setFilters: string[] = $state([]);
	let playerFilters: string[] = $state([]);
	let otherFilters: string[] = $state([]);

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

	const applyFilters = () => {
		Object.keys($filtersList).forEach((e) => {
			(document.getElementById(e) as HTMLInputElement).value = getFilters(e).join("_");
			(document.getElementById(e) as HTMLInputElement).disabled = getFilters(e).length == 0;
		});

		(document.getElementById("collection-form") as HTMLFormElement).submit();
	};

	const clearFilters = () => {
		Object.keys($filtersList).forEach((type) => {
			(document.getElementById(type) as HTMLInputElement).value = "";
			(document.getElementById(type) as HTMLInputElement).disabled = true;
		});

		(document.getElementById("collection-form") as HTMLFormElement).submit();
	};

	onMount(() => {
		priceFilters = (document.getElementById("prices") as HTMLInputElement).value.split("_").filter((e) => $filtersList.prices.map((f) => f.value).includes(e));
		yearFilters = (document.getElementById("years") as HTMLInputElement).value.split("_").filter((e) => $filtersList.years.map((f) => f.value).includes(e));
		setFilters = (document.getElementById("sets") as HTMLInputElement).value.split("_").filter((e) => $filtersList.sets.map((f) => f.value).includes(e));
		playerFilters = (document.getElementById("players") as HTMLInputElement).value.split("_").filter((e) => $filtersList.players.map((f) => f.value).includes(e));
		otherFilters = (document.getElementById("other") as HTMLInputElement).value.split("_").filter((e) => $filtersList.other.map((f) => f.value).includes(e));
	});
</script>

<article class="p-2 sm:p-0 gap-2 flex flex-col [&>*]:w-full [&>p]:text-lg [&>p]:pl-4 [&>button]:uppercase [&>button]:h-min [&>button]:p-2 [&>button]:bg-secondary [&>button]:lg:bg-primary [&>button]:rounded-lg [&_hr]:col-span-2 [&_hr]:border-none [&_hr]:h-0.5 [&_hr]:lg:h-1 [&_hr]:bg-secondary [&_hr]:rounded-full">
	<button type="button" onclick={() => applyFilters()} class="!bg-tertiary col-span-2">Apply Filters</button>
	<button type="button" onclick={() => clearFilters()} class="!bg-tertiary col-span-2">Clear Filters</button>
	{#each Object.keys($filtersList) as filterType}
		<p>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</p>
		{#each $filtersList[filterType] as filter}
			<FancyButton text={filter.name} id={`filter-${filterType}-${filter.value}`} onclick={() => toggleFilter(filterType, filter.value)} isTogglable toggleValue={getFilters(filterType).includes(filter.value)} />
		{/each}
		<hr />
	{/each}
</article>
