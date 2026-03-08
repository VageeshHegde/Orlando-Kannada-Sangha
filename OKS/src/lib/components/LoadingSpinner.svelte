<script>
	/** @type {string} Optional message below the spinner (omit for icon-only). */
	export let message = 'Loading...';

	/** @type {'default' | 'small'} Size: default (block), small (e.g. QR placeholder). */
	export let size = 'default';

	/** @type {string} Optional extra class(es) for the wrapper (e.g. text-secondary). */
	export let wrapperClass = '';

	/** @type {boolean} When true, render only the spinner icon (e.g. inside buttons). */
	export let inline = false;

	/** @type {boolean} Accessibility: role="status", aria-live, aria-busy. */
	export let accessible = true;
</script>

{#if inline}
	<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
{:else}
	<div
		class="loading-state loading-state--{size} {wrapperClass}"
		role={accessible ? 'status' : undefined}
		aria-live={accessible ? 'polite' : undefined}
		aria-busy={accessible ? 'true' : undefined}
	>
		<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
		{#if message}
			<p>{message}</p>
		{/if}
	</div>
{/if}
