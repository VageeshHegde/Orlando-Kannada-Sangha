<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import { onMount } from 'svelte';
	import { initAuth } from '$lib/stores/auth.js';
	import { page } from '$app/stores';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	let { children } = $props();

	// Initialize authentication on app startup
	onMount(() => {
		initAuth();
		injectAnalytics();
	});

	// Check if current page is an authentication page
	let isAuthPage = $derived($page.url.pathname === '/login' || 
	                          $page.url.pathname === '/register' || 
	                          $page.url.pathname === '/reset-password' ||
	                          $page.url.pathname === '/membership');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3759243030321573"
	     crossorigin="anonymous"></script>
</svelte:head>

{@render children?.()}
{#if !isAuthPage}
	<BackToTop />
	<!-- <Chat 
		chatTitle="OKS Assistant"
		placeholder="Ask me anything about OKS..."
	/> -->
{/if}
