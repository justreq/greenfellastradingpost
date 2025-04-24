<script lang="ts">
	import { onMount } from "svelte";

	export let title: string;
	let carousel: HTMLElement;
	let huggingSide = -1;
	let carouselOverflows = false;

	const onScrollOrResize = () => {
		if (window.innerWidth >= 640) {
			huggingSide = carousel.scrollLeft == 0 ? -1 : carousel.scrollLeft == carousel.scrollWidth - carousel.clientWidth ? 1 : 0;
			carouselOverflows = carousel.scrollWidth != Math.max(carousel.offsetWidth, carousel.clientWidth);
		} else {
			huggingSide = carousel.scrollTop == 0 ? -1 : carousel.scrollTop == carousel.scrollHeight - carousel.clientHeight ? 1 : 0;
			carouselOverflows = carousel.scrollHeight != Math.max(carousel.offsetHeight, carousel.clientHeight);
		}
	};

	const scroll = (direction: -1 | 1) => {
		if (window.innerWidth >= 640) carousel.scrollBy({ left: 272 * direction, behavior: "smooth" });
		else carousel.scrollBy({ top: 272 * direction, behavior: "smooth" });
	};

	onMount(() => onScrollOrResize());
</script>

<svelte:window onresize={onScrollOrResize} />

<section class="sm:px-4 py-4 lg:py-8 sm:border-y-2 border-x-0 bg-glass-sm">
	<h2 class="mb-2 lg:mb-4 sm:ml-4 lg:ml-20 text-5xl w-full sm:w-fit text-center sm:text-left">{title}</h2>
	<div class="flex flex-col sm:flex-row gap-4 sm:gap-0 [&>div]:w-full [&>div]:sm:w-auto [&>div]:sm:h-64 [&>div]:flex [&>div>button:disabled]:opacity-0 [&>div>button]:m-auto [&>div>button]:w-10 [&>div>button]:p-2 [&>div>button]:rounded-lg [&>div>button]:bg-tertiary [&>div>button]:transition-all [&>div>button]:duration-200 [&>div>button:not(:disabled):hover]:lg:scale-110 [&>div>button>img]:h-full [&>div>button>img]:mx-auto">
		<div>
			<!-- svelte-ignore a11y_missing_attribute -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button disabled={huggingSide == -1} type="button" onclick={() => scroll(-1)}>
				<img src="/icons/left.svg" draggable="false" class="hidden sm:block" />
				<img src="/icons/up.svg" draggable="false" class="sm:hidden" />
			</button>
		</div>
		<article bind:this={carousel} onscroll={onScrollOrResize} class="px-4 sm:px-8 max-h-96 sm:max-h-max flex flex-col sm:flex-row gap-4 w-full overflow-x-clip sm:overflow-x-scroll overflow-y-scroll sm:overflow-y-clip fade-out-x-none sm:fade-out-x">
			<slot></slot>
		</article>
		<div>
			<!-- svelte-ignore a11y_missing_attribute -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button disabled={!carouselOverflows || huggingSide == 1} type="button" onclick={() => scroll(1)}>
				<img src="/icons/right.svg" draggable="false" class="hidden sm:block" />
				<img src="/icons/down.svg" draggable="false" class="sm:hidden" />
			</button>
		</div>
	</div>
</section>
