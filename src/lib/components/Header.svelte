<script>
	import { page } from "$app/state";
</script>

<header class="sticky top-0 h-24 py-3 border-b-2 [&_a:not(:has(*))]:self-center">
	<div class="flex gap-16">
		<a href="/" class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"><img src="/favicon.png" alt="Logo" draggable="false" class="h-full" /></a>
		<a href="/" data-on={page.route.id == "/"} class="fancy-anchor">Home</a>
		<a href="/collections" data-on={page.route.id?.includes("collections")}>Collections</a>
		<a href="/contactus" data-on={page.route.id?.includes("contactus")}>Contact Us</a>
	</div>
	<div class="flex gap-4">
		<a href="/signup" data-on={page.route.id?.includes("signup")} data-border="true">Sign Up</a>
		<a href="/login" data-on={page.route.id?.includes("login")} data-border="true">Log In</a>
	</div>
</header>
