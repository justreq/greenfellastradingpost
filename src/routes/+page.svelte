<script>
	import CardProductCarousel from "$lib/components/CardProductCarousel.svelte";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
	export let data;
</script>

<img src="/images/title.png" alt="Title" class="w-[90%] 2xl:w-[90rem] mx-auto" draggable="false" />
<section class="w-fit mx-auto px-8 grid grid-cols-2 place-items-center lg:flex gap-4 sm:gap-8 justify-center [&>a]:m-auto [&>a]:sm:m-0 [&>a]:p-4 [&>a]:sm:p-8 [&>a]:lg:p-6 [&>a]:xl:p-8 [&>a]:bg-glass-sm [&>a]:flex [&>a]:gap-4 [&>a]:flex-col [&>a]:justify-end [&>a]:w-full [&>a]:xs:w-40 [&>a]:sm:w-auto [&>a]:h-auto [&>a]:sm:h-48 [&>a]:xl:h-64 [&>a]:uppercase [&>a]:aspect-square [&>a]:rounded-lg [&>a]:text-center [&>a]:text-xs [&>a]:md:text-sm [&>a]:lg:text-base [&>a:hover]:md:text-accent [&>a:hover]:md:bg-primary/80 [&>a]:transition-colors [&>a]:duration-200 [&>a>img]:my-auto [&>a>img]:sm:my-0 [&>a>img]:sm:m-auto [&>a>img]:h-3/4">
	<a href="/mags">
		<img src="/icons/mag.svg" alt="Mag Icon" draggable="false" />
		Magdonalds
	</a>
	<a href="/slabs">
		<img src="/icons/slab.svg" alt="Slab Icon" draggable="false" />
		Slab Sundays
	</a>
	<a href="/repacks">
		<img src="/icons/repack.svg" alt="Repack Icon" draggable="false" />
		GTP Repacks
	</a>
	<a href="/breaks">
		<img src="/icons/break.svg" alt="Break Icon" draggable="false" />
		Breaks With Rel
	</a>
</section>
{#each ["Hottest", "New Arrivals", "Recently Viewed"] as carousel}
	<CardProductCarousel title={carousel}>
		{#each data.products as product}
			<CardProductThumbnail id={product.id} />
		{/each}
	</CardProductCarousel>
{/each}
