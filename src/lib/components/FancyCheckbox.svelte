<script lang="ts">
	import { onMount } from "svelte";

	let { text = "", id = "", onclick = () => {}, canFocus = true, value = $bindable(false), className = "" } = $props();

	// svelte-ignore non_reactive_update
	let setFocus = (value: boolean) => 0 | -1;

	onMount(() => {
		setFocus = (value: boolean) => {
			if (!value) {
				document.getElementById(`checkbox-${id}`)?.blur();
			}
			return value ? 0 : -1;
		};
	});
</script>

<button type="button" id="checkbox-{id}" onclick={() => document.getElementById(id)?.click()} tabindex={setFocus(canFocus)} class="flex gap-2 [&>*]:transition-colors [&>*]:duration-200 [&:hover>div]:lg:border-accent2 [&:hover>p]:lg:text-accent2 {className}">
	<input
		type="checkbox"
		name={id}
		{id}
		bind:checked={value}
		onclick={() => {
			onclick();
		}}
		class="hidden"
	/>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<div class:!border-accent2={value} class="p-1 min-w-6 h-6 rounded-md border-[3px] border-text"><div class:bg-accent2={value} class="w-full h-full rounded-sm"></div></div>
	<p class="text-left text-sm lg:text-base my-auto">{text}</p>
</button>
