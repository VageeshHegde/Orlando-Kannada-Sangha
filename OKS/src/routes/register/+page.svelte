<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	
	// Form state
	let firstName = '';
	let lastName = '';
	let email = '';
	let phone = '';
	let agreeToTerms = false;
	let subscribeNewsletter = true;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';
	let magicLinkSent = false;
	
	// Form validation errors
	let firstNameError = '';
	let lastNameError = '';
	let phoneError = '';
	let termsError = '';
	
	// Validate email
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	// Validate name
	function validateName(name) {
		const nameRegex = /^[a-zA-Z\s'-]+$/;
		return name.trim().length >= 2 && nameRegex.test(name.trim());
	}
	
	// Validate phone
	function validatePhone(phone) {
		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
		return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
	}
	
	// No password validation needed for magic link
	
	// Auto-fill email from URL parameters (for direct registration)
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const prefillEmail = urlParams.get('email');
		
		if (prefillEmail) {
			email = prefillEmail;
			errorMessage = '';
		}
	});


	// Handle form submission
	async function handleRegister(event) {
		event.preventDefault();
		
		// Reset errors
		firstNameError = '';
		lastNameError = '';
		phoneError = '';
		termsError = '';
		errorMessage = '';
		
		let hasErrors = false;
		
		// Validate inputs
		if (!firstName.trim()) {
			firstNameError = 'First name is required';
			hasErrors = true;
		} else if (!validateName(firstName)) {
			firstNameError = 'First name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes';
			hasErrors = true;
		}
		
		if (!lastName.trim()) {
			lastNameError = 'Last name is required';
			hasErrors = true;
		} else if (!validateName(lastName)) {
			lastNameError = 'Last name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes';
			hasErrors = true;
		}
		
		if (!email.trim()) {
			errorMessage = 'Email address is required';
			hasErrors = true;
		} else if (!validateEmail(email)) {
			errorMessage = 'Please enter a valid email address';
			hasErrors = true;
		}
		
		if (!phone) {
			phoneError = 'Phone number is required';
			hasErrors = true;
		} else if (!validatePhone(phone)) {
			phoneError = 'Please enter a valid phone number';
			hasErrors = true;
		}
		
		if (!agreeToTerms) {
			termsError = 'You must agree to the terms and conditions';
			hasErrors = true;
		}
		
		if (hasErrors) return;
		
		isLoading = true;
		
		try {
			// Send magic link for registration
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'magic_link',
					data: {
						email: email,
						redirectTo: '/register?success=true'
					}
				})
			});
			
			const result = await response.json();
			
			if (!response.ok) {
				errorMessage = result.error || 'Failed to send magic link. Please try again.';
				return;
			}
			
			// Show success message
			magicLinkSent = true;
			successMessage = 'Magic link sent! Check your email and click the link to complete registration.';
			
		} catch (error) {
			console.error('Registration error:', error);
			errorMessage = 'An unexpected error occurred during registration. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	// Real-time validation feedback
	$: firstNameValidation = firstName ? validateName(firstName) : null;
	$: lastNameValidation = lastName ? validateName(lastName) : null;
	$: emailValidation = email ? validateEmail(email) : null;
	$: phoneValidation = phone ? validatePhone(phone) : null;
</script>

<svelte:head>
	<title>Register - Orlando Kannada Sangha</title>
	<meta name="description" content="Create your Orlando Kannada Sangha account." />
</svelte:head>

<!-- Navigation removed for clean registration experience -->

<main class="register-container">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-8 col-lg-6">
				<div class="register-card">
					<!-- Header -->
					<div class="register-header">
						<div class="logo-container">
							<img src="/images/OKSlogo.png" alt="OKS Logo" class="register-logo" />
						</div>
						<h2>Create Account</h2>
						<p class="register-subtitle">Join the Orlando Kannada Sangha community</p>
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
					
					<!-- Registration Form -->
					{#if !magicLinkSent}
						<form on:submit={handleRegister} class="register-form">
						<!-- Email Field (invitation-only) -->
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
									class="form-control {emailValidation === false ? 'is-invalid' : emailValidation === true ? 'is-valid' : ''}"
									placeholder="Enter your email address"
									disabled={isLoading}
									autocomplete="email"
								/>
							</div>
							{#if emailValidation === true}
								<div class="valid-feedback d-block">
									<i class="fas fa-check-circle me-1"></i>
									Valid email address
								</div>
							{/if}
						</div>
						
						<!-- Name Fields -->
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label for="firstName" class="form-label">First Name *</label>
									<div class="input-group">
										<span class="input-group-text">
											<i class="fas fa-user"></i>
										</span>
										<input
											type="text"
											id="firstName"
											bind:value={firstName}
											class="form-control {firstNameError ? 'is-invalid' : firstNameValidation === true ? 'is-valid' : ''}"
											placeholder="First name"
											disabled={isLoading}
											autocomplete="given-name"
										/>
									</div>
									{#if firstNameError}
										<div class="invalid-feedback d-block">
											{firstNameError}
										</div>
									{:else if firstNameValidation === true}
										<div class="valid-feedback d-block">
											<i class="fas fa-check-circle me-1"></i>
											Valid first name
										</div>
									{/if}
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<label for="lastName" class="form-label">Last Name *</label>
									<div class="input-group">
										<span class="input-group-text">
											<i class="fas fa-user"></i>
										</span>
										<input
											type="text"
											id="lastName"
											bind:value={lastName}
											class="form-control {lastNameError ? 'is-invalid' : lastNameValidation === true ? 'is-valid' : ''}"
											placeholder="Last name"
											disabled={isLoading}
											autocomplete="family-name"
										/>
									</div>
									{#if lastNameError}
										<div class="invalid-feedback d-block">
											{lastNameError}
										</div>
									{:else if lastNameValidation === true}
										<div class="valid-feedback d-block">
											<i class="fas fa-check-circle me-1"></i>
											Valid last name
										</div>
									{/if}
								</div>
							</div>
						</div>
						
						<!-- Phone Field -->
						<div class="form-group">
							<label for="phone" class="form-label">Phone Number *</label>
							<div class="input-group">
								<span class="input-group-text">
									<i class="fas fa-phone"></i>
								</span>
								<input
									type="tel"
									id="phone"
									bind:value={phone}
									class="form-control {phoneError ? 'is-invalid' : phoneValidation === true ? 'is-valid' : ''}"
									placeholder="+1 (555) 123-4567"
									disabled={isLoading}
									autocomplete="tel"
									required
								/>
							</div>
							{#if phoneError}
								<div class="invalid-feedback d-block">
									{phoneError}
								</div>
							{:else if phoneValidation === true}
								<div class="valid-feedback d-block">
									<i class="fas fa-check-circle me-1"></i>
									Valid phone number
								</div>
							{/if}
							<small class="form-text text-muted">
								<i class="fas fa-info-circle me-1"></i>
								Required - for community updates and events
							</small>
						</div>
						
						<!-- Magic Link Info -->
						<div class="alert alert-info">
							<i class="fas fa-info-circle me-2"></i>
							<strong>No Password Required!</strong> We'll send you a magic link to complete your registration.
						</div>
						
						<!-- Terms and Conditions -->
						<div class="form-group">
							<div class="form-check">
								<input
									type="checkbox"
									id="agreeToTerms"
									bind:checked={agreeToTerms}
									class="form-check-input {termsError ? 'is-invalid' : ''}"
									disabled={isLoading}
								/>
								<label for="agreeToTerms" class="form-check-label">
									I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a> *
								</label>
							</div>
							{#if termsError}
								<div class="invalid-feedback d-block">
									{termsError}
								</div>
							{/if}
						</div>
						
						<!-- Newsletter Subscription -->
						<div class="form-group">
							<div class="form-check">
								<input
									type="checkbox"
									id="subscribeNewsletter"
									bind:checked={subscribeNewsletter}
									class="form-check-input"
									disabled={isLoading}
								/>
								<label for="subscribeNewsletter" class="form-check-label">
									Subscribe to our newsletter for updates on events and community news
								</label>
							</div>
						</div>
						
						<!-- Submit Button -->
						<button
							type="submit"
							class="btn btn-primary register-btn w-100"
							disabled={isLoading}
						>
							{#if isLoading}
								<span class="spinner-border spinner-border-sm me-2" role="status"></span>
								Processing...
							{:else}
								<i class="fas fa-user-plus me-2"></i>
								Register
							{/if}
						</button>
						</form>
					{:else}
						<!-- Magic Link Sent Success -->
						<div class="magic-link-success">
							<div class="text-center mb-4">
								<i class="fas fa-envelope-open-text fa-3x text-primary mb-3"></i>
								<h4>Check Your Email!</h4>
								<p class="text-muted">We've sent a magic link to <strong>{email}</strong></p>
								<p class="text-muted">Click the link in your email to complete your registration.</p>
							</div>
							
							<div class="d-grid gap-2">
								<button
									type="button"
									class="btn btn-outline-primary"
									on:click={() => { magicLinkSent = false; }}
									disabled={isLoading}
								>
									{#if isLoading}
										<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
										Sending...
									{:else}
										<i class="fas fa-redo me-2"></i>
										Resend Magic Link
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
					
					<!-- Login Link -->
					{#if !magicLinkSent}
						<div class="login-link">
							<p>Already have an account? <a href="/login">Sign in here</a></p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>

<!-- Footer removed for clean registration experience -->

<style>
	.register-container {
		min-height: calc(100vh - 120px);
		background: linear-gradient(to bottom, #ede1cf 0%, #f0e6d7 40%, #f5ede1 100%);
		padding: 60px 0;
		display: flex;
		align-items: center;
	}
	
	.register-card {
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

	.register-header {
		text-align: center;
		margin-bottom: 30px;
	}
	
	.logo-container {
		margin-bottom: 20px;
	}
	
	.register-logo {
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
	
	.register-header h2 {
		color: #7a1f1f;
		font-weight: bold;
		margin-bottom: 8px;
		font-size: 28px;
	}
	
	.register-subtitle {
		color: #666;
		margin-bottom: 0;
		font-size: 16px;
	}
	
	.register-form {
		margin-bottom: 30px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-label {
		color: #7a1f1f;
		font-weight: 600;
		margin-bottom: 8px;
		display: block;
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
	
	.form-control.is-invalid {
		border-color: #dc3545;
	}
	
	.form-control.is-valid {
		border-color: #28a745;
	}
	
	.form-control.is-valid:focus {
		border-color: #28a745;
		box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
	}
	
	.invalid-feedback {
		color: #dc3545;
		font-size: 14px;
		margin-top: 5px;
		display: block;
	}
	
	.valid-feedback {
		color: #28a745;
		font-size: 14px;
		margin-top: 5px;
		display: block;
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
	
	.form-check-input:checked {
		background-color: #f26c4f;
		border-color: #f26c4f;
	}
	
	.form-check-input:focus {
		border-color: #f26c4f;
		box-shadow: 0 0 0 0.2rem rgba(242, 108, 79, 0.25);
	}
	
	.register-btn {
		background: linear-gradient(135deg, #f26c4f 0%, #d4572f 100%);
		border: none;
		padding: 15px;
		font-size: 16px;
		font-weight: 600;
		border-radius: 10px;
		transition: all 0.3s ease;
	}
	
	.register-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #d4572f 0%, #b8472a 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(242, 108, 79, 0.3);
	}
	
	.register-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
	
	.login-link {
		text-align: center;
		margin-bottom: 0;
		margin-top: 30px;
	}
	
	.login-link p {
		color: #666;
		margin-bottom: 0;
		font-size: 14px;
	}
	
	.login-link a {
		color: #f26c4f;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.3s ease;
	}
	
	.login-link a:hover {
		color: #d4572f;
		text-decoration: underline;
	}
	
	.alert {
		border-radius: 10px;
		margin-bottom: 20px;
	}
	
	.alert-success {
		background-color: #d4edda;
		color: #155724;
	}
	
	.alert-danger {
		background-color: #f8d7da;
		color: #721c24;
	}
	
	.form-text {
		font-size: 12px;
		color: #6c757d;
		margin-top: 5px;
	}
	
	.spinner-border-sm {
		width: 1rem;
		height: 1rem;
	}
	
	/* Responsive Design */
	@media (max-width: 576px) {
		.register-card {
			padding: 30px 20px;
			margin: 20px;
		}
		
		.register-header h2 {
			font-size: 24px;
		}
		
	}
</style>