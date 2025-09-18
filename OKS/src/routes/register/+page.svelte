<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authActions, user } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	
	// Form state
	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let phone = '';
	let agreeToTerms = false;
	let subscribeNewsletter = true;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';
	let showPassword = false;
	let showConfirmPassword = false;
	
	// Invitation handling
	let isInvitation = false;
	let invitationToken = '';
	
	// Form validation errors
	let firstNameError = '';
	let lastNameError = '';
	// Email error not needed for invite-only registration
	let passwordError = '';
	let confirmPasswordError = '';
	let phoneError = '';
	let termsError = '';
	
	// Validate email
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	// Validate phone
	function validatePhone(phone) {
		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
		return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
	}
	
	// Password strength validation
	function validatePassword(password) {
		const minLength = password.length >= 8;
		const hasUpper = /[A-Z]/.test(password);
		const hasLower = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		
		return {
			isValid: minLength && hasUpper && hasLower && hasNumber,
			minLength,
			hasUpper,
			hasLower,
			hasNumber,
			hasSpecial
		};
	}
	
	// Extract email and token from URL parameters (optional)
	onMount(() => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const emailParam = urlParams.get('email');
			const tokenParam = urlParams.get('token');
			
			if (emailParam && tokenParam) {
				email = emailParam;
				token = tokenParam;
				isInvitation = true;
			} else {
				// No invitation parameters - allow manual registration
				isInvitation = false;
			}
		}
	});


	// Handle form submission
	async function handleRegister(event) {
		event.preventDefault();
		
		// Reset errors
		firstNameError = '';
		lastNameError = '';
		// Email error not needed for invite-only registration
		passwordError = '';
		confirmPasswordError = '';
		phoneError = '';
		termsError = '';
		errorMessage = '';
		
		let hasErrors = false;
		
		// Validate inputs
		if (!firstName.trim()) {
			firstNameError = 'First name is required';
			hasErrors = true;
		}
		
		if (!lastName.trim()) {
			lastNameError = 'Last name is required';
			hasErrors = true;
		}
		
		// Email is set from invitation, no validation needed
		
		const passwordValidation = validatePassword(password);
		if (!password) {
			passwordError = 'Password is required';
			hasErrors = true;
		} else if (!passwordValidation.isValid) {
			passwordError = 'Password must be at least 8 characters with uppercase, lowercase, and number';
			hasErrors = true;
		}
		
		if (!confirmPassword) {
			confirmPasswordError = 'Please confirm your password';
			hasErrors = true;
		} else if (password !== confirmPassword) {
			confirmPasswordError = 'Passwords do not match';
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
			// Only invitation-based registration allowed
			if (!isInvitation) {
				errorMessage = 'Access denied. Registration is by invitation only.';
				return;
			}
			
			// Prepare user data
			const userData = {
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				phone: phone.trim() || null,
				subscribe_newsletter: subscribeNewsletter
			};
			
			// Use existing auth API to update user profile
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'update_user_profile',
					data: {
						email: email,
						updates: {
							password: password,
							user_metadata: userData
						}
					}
				})
			});
			
			const result = await response.json();
			
			if (!response.ok) {
				errorMessage = result.error || 'An error occurred during registration';
				return;
			}
			
			successMessage = 'Password set successfully! You can now login with your credentials.';
			
			// Redirect to login after success
			setTimeout(() => {
				goto('/login?message=password-set');
			}, 2000);
			
		} catch (error) {
			console.error('Registration error:', error);
			errorMessage = 'An unexpected error occurred during registration. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	// Toggle password visibility
	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
	
	function toggleConfirmPasswordVisibility() {
		showConfirmPassword = !showConfirmPassword;
	}
	
	// Get email and token from invitation URL parameters
	$: {
		const urlParams = new URLSearchParams($page.url.search);
		const inviteEmail = urlParams.get('email');
		const token = urlParams.get('token');
		
		if (inviteEmail && token) {
			// This is an invitation - user sets password for existing email
			email = inviteEmail;
			isInvitation = true;
			invitationToken = token;
			errorMessage = ''; // Clear any error message
		} else if (!$user) {
			// No invitation and not logged in - show error
			errorMessage = 'Access denied. Registration is by invitation only.';
		}
	}
	
	// Real-time password validation feedback
	$: passwordValidation = validatePassword(password);
</script>

<svelte:head>
	<title>Set Password - Orlando Kannada Sangha</title>
	<meta name="description" content="Set your password to complete your Orlando Kannada Sangha account setup." />
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
						<h2>Set Your Password</h2>
						<p class="register-subtitle">Complete your Orlando Kannada Sangha account setup</p>
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
									class="form-control"
									placeholder="Enter your email address"
									disabled={isLoading}
									autocomplete="email"
								/>
							</div>
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
											class="form-control {firstNameError ? 'is-invalid' : ''}"
											placeholder="First name"
											disabled={isLoading}
											autocomplete="given-name"
										/>
									</div>
									{#if firstNameError}
										<div class="invalid-feedback d-block">
											{firstNameError}
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
											class="form-control {lastNameError ? 'is-invalid' : ''}"
											placeholder="Last name"
											disabled={isLoading}
											autocomplete="family-name"
										/>
									</div>
									{#if lastNameError}
										<div class="invalid-feedback d-block">
											{lastNameError}
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
									class="form-control {phoneError ? 'is-invalid' : ''}"
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
							{/if}
							<small class="form-text text-muted">
								<i class="fas fa-info-circle me-1"></i>
								Required - for community updates and events
							</small>
						</div>
						
						<!-- Password Field -->
						<div class="form-group">
							<label for="password" class="form-label">Password *</label>
							<div class="input-group">
								<span class="input-group-text">
									<i class="fas fa-lock"></i>
								</span>
								<input
									type={showPassword ? 'text' : 'password'}
									id="password"
									bind:value={password}
									class="form-control {passwordError ? 'is-invalid' : ''}"
									placeholder="Create a secure password"
									disabled={isLoading}
									autocomplete="new-password"
								/>
								<button
									type="button"
									class="btn btn-outline-secondary password-toggle"
									on:click={togglePasswordVisibility}
									disabled={isLoading}
									aria-label="Toggle password visibility"
								>
									<i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
								</button>
							</div>
							{#if passwordError}
								<div class="invalid-feedback d-block">
									{passwordError}
								</div>
							{/if}
							
							<!-- Password Strength Indicator -->
							{#if password}
								<div class="password-strength mt-2">
									<div class="strength-bar">
										<div class="strength-fill" class:weak={!passwordValidation.isValid} class:strong={passwordValidation.isValid}></div>
									</div>
									<div class="strength-requirements">
										<div class="requirement" class:met={passwordValidation.minLength}>
											<i class="fas {passwordValidation.minLength ? 'fa-check text-success' : 'fa-times text-danger'}"></i>
											At least 8 characters
										</div>
										<div class="requirement" class:met={passwordValidation.hasUpper}>
											<i class="fas {passwordValidation.hasUpper ? 'fa-check text-success' : 'fa-times text-danger'}"></i>
											Uppercase letter
										</div>
										<div class="requirement" class:met={passwordValidation.hasLower}>
											<i class="fas {passwordValidation.hasLower ? 'fa-check text-success' : 'fa-times text-danger'}"></i>
											Lowercase letter
										</div>
										<div class="requirement" class:met={passwordValidation.hasNumber}>
											<i class="fas {passwordValidation.hasNumber ? 'fa-check text-success' : 'fa-times text-danger'}"></i>
											Number
										</div>
									</div>
								</div>
							{/if}
						</div>
						
						<!-- Confirm Password Field -->
						<div class="form-group">
							<label for="confirmPassword" class="form-label">Confirm Password *</label>
							<div class="input-group">
								<span class="input-group-text">
									<i class="fas fa-lock"></i>
								</span>
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									id="confirmPassword"
									bind:value={confirmPassword}
									class="form-control {confirmPasswordError ? 'is-invalid' : ''}"
									placeholder="Confirm your password"
									disabled={isLoading}
									autocomplete="new-password"
								/>
								<button
									type="button"
									class="btn btn-outline-secondary password-toggle"
									on:click={toggleConfirmPasswordVisibility}
									disabled={isLoading}
									aria-label="Toggle confirm password visibility"
								>
									<i class="fas {showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
								</button>
							</div>
							{#if confirmPasswordError}
								<div class="invalid-feedback d-block">
									{confirmPasswordError}
								</div>
							{/if}
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
								Create Account
							{/if}
						</button>
					</form>
					
					<!-- Login Link -->
					<div class="login-link">
						<p>Already have an account? <a href="/login">Sign in here</a></p>
					</div>
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
	
	.invalid-feedback {
		color: #dc3545;
		font-size: 14px;
		margin-top: 5px;
		display: block;
	}
	
	.password-toggle {
		border-left: none;
		color: #666;
	}
	
	.password-toggle:hover {
		color: #f26c4f;
	}
	
	.password-strength {
		margin-top: 10px;
	}
	
	.strength-bar {
		height: 4px;
		background-color: #e9ecef;
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 8px;
	}
	
	.strength-fill {
		height: 100%;
		width: 0%;
		transition: all 0.3s ease;
		background-color: #dc3545;
	}
	
	.strength-fill.weak {
		width: 25%;
		background-color: #dc3545;
	}
	
	.strength-fill.strong {
		width: 100%;
		background-color: #28a745;
	}
	
	.strength-requirements {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
		font-size: 12px;
	}
	
	.requirement {
		display: flex;
		align-items: center;
		gap: 4px;
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
		
		.strength-requirements {
			grid-template-columns: 1fr;
		}
	}
</style>