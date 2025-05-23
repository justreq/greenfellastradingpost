<script lang="ts">
	import { page } from "$app/state";
	import FancyTextInput from "$lib/components/FancyTextInput.svelte";
	import { currentUser, isSuperUser, supabase } from "$lib/supabaseClient";
</script>

<div class="px-2 mx-auto w-fit flex flex-col gap-4 justify-center text-center">
	<h2>Available Numbers</h2>
	<h4>Refresh the page for the current numbers</h4>
	{#if isSuperUser($currentUser)}
		<div class="flex flex-col w-full whitespace-nowrap gap-4 !overflow-x-scroll [&>button]:fancy-anchor [&>button]:fancy-button [&>button]:bg-glass-sm [&>button]:my-auto">
			<FancyTextInput type="number" name="repack-number" placeholder="Spot Number" />
			<button
				onclick={async () => {
					const { error } = await supabase
						.from("repacks")
						.update({ numbers: page.data.repack.numbers.filter((e: number) => e != parseInt((document.getElementById("repack-number") as HTMLInputElement).value)) })
						.eq("id", page.data.repack.id);
					if (error) throw error;

					location.reload();
				}}
				type="button"
				class="!bg-red-500/80 !text-text !border-red-500"
			>
				Remove Spot
			</button>
			<button
				type="button"
				onclick={async () => {
					const { error } = await supabase
						.from("repacks")
						.update({ numbers: Array.from(Array(40).keys()).map((x) => x + 1) })
						.eq("id", page.data.repack.id);
					if (error) throw error;

					location.reload();
				}}
			>
				Reset Spots
			</button>
		</div>
	{/if}
	<div class="w-auto max-w-[40rem] mx-auto sm:w-screen flex justify-evenly flex-wrap gap-4 [&>*]:bg-glass-sm [&>*]:rounded-md [&>*]:text-center [&>*]:w-12 [&>*]:py-2">
		{#each Array.from(Array(40).keys()).map((x) => x + 1) as spot}
			<div class:opacity-50={!page.data.repack.numbers.includes(spot)} class:text-tertiary={!page.data.repack.numbers.includes(spot)}>{spot}</div>
		{/each}
	</div>
	<h2>GTP 1 of 1 Repack Checklist</h2>
	<div class="w-screen sm:w-auto overflow-x-scroll">
		<table id="repack-checklist-table" class="block mx-auto w-fit table-fixed overflow-scroll border-separate [&_td]:overflow-scroll [&_td]:rounded-sm [&_td]:p-2">
			<thead class="bg-accent2/60">
				<tr>
					{#each ["Year", "Player", "Team / Country", "Set", "Notes"] as column}
						<td>
							{column}
						</td>
					{/each}
				</tr>
			</thead>
			<tbody class="even:bg-tertiary/80 odd:bg-secondary/80 [&_td]:!select-text [&_button:not(:has(*))]:fancy-button [&_button:not(:has(*))]:bg-accent2/20 [&_button:not(:has(*))]:border-accent2/40">
				{#each page.data.repackChecklist as checklistItem}
					<tr data-id={checklistItem.id}>
						{#each Object.keys(checklistItem).slice(2, 7) as key}
							<td class:text-accent2={checklistItem[key] == null}>
								{checklistItem[key]}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
