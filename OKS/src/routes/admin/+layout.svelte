<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { user, loading, getAccessToken } from '$lib/stores/auth.js';

	let isAdmin = $state(false);
	let adminCheckLoading = $state(true);
	let checkedUserId = null;
	let adminError = $state(''); // e.g. 404, or "not in admin list"

	// Require login, then verify user is in admin_users table (client-side)
	$effect(() => {
		if (typeof window === 'undefined') return;
		if ($loading) return;
		if (!$user) {
			isAdmin = false;
			adminCheckLoading = false;
			adminError = '';
			checkedUserId = null;
			goto('/login?redirectTo=/admin', { replaceState: true });
			return;
		}
		if (checkedUserId === $user.id) return;
		checkedUserId = $user.id;
		adminCheckLoading = true;
		adminError = '';
		(async () => {
			const token = getAccessToken();
			if (!token) {
				isAdmin = false;
				adminCheckLoading = false;
				goto('/login?redirectTo=/admin', { replaceState: true });
				return;
			}
			const apiUrl = `${base}/api/auth`.replace(/\/+/g, '/');
			try {
				const res = await fetch(apiUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({ action: 'check_admin' })
				});
				const data = await res.json().catch(() => ({}));
				if (res.ok && data.admin) {
					isAdmin = true;
					adminError = '';
				} else {
					isAdmin = false;
					if (res.status === 404) adminError = 'Admin API not found (404). Check base path and deployment.';
					else if (res.status === 401) goto('/login?redirectTo=/admin', { replaceState: true });
					else if (res.status === 403) adminError = 'You are not in the admin list. Add your user ID to the admin_users table in Supabase.';
					else goto('/', { replaceState: true });
				}
			} catch (e) {
				isAdmin = false;
				adminError = e?.message || 'Could not reach admin check.';
			} finally {
				adminCheckLoading = false;
			}
		})();
	});
</script>

{#if $loading || adminCheckLoading}
	<div class="admin-loading">
		<i class="fas fa-spinner fa-spin"></i>
		<p>Checking access...</p>
	</div>
{:else if $user && isAdmin}
	{@render children?.()}
{:else if adminError}
	<div class="admin-loading admin-error">
		<i class="fas fa-exclamation-triangle"></i>
		<p>{adminError}</p>
		<a href="{base}/">Go to home</a>
	</div>
{:else}
	<div class="admin-loading">
		<p>Redirecting...</p>
	</div>
{/if}

<style>
	.admin-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		gap: 1rem;
		color: var(--bs-secondary, #6c757d);
	}
	.admin-loading i {
		font-size: 2rem;
	}
	.admin-error {
		color: var(--bs-danger, #dc3545);
	}
	.admin-error a {
		color: var(--bs-primary, #0d6efd);
	}
</style>
