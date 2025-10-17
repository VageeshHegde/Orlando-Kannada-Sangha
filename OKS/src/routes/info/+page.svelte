<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
</script>

<Navbar />
<Hero 
  page="Info" 
  leftImage="/images/Hampi.png"
  rightImage="/images/OKSlogo.png"
  topLeftImage="/images/Yakshagana2.png"
  bottomRightImage="/images/disney-castle-sketch.png"
/>

<!-- Info Content -->
<main class="container my-5">
	<div class="row">
		<div class="col-12">
			<PageTitle englishTitle="Information Center" kannadaTitle="ಮಾಹಿತಿ ಕೇಂದ್ರ" />
		</div>
	</div>

	<!-- Quick Info Cards -->
	<div class="row mb-5">
		<div class="col-lg-4 col-md-6 mb-4">
			<div class="info-card">
				<div class="info-icon">
					<i class="fas fa-calendar-alt"></i>
				</div>
				<h3>Events</h3>
				<p>Stay updated with our upcoming cultural events, festivals, and community gatherings throughout the year.</p>
				<a href="/events" class="info-link">View Events <i class="fas fa-arrow-right"></i></a>
			</div>
		</div>
		
		<div class="col-lg-4 col-md-6 mb-4">
			<div class="info-card">
				<div class="info-icon">
					<i class="fas fa-users"></i>
				</div>
				<h3>Membership</h3>
				<p>Join our community and become part of the Orlando Kannada Sangha family with various membership options.</p>
				<a href="/membership" class="info-link">Join Now <i class="fas fa-arrow-right"></i></a>
			</div>
		</div>
		
		<div class="col-lg-4 col-md-6 mb-4">
			<div class="info-card">
				<div class="info-icon">
					<i class="fas fa-graduation-cap"></i>
				</div>
				<h3>Kannada Kali</h3>
				<p>Learn Kannada language and culture through our structured Kannada Kali program for all ages.</p>
				<a href="/kannada-kali" class="info-link">Learn More <i class="fas fa-arrow-right"></i></a>
			</div>
		</div>
	</div>

	<!-- Membership Information -->
	<div class="row mb-5">
		<div class="col-12">
			<div class="info-section">
				<h2 class="section-title">
					<i class="fas fa-id-card me-3"></i>
					Membership Information
				</h2>
				<div class="membership-info">
					<div class="membership-fees">
						<h4>Membership Fees for 2026</h4>
						<div class="fee-list">
							<div class="fee-item">
								<span class="fee-type">Family Membership</span>
								<span class="fee-amount">$50 per Family</span>
							</div>
							<div class="fee-item">
								<span class="fee-type">Individual Membership</span>
								<span class="fee-amount">$25 per Individual</span>
							</div>
							<div class="fee-item">
								<span class="fee-type">Lifetime Membership</span>
								<span class="fee-amount">$500 per Family</span>
								<span class="fee-note">(Husband-Wife and their Kids)</span>
							</div>
						</div>
					</div>
					
					<div class="membership-benefits">
						<h4>Membership Benefits</h4>
						<ul class="benefits-list">
							<li><i class="fas fa-check-circle"></i> Discounts on all events</li>
							<li><i class="fas fa-check-circle"></i> Voting rights for the board</li>
							<li><i class="fas fa-check-circle"></i> Discounted fees for programs including Kannada Kali</li>
							<li><i class="fas fa-check-circle"></i> Admission to the Youth Conference</li>
							<li><i class="fas fa-check-circle"></i> Discounted cultural classes</li>
							<li><i class="fas fa-check-circle"></i> Online event participation</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Contact Information -->
	<div class="row mb-5">
		<div class="col-12">
			<div class="info-section">
				<h2 class="section-title">
					<i class="fas fa-envelope me-3"></i>
					Contact Information
				</h2>
				<div class="contact-info">
					<div class="contact-item">
						<div class="contact-icon">
							<i class="fas fa-envelope"></i>
						</div>
						<div class="contact-details">
							<h5>General Inquiries</h5>
							<p>suddhi@orlandokannadasangha.org</p>
						</div>
					</div>
					
					<div class="contact-item">
						<div class="contact-icon">
							<i class="fas fa-map-marker-alt"></i>
						</div>
						<div class="contact-details">
							<h5>Location</h5>
							<p>Orlando, Florida, USA</p>
						</div>
					</div>
					
					<div class="contact-item">
						<div class="contact-icon">
							<i class="fas fa-calendar"></i>
						</div>
						<div class="contact-details">
							<h5>Meeting Schedule</h5>
							<p>Regular meetings and events throughout the year</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Links -->
	<div class="row mb-5">
		<div class="col-12">
			<div class="info-section">
				<h2 class="section-title">
					<i class="fas fa-link me-3"></i>
					Quick Links
				</h2>
				<div class="quick-links">
					<div class="link-grid">
						<a href="/about" class="quick-link">
							<i class="fas fa-info-circle"></i>
							<span>About Us</span>
						</a>
						<a href="/events" class="quick-link">
							<i class="fas fa-calendar-alt"></i>
							<span>Events</span>
						</a>
						<a href="/gallery" class="quick-link">
							<i class="fas fa-images"></i>
							<span>Gallery</span>
						</a>
						<a href="/blog" class="quick-link">
							<i class="fas fa-blog"></i>
							<span>Blog</span>
						</a>
						<a href="/constitution" class="quick-link">
							<i class="fas fa-file-alt"></i>
							<span>Constitution</span>
						</a>
						<a href="/by-laws" class="quick-link">
							<i class="fas fa-gavel"></i>
							<span>By-Laws</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- FAQ Section -->
	<div class="row">
		<div class="col-12">
			<div class="info-section">
				<h2 class="section-title">
					<i class="fas fa-question-circle me-3"></i>
					Frequently Asked Questions
				</h2>
				<div class="faq-list">
					<div class="faq-item">
						<div class="faq-question">
							<h5>How do I become a member?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>You can become a member by visiting our membership page and filling out the membership form. We offer family, individual, and lifetime membership options.</p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>What events do you organize?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>We organize various cultural events including Ugadi celebrations, Rajyotsava programs, summer beach parties, Yakshagana performances, and concerts by renowned artists.</p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>Is Kannada Kali school available for children?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>Yes, we run Kannada Kali School for children under the leadership of dedicated volunteers. Students can earn bilingual credit through our program.</p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>How can I contact the board members?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>You can contact us through our general email at suddhi@orlandokannadasangha.org or visit our About page to see the current board members.</p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>How do I create an account and login?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p><strong>Creating an Account:</strong></p>
							<ol>
								<li>Click on "Register" in the navigation menu</li>
								<li>Fill out the registration form with your details</li>
								<li>Verify your email address when you receive the confirmation email</li>
								<li>Your account will be activated after email verification</li>
							</ol>
							<p><strong>Logging In:</strong></p>
							<ol>
								<li>Click on "Login" in the navigation menu</li>
								<li>Enter your email address and password</li>
								<li>Click "Sign In" to access your account</li>
								<li>If you forgot your password, use the "Forgot Password" link</li>
							</ol>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>What can I do after logging in?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>After logging in, you can:</p>
							<ul>
								<li>Access member-only content and resources</li>
								<li>Register for events with member discounts</li>
								<li>Participate in community discussions</li>
								<li>Update your profile information</li>
								<li>View your membership status and benefits</li>
								<li>Access exclusive member events and programs</li>
							</ul>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>I'm having trouble logging in. What should I do?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>If you're having trouble logging in:</p>
							<ul>
								<li>Make sure you're using the correct email address</li>
								<li>Check that your password is entered correctly (case-sensitive)</li>
								<li>Try using the "Forgot Password" feature to reset your password</li>
								<li>Ensure your email has been verified (check your inbox for verification email)</li>
								<li>Clear your browser cache and cookies</li>
								<li>Contact us at suddhi@orlandokannadasangha.org if problems persist</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />

