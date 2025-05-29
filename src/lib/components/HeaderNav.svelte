<script>
	import { page } from "$app/state";
	import { globalPopupState } from "$lib/globals";
</script>

<a
	href="/"
	class:fancy-anchor-on={page.url.pathname == "/"}
	onclick={() => {
		$globalPopupState = "none";
	}}
>
	Home
</a>
<a
	href="/collection"
	class:fancy-anchor-on={page.route.id?.includes("collection")}
	onclick={() => {
		$globalPopupState = "none";
	}}
>
	Collection
</a>
<a
	href="/services"
	class:fancy-anchor-on={page.route.id?.includes("services")}
	onclick={() => {
		$globalPopupState = "none";
	}}
>
	Services
</a>
<a
	href="/contact"
	class:fancy-anchor-on={page.route.id?.includes("contact")}
	onclick={() => {
		$globalPopupState = "none";
	}}
>
	Contact Us
</a>
