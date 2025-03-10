<script lang="ts">
	import { onMount } from "svelte";

	export let color: string;
	let label: HTMLElement;

	onMount(() => {
		label.style.backgroundColor = `${color}80`;
		label.style.borderColor = `${color}40`;
	});
</script>

<div bind:this={label} class="rounded-full px-3 border-2 h-min">
	<slot></slot>
</div>
