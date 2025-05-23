<script lang="ts">
	import { onMount } from "svelte";

	export let disabled = false;
	export let type: "button" | "submit" | "reset" | null | undefined = "button";
	export let id: string = "";
	export let iconPath = "";
	export let text = "";
	export let onclick: any = () => {};
	export let className = "";
	export let canFocus = true;
	export let reverse = false;
	export let isTogglable = false;
	export let toggleValue = false;

	let setFocus = (value: boolean) => 0 | -1;

	onMount(() => {
		setFocus = (value: boolean) => {
			if (!value) {
				document.getElementById(`button-${id}`)?.blur();
			}
			return value ? 0 : -1;
		};
	});
</script>

<button {disabled} {type} id="button-{id}" {onclick} tabindex={setFocus(canFocus)} class:flex-row-reverse={reverse} class:border-2={isTogglable} class:!border-text={isTogglable && toggleValue} class="h-min p-2 flex whitespace-nowrap gap-4 rounded-lg border-transparent transition-colors duration-200 md:hover:bg-tertiary {className}">
	{#if iconPath != ""}
		<div class="h-6 aspect-square flex my-auto"><img src={iconPath} alt="" id="button-{id}-icon" class="h-full m-auto" /></div>
	{/if}
	{text}
</button>
