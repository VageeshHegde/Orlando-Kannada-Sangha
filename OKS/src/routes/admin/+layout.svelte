<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { user, loading, getAccessToken, authActions } from '$lib/stores/auth.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import LoginNotice from '$lib/components/LoginNotice.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	let adminCheckDone = $state(false);
	let isAdmin = $state(false);

	onMount(() => {
		const runCheck = async () => {
			if (!$user) {
				adminCheckDone = true;
				return;
			}
			const token = getAccessToken();
			if (!token) {
				adminCheckDone = true;
				return;
			}
			try {
				const apiUrl = `${base}/api/auth`.replace(/\/+/g, '/');
				const res = await fetch(apiUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
					body: JSON.stringify({ action: 'check_admin' })
				});
				const data = await res.json().catch(() => ({}));
				isAdmin = res.ok && !!data.admin;
			} catch {
				isAdmin = false;
			} finally {
				adminCheckDone = true;
			}
		};

		const unsub = user.subscribe((u) => {
			if (!u) {
				adminCheckDone = true;
				isAdmin = false;
				return;
			}
			runCheck();
		});
		runCheck();
		return unsub;
	});
</script>

{#if !$user && !$loading}
	<!-- Not logged in: same notice as blog/gallery -->
	<Navbar />
	<Hero page="Admin" />
	<main class="container my-5">
		<div class="row">
			<div class="col-12">
				<PageTitle englishTitle="Admin Panel" kannadaTitle="ಆಡಳಿತ ಫಲಕ" />
			</div>
		</div>
		<LoginNotice
			heading="Member Access Required"
			paragraphs={[
				'To access the admin panel, you must be a registered member of Orlando Kannada Sangha.',
				'If you are a member, please login to continue.'
			]}
			buttons={[
				{ href: 'https://www.zeffy.com/en-US/ticketing/oks-membership--2026', text: 'Become a Member', icon: 'fas fa-user-plus', primary: true, external: true },
				{ href: '/login?redirectTo=/admin', text: 'Login', icon: 'fas fa-sign-in-alt', primary: false }
			]}
		/>
	</main>
	<Footer />
{:else if $user && adminCheckDone && !isAdmin}
	<!-- Logged in but not in admin table: same style notice -->
	<Navbar />
	<Hero page="Admin" />
	<main class="container my-5">
		<div class="row">
			<div class="col-12">
				<PageTitle englishTitle="Admin Panel" kannadaTitle="ಆಡಳಿತ ಫಲಕ" />
			</div>
		</div>
		<LoginNotice
			heading="Admin Access Required"
			paragraphs={[
				'You must be an administrator to access the admin panel.',
				'If you believe you should have access, please contact an administrator.'
			]}
			buttons={[
				{ href: `${base}/`, text: 'Go to Home', icon: 'fas fa-home', primary: true },
				{ text: 'Logout', icon: 'fas fa-sign-out-alt', primary: false, onClick: async () => { await authActions.signOut(); goto(base || '/'); } }
			]}
		/>
	</main>
	<Footer />
{:else if $user && isAdmin}
	{@render children?.()}
{:else if $loading || ($user && !adminCheckDone)}
	<!-- Loading auth or admin check -->
	<Navbar />
	<Hero page="Admin" />
	<main class="container my-5">
		<div class="row">
			<div class="col-12 text-center py-5">
				<LoadingSpinner message="Loading..." wrapperClass="text-secondary" />
			</div>
		</div>
	</main>
	<Footer />
{/if}