<style>
	/* Info Cards */
	.info-card {
		background: #fff;
		border-radius: 20px;
		padding: 2rem;
		text-align: center;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		height: 100%;
		border: 2px solid #f8a07a;
	}

	.info-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
		border-color: #7a1f1f;
	}

	.info-icon {
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, #7a1f1f, #f26c4f);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.5rem;
		transition: all 0.3s ease;
	}

	.info-card:hover .info-icon {
		transform: scale(1.1);
	}

	.info-icon i {
		font-size: 2rem;
		color: white;
	}

	.info-card h3 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #7a1f1f;
		margin-bottom: 1rem;
	}

	.info-card p {
		color: #666;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.info-link {
		color: #7a1f1f;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.info-link:hover {
		color: #f26c4f;
		transform: translateX(5px);
	}

	/* Info Sections */
	.info-section {
		background: #fff;
		border-radius: 20px;
		padding: 2.5rem;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
		border: 2px solid #f8a07a;
	}

	.section-title {
		font-size: 2rem;
		font-weight: 700;
		color: #7a1f1f;
		margin-bottom: 2rem;
		display: flex;
		align-items: center;
	}

	.section-title i {
		color: #f26c4f;
	}

	/* Membership Information */
	.membership-info {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
	}

	.membership-fees h4,
	.membership-benefits h4 {
		font-size: 1.3rem;
		font-weight: 600;
		color: #7a1f1f;
		margin-bottom: 1.5rem;
	}

	.fee-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.fee-item {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 10px;
		border-left: 4px solid #7a1f1f;
	}

	.fee-type {
		font-weight: 600;
		color: #7a1f1f;
		margin-bottom: 0.5rem;
	}

	.fee-amount {
		font-size: 1.2rem;
		font-weight: 700;
		color: #f26c4f;
	}

	.fee-note {
		font-size: 0.9rem;
		color: #666;
		font-style: italic;
		margin-top: 0.25rem;
	}

	.benefits-list {
		list-style: none;
		padding: 0;
	}

	.benefits-list li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid #eee;
	}

	.benefits-list li:last-child {
		border-bottom: none;
	}

	.benefits-list i {
		color: #28a745;
		font-size: 1.1rem;
	}

	/* Contact Information */
	.contact-info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 15px;
		transition: all 0.3s ease;
	}

	.contact-item:hover {
		background: #e9ecef;
		transform: translateY(-2px);
	}

	.contact-icon {
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #7a1f1f, #f26c4f);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.contact-icon i {
		font-size: 1.5rem;
		color: white;
	}

	.contact-details h5 {
		font-weight: 600;
		color: #7a1f1f;
		margin-bottom: 0.5rem;
	}

	.contact-details p {
		color: #666;
		margin: 0;
	}

	/* Quick Links */
	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.quick-link {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 15px;
		text-decoration: none;
		color: #7a1f1f;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.quick-link:hover {
		background: #e9ecef;
		border-color: #7a1f1f;
		transform: translateY(-2px);
		color: #7a1f1f;
	}

	.quick-link i {
		font-size: 1.5rem;
		color: #f26c4f;
	}

	.quick-link span {
		font-weight: 600;
	}

	/* FAQ Section */
	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.faq-item {
		background: #f8f9fa;
		border-radius: 15px;
		overflow: hidden;
		border: 2px solid #e9ecef;
		transition: all 0.3s ease;
	}

	.faq-item:hover {
		border-color: #7a1f1f;
	}

	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		cursor: pointer;
		background: #fff;
		transition: all 0.3s ease;
	}

	.faq-question:hover {
		background: #f8f9fa;
	}

	.faq-question h5 {
		font-weight: 600;
		color: #7a1f1f;
		margin: 0;
	}

	.faq-question i {
		color: #7a1f1f;
		transition: transform 0.3s ease;
	}

	.faq-answer {
		padding: 0 1.5rem 1.5rem;
		background: #fff;
	}

	.faq-answer p {
		color: #666;
		line-height: 1.6;
		margin: 0 0 1rem 0;
	}

	.faq-answer ol,
	.faq-answer ul {
		color: #666;
		line-height: 1.6;
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.faq-answer ol li,
	.faq-answer ul li {
		margin-bottom: 0.5rem;
	}

	.faq-answer strong {
		color: #7a1f1f;
		font-weight: 600;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.membership-info {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.contact-info {
			grid-template-columns: 1fr;
		}

		.link-grid {
			grid-template-columns: 1fr;
		}

		.section-title {
			font-size: 1.5rem;
		}

		.info-section {
			padding: 1.5rem;
		}
	}
</style>
