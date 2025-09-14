<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import { onMount } from 'svelte';
	import { initAuth } from '$lib/stores/auth.js';
	import { page } from '$app/stores';

	let { children } = $props();

	// Initialize authentication on app startup
	onMount(() => {
		initAuth();
	});

	// Check if current page is an authentication page
	let isAuthPage = $derived($page.url.pathname === '/login' || 
	                          $page.url.pathname === '/register' || 
	                          $page.url.pathname === '/reset-password' ||
	                          $page.url.pathname === '/membership');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Bootstrap CSS -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
	<!-- Font Awesome -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<!-- Bootstrap JS -->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
</svelte:head>

{@render children?.()}
{#if !isAuthPage}
	<BackToTop />
{/if}
