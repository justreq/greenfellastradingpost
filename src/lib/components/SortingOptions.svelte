<script lang="ts">
	import { onMount } from "svelte";
	import FancyButton from "./FancyButton.svelte";

	let sortReversed = $state(false);
	let sortingMethod = $state(0);

	const setSort = () => {
		(document.getElementById("sortby") as HTMLInputElement).value = ["popularity", "name", "price", "newest"][sortingMethod] + (sortReversed ? "-reversed" : "");
		(document.getElementById("collection-form") as HTMLFormElement).submit();
	};

	onMount(() => {
		sortReversed = (document.getElementById("sortby") as HTMLInputElement).value.includes("-reversed");
		sortingMethod = ["popularity", "name", "price", "newest"].indexOf((document.getElementById("sortby") as HTMLInputElement).value.split("-")[0]);
	});
</script>

<article class="p-2 sm:p-0 grid grid-cols-2 auto-rows-min gap-2 [&>button]:uppercase [&>button]:h-min [&>button]:p-2 [&>button]:bg-secondary [&>button]:lg:bg-primary [&>button]:rounded-lg [&_hr]:col-span-2 [&_hr]:border-none [&_hr]:h-0.5 [&_hr]:lg:h-1 [&_hr]:bg-secondary [&_hr]:rounded-full">
	<button type="button" onclick={() => setSort()} class="!bg-tertiary col-span-2">Apply Sorting</button>
	<hr />
	<FancyButton iconPath="/icons/sort.svg" text="Default" onclick={() => (sortReversed = false)} isTogglable toggleValue={!sortReversed} />
	<FancyButton iconPath="/icons/sort-reversed.svg" text="Reversed" onclick={() => (sortReversed = true)} isTogglable toggleValue={sortReversed} />
	<hr />
	<FancyButton text="Popularity" onclick={() => (sortingMethod = 0)} isTogglable toggleValue={sortingMethod == 0} />
	<FancyButton text="Name" onclick={() => (sortingMethod = 1)} isTogglable toggleValue={sortingMethod == 1} />
	<FancyButton text="Price" onclick={() => (sortingMethod = 2)} isTogglable toggleValue={sortingMethod == 2} />
	<FancyButton text="Newest" onclick={() => (sortingMethod = 3)} isTogglable toggleValue={sortingMethod == 3} />
</article>
