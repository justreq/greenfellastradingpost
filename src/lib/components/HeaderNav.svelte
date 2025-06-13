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
	href="/marketplace"
	class:fancy-anchor-on={page.route.id?.includes("marketplace")}
	onclick={() => {
		$globalPopupState = "none";
	}}
>
	Marketplace
</a>
<a
	href="/psa"
	class:fancy-anchor-on={page.url.pathname.includes("psa")}
	onclick={() => {
		$globalPopupState = "none";
	}}
>
	Grading
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
