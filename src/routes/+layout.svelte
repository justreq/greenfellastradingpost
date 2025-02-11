<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	let { children, data } = $props();
	console.log(data);
</script>

<Header></Header>
{@render children()}
<Footer></Footer>
