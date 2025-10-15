<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	// Form state
	let email = '';
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';
	let magicLinkSent = false;
	
	// Form validation
	let emailError = '';
	
	// Check for registration success message
	onMount(() => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('registered') === 'true') {
				successMessage = 'Registration successful! Please check your email to verify your account, then login.';
			} else if (urlParams.get('message') === 'password-set') {
				successMessage = 'Password set successfully! You can now login with your credentials.';
			}
		}
	});
	
	// Validate email
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	// Handle magic link login
	async function handleMagicLinkLogin(event) {
		event.preventDefault();
		
		// Reset errors
		emailError = '';
		errorMessage = '';
		successMessage = '';
		
		// Validate inputs
		if (!email) {
			emailError = 'Email is required';
			return;
		}
		
		if (!validateEmail(email)) {
			emailError = 'Please enter a valid email address';
			return;
		}
		
		isLoading = true;
		
		try {
			// Send magic link
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'magic_link',
					data: {
						email: email,
						redirectTo: '/'
					}
				})
			});
			
			const result = await response.json();
			
			if (!response.ok) {
				errorMessage = result.error || 'Failed to send login link. Please try again.';
				return;
			}
			
			// Show success message
			magicLinkSent = true;
			successMessage = 'Login link sent! Check your email and click the link to login. (Link expires in 1 hour)';
			
		} catch (error) {
			console.error('Magic link error:', error);
			errorMessage = 'An unexpected error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	// Resend magic link
	async function resendMagicLink() {
		await handleMagicLinkLogin(new Event('submit'));
	}
	
</script>

<svelte:head>
	<title>Login - Orlando Kannada Sangha</title>
	<meta name="description" content="Login to your Orlando Kannada Sangha account to access member features and exclusive content." />
</svelte:head>

<!-- Navigation removed for clean login experience -->

<main class="login-container">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-6 col-lg-5">
				<div class="login-card">
					<!-- Header -->
					<div class="login-header">
						<div class="logo-container">
							<img src="/images/OKSlogo.png" alt="OKS Logo" class="login-logo" />
						</div>
						<h2>Welcome Back</h2>
						<p class="login-subtitle">Sign in to your Orlando Kannada Sangha account</p>
					</div>
					
					<!-- Back to Home Link -->
					<div class="back-to-home">
						<a href="/" class="back-link">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="m12 19-7-7 7-7"/>
								<path d="M19 12H5"/>
							</svg>
							Back to Home
						</a>
					</div>
					
					<!-- Success Message -->
					{#if successMessage}
						<div class="alert alert-success" role="alert">
							<i class="fas fa-check-circle me-2"></i>
							{successMessage}
						</div>
					{/if}
					
					<!-- Error Message -->
					{#if errorMessage}
						<div class="alert alert-danger" role="alert">
							<i class="fas fa-exclamation-circle me-2"></i>
							{errorMessage}
						</div>
					{/if}
					
					<!-- Login Link Form -->
					{#if !magicLinkSent}
						<form on:submit={handleMagicLinkLogin} class="login-form">
							<!-- Email Field -->
							<div class="form-group">
								<label for="email" class="form-label">Registered Membership Email Address:</label>
								<div class="input-group">
									<span class="input-group-text">
										<i class="fas fa-envelope"></i>
									</span>
									<input
										type="email"
										id="email"
										bind:value={email}
										class="form-control {emailError ? 'is-invalid' : ''}"
										placeholder="example@gmail.com"
										disabled={isLoading}
										autocomplete="email"
									/>
								</div>
								{#if emailError}
									<div class="invalid-feedback d-block">
										{emailError}
									</div>
								{/if}
							</div>
							
							<!-- Submit Button -->
							<button
								type="submit"
								class="btn btn-primary btn-lg w-100"
								disabled={isLoading}
							>
								{#if isLoading}
									<i class="fas fa-spinner fa-spin me-2"></i>
									Sending Login Link...
								{:else}
									<i class="fas fa-paper-plane me-2"></i>
									Send Login Link
								{/if}
							</button>
						</form>
					{:else}
						<!-- Login Link Sent Success -->
						<div class="magic-link-success">
							<div class="text-center mb-4">
								<i class="fas fa-envelope-open-text fa-3x text-primary mb-3"></i>
								<h4>Check Your Email!</h4>
								<p class="text-muted">We've sent a login link to <strong>{email}</strong></p>
								<p class="text-muted">Click the link in your email to login instantly.</p>
							</div>
							
							<div class="d-grid gap-2">
								<button
									type="button"
									class="btn btn-outline-primary"
									on:click={resendMagicLink}
									disabled={isLoading}
								>
									{#if isLoading}
										<i class="fas fa-spinner fa-spin me-2"></i>
										Sending...
									{:else}
										<i class="fas fa-redo me-2"></i>
										Resend Login Link
									{/if}
								</button>
								
								<button
									type="button"
									class="btn btn-outline-secondary"
									on:click={() => { magicLinkSent = false; email = ''; }}
								>
									<i class="fas fa-arrow-left me-2"></i>
									Use Different Email
								</button>
							</div>
						</div>
					{/if}
					
					<!-- Register Link -->
					{#if !magicLinkSent}
						<div class="register-link">
							<p>Don't have an account? <a href="/membership">Create one here</a></p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>

<!-- Footer removed for clean login experience -->

<style>
	.login-container {
		min-height: calc(100vh - 120px);
		background: linear-gradient(to bottom, #ede1cf 0%, #f0e6d7 40%, #f5ede1 100%);
		padding: 60px 0;
		display: flex;
		align-items: center;
	}
	
	.login-card {
		background: white;
		border-radius: 20px;
		padding: 40px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(242, 108, 79, 0.1);
	}
	
	.back-to-home {
		text-align: center;
		margin-bottom: 1.5rem;
	}
	
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #f26c4f;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.3s ease;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: 1px solid transparent;
	}
	
	.back-link:hover {
		color: #e55a3f;
		background-color: rgba(242, 108, 79, 0.05);
		border-color: rgba(242, 108, 79, 0.2);
		text-decoration: none;
	}
	
	.back-link svg {
		transition: transform 0.3s ease;
	}
	
	.back-link:hover svg {
		transform: translateX(-2px);
	}

	.login-header {
		text-align: center;
		margin-bottom: 30px;
	}
	
	.logo-container {
		margin-bottom: 20px;
	}
	
	.login-logo {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		border: 4px solid #f26c4f;
		padding: 10px;
		background: linear-gradient(135deg, #fff2e2 0%, #f0d9b5 100%);
		display: block;
		margin: 0 auto;
		object-fit: contain;
		object-position: center;
	}
	
	.login-header h2 {
		color: #7a1f1f;
		font-weight: bold;
		margin-bottom: 8px;
		font-size: 28px;
	}
	
	.login-subtitle {
		color: #666;
		margin-bottom: 0;
		font-size: 16px;
	}
	
	.login-form {
		margin-bottom: 30px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-label {
		color: #7a1f1f;
		font-weight: 600;
		margin-bottom: 8px;
	}
	
	.input-group-text {
		background-color: #f8f4e6;
		border-color: #ddd;
		color: #f26c4f;
	}
	
	.form-control {
		border-color: #ddd;
		padding: 12px 15px;
		font-size: 16px;
		transition: all 0.3s ease;
	}
	
	.form-control:focus {
		border-color: #f26c4f;
		box-shadow: 0 0 0 0.2rem rgba(242, 108, 79, 0.25);
	}
	
	
	.register-link {
		text-align: center;
		margin-bottom: 0;
		margin-top: 30px;
	}
	
	.register-link p {
		color: #666;
		margin-bottom: 0;
		font-size: 14px;
	}
	
	.register-link a {
		color: #f26c4f;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}
	
	.register-link a:hover {
		color: #d4572f;
		text-decoration: underline;
	}
	
	.alert {
		border-radius: 10px;
		margin-bottom: 20px;
	}
	
	
	.magic-link-success {
		text-align: center;
		padding: 20px 0;
	}
	
	.magic-link-success h4 {
		color: #7a1f1f;
		margin-bottom: 10px;
	}
	
	.magic-link-success .fa-envelope-open-text {
		color: #7a1f1f;
	}
	
		/* Responsive Design */
		@media (max-width: 576px) {
			.login-card {
				padding: 30px 20px;
				margin: 20px;
			}
			
			.login-header h2 {
				font-size: 24px;
			}
			
			/* Form options now using Bootstrap grid - responsive by default */
		}
</style>