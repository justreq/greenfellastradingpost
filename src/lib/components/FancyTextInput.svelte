<script lang="ts">
	let { type = "text", name = "", placeholder = "", required = false, iconPath = "", value = $bindable(""), oninput = (event: Event) => {}, list = "", step = "", min = "", accept = "", className = "" } = $props();

	let showRequired: boolean = $state(required);
</script>

<div class="w-full {className} relative">
	{#if iconPath != ""}
		<img src={iconPath} alt="" draggable="false" class="absolute h-1/2 left-3 top-1/2 -translate-y-1/2" />
	{/if}
	<input
		{type}
		{name}
		id={name}
		{placeholder}
		{list}
		{step}
		{min}
		{accept}
		autocomplete="new-password"
		bind:value={
			() => {
				showRequired = required && (value == "" || value == null);
				return value;
			},
			(v) => (value = v)
		}
		oninput={(event) => oninput(event)}
		class:pl-10={iconPath != ""}
		class:pr-10={required}
		class="w-full text-xs sm:text-sm lg:text-base"
	/>
	{#if required}
		<img src="/icons/required.svg" alt="" draggable="false" class="absolute h-1/2 right-3 top-1/2 -translate-y-1/2" />
	{/if}
</div>
