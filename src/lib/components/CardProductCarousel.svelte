<script lang="ts">
	import { onMount } from "svelte";

	export let title: string;
	let carousel: HTMLElement;
	let huggingSide = -1;
	let carouselOverflows = false;

	const onScrollOrResize = () => {
		huggingSide = carousel.scrollLeft == 0 ? -1 : carousel.scrollLeft == carousel.scrollWidth - carousel.clientWidth ? 1 : 0;
		carouselOverflows = carousel.scrollWidth != Math.max(carousel.offsetWidth, carousel.clientWidth);
	};

	const scroll = (direction: -1 | 1) => {
		carousel.scrollBy({ left: 272 * direction, behavior: "smooth" });
	};

	onMount(() => onScrollOrResize());
</script>

<svelte:window onresize={onScrollOrResize} />

<section class="lg:px-4 py-4 lg:py-8 border-y-2 border-x-0 bg-glass-sm">
	<h2 class="mb-2 lg:mb-4 ml-4 lg:ml-20">{title}</h2>
	<div class="flex [&>div>button:disabled]:opacity-0 [&>div>button]:my-auto [&>div>button]:w-10 [&>div>button]:p-2 [&>div>button]:rounded-lg [&>div>button]:bg-tertiary [&>div>button]:transition-all [&>div>button]:duration-200 [&>div>button:not(:disabled):hover]:scale-110 [&>div>button>img]:h-full [&>div>button>img]:mx-auto">
		<div class="h-64 hidden lg:flex">
			<!-- svelte-ignore a11y_missing_attribute -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button disabled={huggingSide == -1} type="button" onclick={() => scroll(-1)}><img src="/icons/left.svg" draggable="false" /></button>
		</div>
		<article bind:this={carousel} onscroll={onScrollOrResize} class="px-8 flex gap-4 w-full overflow-x-scroll overflow-y-clip fade-out-x">
			<slot></slot>
		</article>
		<div class="h-64 hidden lg:flex">
			<!-- svelte-ignore a11y_missing_attribute -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button disabled={!carouselOverflows || huggingSide == 1} type="button" onclick={() => scroll(1)}><img src="/icons/right.svg" draggable="false" /></button>
		</div>
	</div>
</section>
