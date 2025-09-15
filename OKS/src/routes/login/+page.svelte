<script>
	import { goto } from '$app/navigation';
	import { authActions } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	
	// Form state
	let email = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';
	let showPassword = false;
	
	// Form validation
	let emailError = '';
	let passwordError = '';
	
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
	
	// Handle form submission
	async function handleLogin(event) {
		event.preventDefault();
		
		// Reset errors
		emailError = '';
		passwordError = '';
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
		
		if (!password) {
			passwordError = 'Password is required';
			return;
		}
		
		if (password.length < 6) {
			passwordError = 'Password must be at least 6 characters long';
			return;
		}
		
		isLoading = true;
		
		try {
			// Use Supabase authentication
			const { data, error } = await authActions.signIn(email, password);
			
			if (error) {
				// Handle specific Supabase errors
				if (error.message.includes('Invalid login credentials')) {
					errorMessage = 'Invalid email or password. Please check your credentials and try again.';
				} else if (error.message.includes('Email not confirmed')) {
					errorMessage = 'Please check your email and click the confirmation link before signing in.';
				} else if (error.message.includes('Too many requests')) {
					errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
				} else {
					errorMessage = error.message || 'Login failed. Please try again.';
				}
				return;
			}
			
			if (data?.user) {
				// Show success message for all users
				successMessage = 'Login successful! Redirecting...';
				setTimeout(() => {
					goto('/');
				}, 1000);
			}
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = 'An unexpected error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	// Handle forgot password
	async function handleForgotPassword() {
		if (!email) {
			emailError = 'Please enter your email address first';
			return;
		}
		
		if (!validateEmail(email)) {
			emailError = 'Please enter a valid email address';
			return;
		}
		
		try {
			const { error } = await authActions.resetPassword(email);
			
			if (error) {
				errorMessage = error.message || 'Failed to send reset email. Please try again.';
			} else {
				successMessage = 'Password reset email sent! Check your inbox.';
			}
		} catch (error) {
			console.error('Password reset error:', error);
			errorMessage = 'Failed to send reset email. Please try again.';
		}
	}
	
	// Toggle password visibility
	function togglePasswordVisibility() {
		showPassword = !showPassword;
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
					
					<!-- Login Form -->
					<form on:submit={handleLogin} class="login-form">
						<!-- Email Field -->
						<div class="form-group">
							<label for="email" class="form-label">Email Address</label>
							<div class="input-group">
								<span class="input-group-text">
									<i class="fas fa-envelope"></i>
								</span>
								<input
									type="email"
									id="email"
									bind:value={email}
									class="form-control {emailError ? 'is-invalid' : ''}"
									placeholder="Enter your email"
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
						
						<!-- Password Field -->
						<div class="form-group">
							<label for="password" class="form-label">Password</label>
							<div class="input-group">
								<span class="input-group-text">
									<i class="fas fa-lock"></i>
								</span>
								<input
									type={showPassword ? 'text' : 'password'}
									id="password"
									bind:value={password}
									class="form-control {passwordError ? 'is-invalid' : ''}"
									placeholder="Enter your password"
									disabled={isLoading}
									autocomplete="current-password"
								/>
								<button
									type="button"
									class="btn btn-outline-secondary password-toggle"
									on:click={togglePasswordVisibility}
									disabled={isLoading}
								>
									<i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
								</button>
							</div>
							{#if passwordError}
								<div class="invalid-feedback d-block">
									{passwordError}
								</div>
							{/if}
						</div>
						
						<!-- Remember Me & Forgot Password Row -->
						<div class="row align-items-center mb-3">
							<div class="col-6">
								<div class="form-check">
									<input
										type="checkbox"
										id="rememberMe"
										bind:checked={rememberMe}
										class="form-check-input"
										disabled={isLoading}
									/>
									<label for="rememberMe" class="form-check-label">
										Remember me
									</label>
								</div>
							</div>
							<div class="col-6 text-end">
								<a href="#" class="forgot-password-link" on:click|preventDefault={handleForgotPassword}>
									Forgot password?
								</a>
							</div>
						</div>
						
						<!-- Login Button -->
						<button
							type="submit"
							class="btn btn-primary login-btn w-100"
							disabled={isLoading}
						>
							{#if isLoading}
								<span class="spinner-border spinner-border-sm me-2" role="status"></span>
								Signing in...
							{:else}
								<i class="fas fa-sign-in-alt me-2"></i>
								Sign In
							{/if}
						</button>
					</form>
					
					
					<!-- Register Link -->
					<div class="register-link">
						<p>Don't have an account? <a href="/membership">Create one here</a></p>
					</div>
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
	
	.password-toggle {
		border-left: none;
		color: #666;
	}
	
	.password-toggle:hover {
		color: #f26c4f;
	}
	
	/* Form options now using Bootstrap grid - no custom CSS needed */
	
	.form-check-label {
		color: #666;
		font-size: 14px;
	}
	
	.forgot-password-link {
		color: #f26c4f;
		text-decoration: none;
		font-size: 14px;
		transition: color 0.3s ease;
	}
	
	.forgot-password-link:hover {
		color: #d4572f;
		text-decoration: underline;
	}
	
	.login-btn {
		background: linear-gradient(135deg, #f26c4f 0%, #d4572f 100%);
		border: none;
		padding: 15px;
		font-size: 16px;
		font-weight: 600;
		border-radius: 10px;
		transition: all 0.3s ease;
	}
	
	.login-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #d4572f 0%, #b8472a 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(242, 108, 79, 0.3);
	}
	
	.login-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
	
	.forgot-password-link {
		text-align: center;
		margin-top: 1rem;
	}

	.forgot-password-link p {
		margin: 0;
		font-size: 0.9rem;
	}

	.forgot-password-link a {
		color: #f26c4f;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.forgot-password-link a:hover {
		color: #e55a3f;
		text-decoration: underline;
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
	
	.spinner-border-sm {
		width: 1rem;
		height: 1rem;
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