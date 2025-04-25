<script lang="ts">
	import FancyButton from "$lib/components/FancyButton.svelte";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	let { data } = $props();

	let columns: [{ column_name: string; data_type: string }] = $state([{ column_name: "", data_type: "" }]);

	const convertTimestampToReadable = (timestamp: string) => {
		const date = new Date(timestamp);

		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		};

		const formatter = new Intl.DateTimeFormat("en-US", options);
		return formatter.format(date);
	};

	const convertFloatToPrice = (float: number) => {
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			trailingZeroDisplay: "stripIfInteger",
		});

		return formatter.format(float);
	};

	onMount(async () => {
		const { data, error } = await supabase.rpc("get_types", { tname: "cards" });
		if (error) throw error;
		columns = data.slice(4);
	});
</script>

<section class="w-[90%] 2xl:w-[90rem] h-full p-4 mx-auto bg-glass-sm rounded-lg">
	<header class="flex justify-between mb-2">
		<h2>Inventory (Cards)</h2>
		<FancyButton iconPath="/icons/plus.svg" className="bg-secondary !transition-all lg:hover:scale-110" />
	</header>
	<table class="block table-fixed overflow-scroll border-separate [&_td]:whitespace-nowrap [&_td]:overflow-scroll [&_td]:rounded-sm [&_td]:p-2">
		<thead class="bg-accent2/60">
			<tr>
				{#each columns as column}
					<td>{column.column_name}</td>
				{/each}
			</tr>
		</thead>
		{#each data.cards as card}
			<tbody class="even:bg-tertiary/80 odd:bg-secondary/80 [&_td]:!select-text">
				<tr>
					{#each Object.keys(card).slice(4) as key}
						<td>{["created", "bought", "sold"].includes(key) ? convertTimestampToReadable(card[key]) : key.includes("price") ? convertFloatToPrice(card[key]) : ["auto", "patch"].includes(key) ? (card[key] ? "✅" : "❌") : card[key]}</td>
					{/each}
				</tr>
			</tbody>
		{/each}
	</table>
</section>
