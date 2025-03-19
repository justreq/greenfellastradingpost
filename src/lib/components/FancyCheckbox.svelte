<script lang="ts">
	export let text: string;
	export let id = "";
	export let onclick = () => {};

	let value: boolean;
</script>

<button type="button" onclick={() => document.getElementById(id)?.click()} class="flex gap-2 [&>*]:transition-colors [&>*]:duration-200 [&:hover>div]:border-accent2 [&:hover>p]:text-accent2">
	<input type="checkbox" name={id} {id} bind:checked={value} {onclick} class="hidden" />
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<div class:!border-accent2={value} class="p-1 w-6 h-6 rounded-md border-[3px] border-text"><div class:bg-accent2={value} class="w-full h-full rounded-sm"></div></div>
	<p>{text}</p>
</button>
