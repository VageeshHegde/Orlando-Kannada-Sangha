<script>
	/**
	 * Reusable "access required" notice (same style as blog/gallery).
	 * @type {string} heading - e.g. "Member Access Required" or "Admin Access Required"
	 * @type {string[]} paragraphs - body lines
	 * @type {{ href: string, text: string, icon: string, primary?: boolean, external?: boolean }[]} buttons
	 */
	let { heading = 'Member Access Required', paragraphs = [], buttons = [] } = $props();
</script>

<div class="login-notice mb-4">
	<div class="alert alert-warning" role="alert">
		<div class="d-flex align-items-center">
			<i class="fas fa-lock me-3" aria-hidden="true"></i>
			<div class="flex-grow-1">
				<h5 class="alert-heading mb-2">{heading}</h5>
				{#each paragraphs as p}
					<p class="mb-3">{p}</p>
				{/each}
				<div class="d-flex gap-2">
					{#each buttons as btn}
						{#if btn.onClick}
							<button
								type="button"
								class={btn.primary ? 'btn btn-primary' : 'btn btn-outline-primary'}
								onclick={btn.onClick}
							>
								<i class="{btn.icon} me-2" aria-hidden="true"></i>{btn.text}
							</button>
						{:else}
							<a
								href={btn.href}
								class={btn.primary ? 'btn btn-primary' : 'btn btn-outline-primary'}
								target={btn.external ? '_blank' : undefined}
								rel={btn.external ? 'noopener noreferrer' : undefined}
								aria-label={btn.external ? btn.text + ' - opens in new window' : undefined}
							>
								<i class="{btn.icon} me-2" aria-hidden="true"></i>{btn.text}
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.login-notice :global(.alert) {
		border: 2px solid #ffc107;
		border-radius: 12px;
		background: linear-gradient(135deg, #fff3cd, #ffeaa7);
		box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
	}
	.login-notice :global(.alert-heading) {
		color: #856404;
		font-weight: 600;
		font-size: 1.2rem;
	}
	.login-notice :global(.alert p) {
		color: #856404;
		font-size: 1rem;
		margin-bottom: 0;
	}
	.login-notice :global(.btn-primary) {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		transition: all 0.3s ease;
	}
	.login-notice :global(.btn-primary:hover) {
		background-color: #5a1515;
		border-color: #5a1515;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
	}
	.login-notice :global(.btn-outline-primary) {
		color: #7a1f1f;
		border-color: #7a1f1f;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		transition: all 0.3s ease;
	}
	.login-notice :global(.btn-outline-primary:hover) {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
	}
	.login-notice :global(i.fa-lock) {
		font-size: 2rem;
		color: #856404;
	}
</style>
