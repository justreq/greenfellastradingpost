<script lang="ts">
	import { page } from "$app/state";
</script>

<header class=" w-screen h-28 py-4">
	<nav class="bg-primary rounded-xl mx-auto w-[75rem] h-full">
		<ul class="w-full h-full flex flex-row justify-evenly [&_*]:my-auto [&_a]:block [&_a]:w-full [&_a]:h-full [&_a]:uppercase">
			<li><a href="/" class:underline={page.route.id == "/"}>Home</a></li>
			<li><a href="/collections" class:underline={page.route.id?.includes("collections")}>Collections</a></li>
			<img src="/favicon.png" alt="logo" draggable="false" class="h-[80%]" />
			<li><a href="/cart" class:underline={page.route.id?.includes("cart")}>Cart (0)</a></li>
			<li><a href="/contactus" class:underline={page.route.id?.includes("contactus")}>Contact Us</a></li>
		</ul>
	</nav>
</header>
