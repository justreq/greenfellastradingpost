<script>
	import { page } from "$app/state";
	import ServiceLayout from "$lib/components/ServiceLayout.svelte";
</script>

<ServiceLayout type={page.data.type} />
