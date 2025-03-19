<script>
	import CardProductCarousel from "$lib/components/CardProductCarousel.svelte";
	import CardProductThumbnail from "$lib/components/CardProductThumbnail.svelte";
</script>

<svelte:head>
	<title>Greenfellas' Trading Post</title>
</svelte:head>

<section class="flex flex-col gap-32 [&_a]:min-w-64 [&_a]:max-w-64">
	<div class="mx-auto h-[32rem] overflow-hidden rounded-2xl">
		<img src="/banner-1.png" alt="Banner" class="h-full" draggable="false" />
	</div>
	<CardProductCarousel title="Hottest">
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
	</CardProductCarousel>
	<CardProductCarousel title="New Arrivals">
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
	</CardProductCarousel>
	<CardProductCarousel title="Recently Viewed">
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
		<CardProductThumbnail id="b9757624-b2a1-4192-967f-250a1787f5af" />
	</CardProductCarousel>
</section>
