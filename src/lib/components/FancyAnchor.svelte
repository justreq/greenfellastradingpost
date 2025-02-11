<script lang="ts">
	export let text: string = "";
	export let route: string = "/";
	export let newTab: boolean = false;
	export let on: boolean = false;
	export let border: boolean = false;

	let stylesOff = "font-normal hover:text-accent2";
	let stylesOn = "bg-text text-bg font-extrabold hover:bg-accent2";
</script>

<a href={route} target={newTab ? "_blank" : ""} class="px-2 py-1 my-auto border-[3px] rounded-lg uppercase duration-200 transition-colors hover:border-accent2 {on ? stylesOn : stylesOff} {border ? 'border-text' : 'border-transparent'}">
	{text}
</a>
