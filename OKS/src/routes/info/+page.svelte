<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { onMount } from 'svelte';

	// Statistics state
	let stats = {
		sponsors: 0,
		lifetimeMembers: 0,
		pastBoardMembers: 0,
		presentBoardMembers: 0,
		activeMembers: 0
	};
	let statsLoading = true;
	let statsError = '';

	// Load statistics on mount
	onMount(async () => {
		await loadStatistics();
	});

	async function loadStatistics() {
		try {
			statsLoading = true;
			statsError = '';

			// Fetch all statistics in parallel
			const [sponsorsRes, lifetimeMembersRes, pastMembersRes, presentMembersRes, activeMembersRes] = await Promise.all([
				fetch('/api/sponsors'),
				fetch('/api/lifetime-members'),
				fetch('/api/past-members'),
				fetch('/api/present-board-members'),
				fetch('/api/auth', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action: 'get_member_count' })
				})
			]);

			// Process sponsors count
			if (sponsorsRes.ok) {
				const sponsorsData = await sponsorsRes.json();
				stats.sponsors = sponsorsData.total || 0;
			} else {
				stats.sponsors = 0;
			}

			// Process lifetime members count
			if (lifetimeMembersRes.ok) {
				const lifetimeMembersData = await lifetimeMembersRes.json();
				stats.lifetimeMembers = lifetimeMembersData.total || 0;
			} else {
				stats.lifetimeMembers = 0;
			}

			// Process past board members count
			if (pastMembersRes.ok) {
				const pastMembersData = await pastMembersRes.json();
				stats.pastBoardMembers = pastMembersData.total || 0;
			} else {
				stats.pastBoardMembers = 0;
			}

			// Process present board members count
			if (presentMembersRes.ok) {
				const presentMembersData = await presentMembersRes.json();
				stats.presentBoardMembers = (presentMembersData.members || []).length;
			} else {
				stats.presentBoardMembers = 0;
			}

			// Process active members count (confirmed users from auth)
			if (activeMembersRes.ok) {
				const activeMembersData = await activeMembersRes.json();
				stats.activeMembers = activeMembersData.confirmedUsers || 0;
			} else {
				stats.activeMembers = 0;
			}

		} catch (error) {
			console.error('Error loading statistics:', error);
			statsError = 'Failed to load statistics';
		} finally {
			statsLoading = false;
		}
	}
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

	<!-- Statistics Section -->
	<div class="row mb-5">
		<div class="col-12">
			<div class="info-section">
				<h2 class="section-title">
					<i class="fas fa-chart-bar me-3"></i>
					Organization Statistics
				</h2>
				{#if statsLoading}
					<div class="text-center py-4">
						<div class="spinner-border text-primary" role="status">
							<span class="visually-hidden">Loading statistics...</span>
						</div>
					</div>
				{:else if statsError}
					<div class="text-center py-4 text-danger">
						<p>{statsError}</p>
					</div>
				{:else}
					<div class="stats-grid">
						<div class="stat-card">
							<div class="stat-icon">
								<i class="fas fa-handshake"></i>
							</div>
							<div class="stat-content">
								<div class="stat-number">{stats.sponsors}</div>
								<div class="stat-label">Sponsors</div>
							</div>
						</div>
						
						<div class="stat-card">
							<div class="stat-icon">
								<i class="fas fa-star"></i>
							</div>
							<div class="stat-content">
								<div class="stat-number">{stats.lifetimeMembers}</div>
								<div class="stat-label">Lifetime Members</div>
							</div>
						</div>
						
						<div class="stat-card">
							<div class="stat-icon">
								<i class="fas fa-history"></i>
							</div>
							<div class="stat-content">
								<div class="stat-number">{stats.pastBoardMembers}</div>
								<div class="stat-label">Past Board Members</div>
							</div>
						</div>
						
						<div class="stat-card">
							<div class="stat-icon">
								<i class="fas fa-user-tie"></i>
							</div>
							<div class="stat-content">
								<div class="stat-number">{stats.presentBoardMembers}</div>
								<div class="stat-label">Present Board Members</div>
							</div>
						</div>
						
						<div class="stat-card">
							<div class="stat-icon">
								<i class="fas fa-users"></i>
							</div>
							<div class="stat-content">
								<div class="stat-number">{stats.activeMembers}</div>
								<div class="stat-label">Active Members</div>
							</div>
						</div>
					</div>
				{/if}
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
							<h5>How do I login to the website?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p><strong>Logging In:</strong></p>
							<ol>
								<li>Click on the user icon (👤) in the navigation menu - a dropdown will appear</li>
								<li>Click "Login" from the dropdown menu - this will take you to the login page</li>
								<li>Enter your registered email address with Zeffy</li>
								<li>Click "Send Login Link" - we'll email you a secure login link (link expires in 1 hour)</li>
								<li>Check your email inbox (and spam folder) and click the login link/button to access your account</li>
							</ol>
							<p><em>Note: We use login links for secure, password-free authentication. No registration form is required!</em></p>
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
							<h5>I'm having trouble with the login link. What should I do?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>If you're having trouble with login link:</p>
							<ul>
								<li>Make sure you're using the correct registered membership email address</li>
								<li>Check your email inbox (and spam folder) for the login link</li>
								<li>Login links expire after a certain time - try requesting a new one</li>
								<li>Clear your browser cache and cookies</li>
								<li>Try using a different browser or incognito mode</li>
								<li>Contact us at suddhi@orlandokannadasangha.org if problems persist</li>
							</ul>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>How can I reach the web development team?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>To contact the web development team for technical issues or website improvements:</p>
							<ul>
								<li><strong>General Technical Issues:</strong> Contact us at suddhi@orlandokannadasangha.org</li>
								<li><strong>Website Feedback:</strong> Use the contact form or email with "Website Feedback" in the subject</li>
								<li><strong>Bug Reports:</strong> Describe the issue in detail and include screenshots if possible</li>
								<li><strong>Feature Requests:</strong> Suggest improvements or new features for the website</li>
								<li><strong>Mobile/Desktop Issues:</strong> Specify your device and browser when reporting problems</li>
							</ul>
							<p><em>Our web development team includes content segmentation, guidance & hosting, design & data collection, and core development specialists.</em></p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>I don't find the user icon. Where is it?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>If you can't find the user icon on our OKS website, try these solutions:</p>
							<ul>
								<li><strong>Look in the top navigation bar</strong> - The user icon (👤) should be visible in the main navigation menu</li>
								<li><strong>Check the header area</strong> - The user icon is typically located in the top-right corner of the website</li>
								<li><strong>Mobile users</strong> - On mobile devices, look for a hamburger menu (☰) or "Menu" button that contains the user icon</li>
								<li><strong>Scroll to the very top</strong> - Make sure you're at the top of the page where the navigation is located</li>
								<li><strong>Refresh the page</strong> - Sometimes the navigation doesn't load properly on first visit</li>
								<li><strong>Clear browser cache</strong> - Old cached content might be hiding the navigation elements</li>
								<li><strong>Try a different browser</strong> - Some browsers may have compatibility issues with our website</li>
								<li><strong>Direct access</strong> - You can go directly to <a href="/login">orlandokannadasangha.org/login</a> to access the login page</li>
							</ul>
							<p><em>If you still can't find the user icon, contact our web development team at suddhi@orlandokannadasangha.org and we'll help you access the login page.</em></p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>How can my business be featured as a sponsor on the OKS website?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>We welcome business partnerships and sponsorships to support our community activities. Here's how your business can be featured:</p>
							<ul>
								<li><strong>Contact Us</strong> - Reach out to us at suddhi@orlandokannadasangha.org with "Sponsorship Inquiry" in the subject line</li>
								<li><strong>Sponsorship Levels</strong> - We offer various sponsorship tiers with different benefits and visibility</li>
								<li><strong>Website Placement</strong> - Your business logo and information will be displayed on our sponsors page</li>
								<li><strong>Website Links</strong> - Your business website will be linked from our sponsors page for direct traffic</li>
								<li><strong>Event Recognition</strong> - Sponsors are acknowledged at our events and programs</li>
								<li><strong>Community Reach</strong> - Connect with the Kannada community in Orlando and surrounding areas</li>
								<li><strong>Support Cultural Activities</strong> - Help us preserve and promote Kannada culture and language</li>
							</ul>
							<p><em>We're always looking for businesses that align with our community values and cultural mission. Contact us to discuss sponsorship opportunities and benefits.</em></p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>I'm having trouble purchasing tickets for OKS events. What should I do?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>If you're experiencing issues with ticket purchases for OKS events, try these solutions:</p>
							<ul>
								<li><strong>Check Your Internet Connection</strong> - Ensure you have a stable internet connection</li>
								<li><strong>Clear Browser Cache</strong> - Clear your browser's cache and cookies, then try again</li>
								<li><strong>Try a Different Browser</strong> - Switch to a different browser (Chrome, Firefox, Safari, Edge)</li>
								<li><strong>Disable Browser Extensions</strong> - Temporarily disable ad blockers or other extensions</li>
								<li><strong>Check Payment Method</strong> - Verify your payment information is correct and up-to-date</li>
								<li><strong>Zeffy Server Issues</strong> - Zeffy's servers may be experiencing downtime. Try again after some time</li>
								<li><strong>Board Member Link Management</strong> - Board members may have temporarily taken down the link for maintenance or updates</li>
								<li><strong>Contact Event Organizers</strong> - Reach out to us at suddhi@orlandokannadasangha.org with "Ticket Purchase Issue" in the subject</li>
								<li><strong>Include Details</strong> - When contacting us, include your name, event name, and specific error message</li>
								<li><strong>Alternative Payment</strong> - We may be able to arrange alternative payment methods if needed</li>
							</ul>
							<p><em>We want to ensure everyone can attend our events. Don't hesitate to contact us if you need assistance with ticket purchases.</em></p>
						</div>
					</div>
					
					<div class="faq-item">
						<div class="faq-question">
							<h5>What is OKS's phone number?</h5>
							<i class="fas fa-chevron-down"></i>
						</div>
						<div class="faq-answer">
							<p>Currently, OKS does not have a dedicated phone number. We maintain our communication primarily through email to ensure privacy and proper documentation of all inquiries.</p>
							<p>For any questions, concerns, or assistance, please email us at <strong>suddhi@orlandokannadasangha.org</strong> and we will respond promptly or give you a call.</p>
							<p><em>We respect the privacy of our board members and volunteers, so individual phone numbers are not provided for general inquiries.</em></p>
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

	/* Statistics Section */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.stat-card {
		background: linear-gradient(135deg, #7a1f1f 0%, #f26c4f 100%);
		border-radius: 20px;
		padding: 2rem 1.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 1.25rem;
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		box-shadow: 0 8px 20px rgba(122, 31, 31, 0.15);
		border: 2px solid rgba(255, 255, 255, 0.1);
		position: relative;
		overflow: hidden;
	}

	.stat-card::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.stat-card:hover::before {
		opacity: 1;
	}

	.stat-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 15px 35px rgba(122, 31, 31, 0.25);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.stat-icon {
		width: 80px;
		height: 80px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border: 2px solid rgba(255, 255, 255, 0.2);
		transition: all 0.4s ease;
		position: relative;
		z-index: 1;
	}

	.stat-card:hover .stat-icon {
		transform: scale(1.1) rotate(5deg);
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.stat-icon i {
		font-size: 2.25rem;
		color: white;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.stat-content {
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.stat-number {
		font-size: 3rem;
		font-weight: 800;
		color: white;
		line-height: 1;
		margin-bottom: 0.75rem;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.stat-card:hover .stat-number {
		transform: scale(1.05);
	}

	.stat-label {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		line-height: 1.3;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
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

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.25rem;
		}

		.stat-card {
			padding: 1.75rem 1.5rem;
			gap: 1rem;
		}

		.stat-icon {
			width: 70px;
			height: 70px;
		}

		.stat-icon i {
			font-size: 1.875rem;
		}

		.stat-number {
			font-size: 2.5rem;
			margin-bottom: 0.5rem;
		}

		.stat-label {
			font-size: 0.85rem;
			letter-spacing: 0.8px;
		}
	}

	@media (max-width: 576px) {
		.stats-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.stat-card {
			padding: 1.5rem 1.25rem;
			border-radius: 15px;
		}

		.stat-icon {
			width: 65px;
			height: 65px;
		}

		.stat-icon i {
			font-size: 1.75rem;
		}

		.stat-number {
			font-size: 2.25rem;
		}

		.stat-label {
			font-size: 0.8rem;
		}
	}

	@media (min-width: 1200px) {
		.stats-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	@media (min-width: 992px) and (max-width: 1199px) {
		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
