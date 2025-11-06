<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase.js';
	
	// QR Code image from S3
	let qrCodeImage = '';
	let qrCodeLoaded = false;
	
	// Function to load QR code image from S3
	async function loadQRCodeImage() {
		try {
			const { data: signedUrlData, error: signedUrlError } = await supabase.storage
				.from('OKS')
				.createSignedUrl('qr-codes/MembershipQR.png', 3600); // 1 hour expiration
			
			if (signedUrlError) {
				// Fallback to local image
				qrCodeImage = '/images/MembershipQR.png';
			} else {
				qrCodeImage = signedUrlData.signedUrl;
			}
		} catch (error) {
			// Fallback to local image
			qrCodeImage = '/images/MembershipQR.png';
		} finally {
			qrCodeLoaded = true;
		}
	}
	
	onMount(() => {
		loadQRCodeImage();
	});
</script>

<svelte:head>
	<title>Membership - Orlando Kannada Sangha</title>
	<meta name="description" content="Join the Orlando Kannada Sangha community. Become a member to connect with fellow Kannadigas and participate in cultural events." />
</svelte:head>

<!-- Navigation removed for clean membership experience -->

<main class="membership-container">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-8 col-lg-6">
				<div class="membership-card">
					<!-- Header -->
					<div class="membership-header">
						<div class="logo-container">
							<img src="/images/OKSlogo.png" alt="OKS Logo" class="membership-logo" />
						</div>
						<h2>Register to Join</h2>
						<p class="membership-subtitle">Become a member of the Orlando Kannada Sangha community</p>
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
					
					<!-- Membership Information -->
					<div class="membership-form">
						<div class="form-group text-center">
							<div class="alert alert-warning" role="alert">
								<i class="fas fa-info-circle me-2"></i>
								<strong>Welcome to Orlando Kannada Sangha! 🎉</strong>
								<br>
								If you're in Orlando or nearby and would like to join our vibrant community, please select a membership plan using the payment options below. We look forward to welcoming you to the Orlando Kannada Sangha!
							</div>
						</div>
						
						<div class="form-group text-center">
							<label class="form-label">Payment Options</label>
							<div class="row">
								<div class="col-md-6">
									<div class="payment-option">
										<h5><i class="fas fa-link me-2"></i>Payment Link</h5>
										<a href="https://www.zeffy.com/en-US/ticketing/oks-membership--2026" target="_blank" class="payment-btn">
											<i class="fas fa-credit-card"></i>
											<span>Payment<br>Link</span>
										</a>
									</div>
								</div>
								<div class="col-md-6">
									<div class="payment-option">
										<h5><i class="fas fa-qrcode me-2"></i>QR Code</h5>
										<div class="qr-placeholder">
											{#if qrCodeLoaded && qrCodeImage}
												<img src={qrCodeImage} alt="Membership Payment QR Code" style="width: 100%; max-width: 100px; height: auto;">
											{:else}
												<div class="qr-loading">
													<i class="fas fa-spinner fa-spin"></i>
													<p>Loading QR Code...</p>
												</div>
											{/if}
											<p class="qr-text">Scan to pay</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<!-- Login Link -->
					<div class="login-link">
						<p>Already a member? <a href="/login">Sign in here</a></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.membership-container {
		background: linear-gradient(to bottom, #ede1cf 0%, #f0e6d7 40%, #f5ede1 100%);
		padding: 60px 0;
		display: flex;
		align-items: center;
	}
	
	.membership-card {
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

	.membership-header {
		text-align: center;
		margin-bottom: 30px;
	}
	
	.logo-container {
		margin-bottom: 20px;
	}
	
	.membership-logo {
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
	
	.membership-header h2 {
		color: #7a1f1f;
		font-weight: bold;
		margin-bottom: 8px;
		font-size: 28px;
	}
	
	.membership-subtitle {
		color: #666;
		margin-bottom: 0;
		font-size: 16px;
	}
	
	.membership-form {
		margin-bottom: 30px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-label {
		color: #7a1f1f;
		font-weight: 600;
		margin-bottom: 8px;
		text-align: center;
	}
	
	
	.payment-option {
		text-align: center;
		padding: 15px;
		background-color: #f8f4e6;
		border: 1px solid #ddd;
		border-radius: 10px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.payment-option h5 {
		color: #7a1f1f;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 15px;
	}
	
	.payment-btn {
		background: linear-gradient(135deg, #f26c4f 0%, #d4572f 100%);
		border: none;
		padding: 1rem;
		font-size: 1rem;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		color: white;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		width: 100%;
		flex: 1;
		border-radius: 8px;
		font-weight: 600;
	}
	
	.payment-btn:hover {
		background: linear-gradient(135deg, #d4572f 0%, #b8472a 100%);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(242, 108, 79, 0.3);
		color: white;
		text-decoration: none;
	}
	
	.payment-btn i {
		color: #fff;
		font-size: 1.5rem;
		margin: 0;
	}
	
	/* QR Code Loading State */
	.qr-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		color: #7a1f1f;
		text-align: center;
	}
	
	.qr-loading i {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		animation: spin 1s linear infinite;
	}
	
	.qr-loading p {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 500;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	
	.qr-text {
		color: #666;
		font-size: 12px;
		margin-bottom: 0;
		text-align: center;
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
	
	/* Responsive Design */
	@media (max-width: 576px) {
		.membership-card {
			padding: 30px 20px;
			margin: 20px;
		}
		
		.membership-header h2 {
			font-size: 24px;
		}
	}
</style>