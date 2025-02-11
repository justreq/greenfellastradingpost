<script>
	import FancyAnchor from "./FancyAnchor.svelte";
	import { page } from "$app/state";
</script>

<header class="h-24 py-3 border-b-2">
	<div class="flex gap-16">
		<a href="/" class="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"><img src="/favicon.png" alt="Logo" draggable="false" class="h-full" /></a>
		<FancyAnchor text="Home" route="/" on={page.route.id == "/"} />
		<FancyAnchor text="Collections" route="/collections" on={page.route.id?.includes("collections")} />
		<FancyAnchor text="Contact Us" route="/contactus" on={page.route.id?.includes("contactus")} />
	</div>
	<div class="flex gap-4">
		<FancyAnchor text="Sign Up" route="/signup" on={page.route.id?.includes("signup")} border />
		<FancyAnchor text="Log In" route="/login" on={page.route.id?.includes("login")} border />
	</div>
</header>
