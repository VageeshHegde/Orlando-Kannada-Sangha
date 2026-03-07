<script>
	/** @type {string} */
	export let heading = 'Member Access Required';
	/** @type {string[]} */
	export let paragraphs = [];
	/**
	 * @type {{ href?: string; text: string; icon: string; primary?: boolean; external?: boolean; onClick?: () => void | Promise<void> }[]}
	 */
	export let buttons = [];
</script>

<div class="login-notice">
	<div class="alert" role="alert">
		<div class="alert-heading">
			<i class="fas fa-lock" aria-hidden="true"></i>
			<h2>{heading}</h2>
		</div>
		{#each paragraphs as p}
			<p>{p}</p>
		{/each}
		<div class="alert-buttons">
			{#each buttons as btn}
				{#if btn.onClick}
					<button
						type="button"
						class="btn {btn.primary ? 'btn-primary' : 'btn-outline-primary'}"
						on:click={btn.onClick}
					>
						<i class="{btn.icon}" aria-hidden="true"></i>
						{btn.text}
					</button>
				{:else}
					<a
						href={btn.href ?? '#'}
						class="btn {btn.primary ? 'btn-primary' : 'btn-outline-primary'}"
						target={btn.external ? '_blank' : undefined}
						rel={btn.external ? 'noopener noreferrer' : undefined}
					>
						<i class="{btn.icon}" aria-hidden="true"></i>
						{btn.text}
					</a>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.login-notice {
		margin-bottom: 5rem;
	}

	.alert {
		background-color: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: 8px;
		color: #4c2e2e;
		padding: 1.5rem;
	}

	.alert-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.alert-heading i {
		color: #7a1f1f;
		font-size: 1.25rem;
	}

	.alert-heading h2 {
		color: #7a1f1f;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}

	.alert p {
		margin-bottom: 0.5rem;
	}

	.alert p:last-of-type {
		margin-bottom: 1rem;
	}

	.alert-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.alert-buttons .btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.alert-buttons .btn-primary {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
	}

	.alert-buttons .btn-primary:hover {
		background-color: #5a1717;
		border-color: #5a1717;
	}

	.alert-buttons .btn-outline-primary {
		color: #7a1f1f;
		border-color: #7a1f1f;
	}

	.alert-buttons .btn-outline-primary:hover {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
		color: #fff;
	}
</style>
