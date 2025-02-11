<script>
	import FancyAnchor from "./FancyAnchor.svelte";
</script>

<footer class="bottom-0 h-16 py-3 border-t-2">
	<p class="h-min my-auto">© Greenfellas Trading Post Inc. {new Date().getFullYear()}</p>
	<div class="flex gap-4 [&>*]:h-full [&>*]:aspect-square [&>*]:bg-tertiary/80 [&>*]:rounded-md [&>*]:transition-transform [&>*]:duration-200 [&>*:hover]:scale-110">
		<a href="https://www.whatnot.com/user/greenfellastradingpost" target="_blank"><img src="/icons/whatnot.svg" alt="Whatnot Link" /></a>
		<a href="https://www.instagram.com/greenfellastradingpost" target="_blank"><img src="/icons/instagram.svg" alt="Instagram Link" /></a>
		<a href="https://discord.gg/ynJfDJxfZq" target="_blank"><img src="/icons/discord.svg" alt="Discord Link" /></a>
	</div>
</footer>
