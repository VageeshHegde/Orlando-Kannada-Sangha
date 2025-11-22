<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	// Event data
	const upcomingEvents = [
		{
			title: 'Ugadi Celebration 2024',
			date: 'March 9, 2024',
			description: 'Join us for our annual Ugadi celebration featuring traditional rituals, cultural performances, and delicious Kannada cuisine. This is our biggest event of the year celebrating the Kannada New Year.',
			time: '5:00 PM - 10:00 PM',
			location: 'Community Center, Orlando',
			audience: 'Open to all community members',
			highlights: [
				'Traditional Ugadi Puja',
				'Cultural dance performances',
				'Kannada music and songs',
				'Traditional food and sweets',
				'Children\'s cultural activities'
			],
			highlightsTitle: 'Highlights:',
			icon: 'fas fa-calendar-alt',
			image: null // Add actual image URL here when available
		},
		{
			title: 'Kannada Kali Annual Day',
			date: 'May 15, 2024',
			description: 'Annual celebration showcasing the achievements of our Kannada Kali students. Students will perform skits, songs, and demonstrate their language skills learned throughout the year.',
			time: '3:00 PM - 6:00 PM',
			location: 'Online via Zoom',
			audience: 'Open to students and families',
			highlights: [
				'Student performances',
				'Language competitions',
				'Cultural presentations',
				'Awards ceremony',
				'Cultural activities'
			],
			highlightsTitle: 'Program:',
			icon: 'fas fa-graduation-cap',
			image: null // Add actual image URL here when available
		},
		{
			title: 'Kannada Cultural Night',
			date: 'July 20, 2024',
			description: 'A special evening dedicated to Kannada music, dance, and cultural performances. Featuring local artists and community members showcasing the rich cultural heritage of Karnataka.',
			time: '6:30 PM - 9:30 PM',
			location: 'Cultural Hall, Orlando',
			audience: 'Open to all community members',
			highlights: [
				'Classical dance performances',
				'Folk music and songs',
				'Poetry recitation',
				'Traditional instruments',
				'Cultural fashion show'
			],
			highlightsTitle: 'Performances:',
			icon: 'fas fa-music',
			image: null // Add actual image URL here when available
		}
	];
</script>

<svelte:head>
	<title>Events - Orlando Kannada Sangha</title>
	<meta name="description" content="View upcoming events, cultural programs, and community gatherings organized by Orlando Kannada Sangha." />
	<meta name="keywords" content="Orlando Kannada Sangha events, OKS cultural programs, Kannada community events, Ugadi celebration, cultural performances, community gatherings, Orlando Indian events" />
</svelte:head>

<Navbar />
<Hero 
  page="Events" 
  leftImage="/images/Karnataka.png"
  rightImage="/images/Yakshagana.png"
  topLeftImage="/images/NASA.svg"
  bottomRightImage="/images/Universal-Logo.png"
/>

<!-- Events Content -->
<main class="container my-5">
	<div class="row">
		<div class="col-12">
			<PageTitle englishTitle="Events" kannadaTitle="ಕಾರ್ಯಕ್ರಮಗಳು" />
			<div class="row">
				<div class="col-md-8">

					<h3>Upcoming Events</h3>
					<div class="events-section">
						{#each upcomingEvents as event}
							<EventCard {event} />
						{/each}
					</div>

					<h3>Regular Events</h3>
					<div class="regular-events">
						<div class="event-item">
							<h4><i class="fas fa-book me-2"></i>Kannada Kali Classes</h4>
							<p>Every Sunday, 10:00 <abbr title="Ante Meridiem">AM</abbr> - 12:00 <abbr title="Post Meridiem">PM</abbr></p>
							<p>Online via Google Meet</p>
						</div>
						
						<div class="event-item">
							<h4><i class="fas fa-users me-2"></i>Community Meetings</h4>
							<p>First Saturday of every month, 2:00 <abbr title="Post Meridiem">PM</abbr> - 4:00 <abbr title="Post Meridiem">PM</abbr></p>
							<p>Community Center, Orlando</p>
						</div>
						
						<div class="event-item">
							<h4><i class="fas fa-pray me-2"></i>Bhajan Sessions</h4>
							<p>Every Friday, 7:00 <abbr title="Post Meridiem">PM</abbr> - 8:30 <abbr title="Post Meridiem">PM</abbr></p>
							<p>Online via Zoom</p>
						</div>
					</div>



					<h3>Community Highlights</h3>
					<div class="community-highlights">
						<div class="highlight-card">
							<div class="highlight-icon">
								<i class="fas fa-heart"></i>
							</div>
							<div class="highlight-content">
								<h4>Our Community Spirit</h4>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
						</div>
						
						<div class="highlight-card">
							<div class="highlight-icon">
								<i class="fas fa-star"></i>
							</div>
							<div class="highlight-content">
								<h4>Cultural Excellence</h4>
								<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
							</div>
						</div>
					</div>
				</div>
				
				<div class="col-md-4">
					<div class="sidebar-section">
						<div class="card">
							<div class="card-body">
								<h4 class="card-title"><i class="fas fa-calendar-plus me-2"></i>Event Registration</h4>
								<p class="card-text">
									To register for upcoming events or get more information, please contact us:
								</p>
								<div class="contact-info">
									<p><i class="fas fa-envelope text-primary me-2"></i>events@orlandokannadasangha.org</p>
									<p><i class="fas fa-phone text-primary me-2"></i>(407) 123-4567</p>
								</div>
								<a href="#" class="btn btn-primary">Register for Events</a>
							</div>
						</div>
						
						<div class="card mt-3">
							<div class="card-body">
								<h4 class="card-title"><i class="fas fa-bullhorn me-2"></i>Event Updates</h4>
								<p class="card-text">
									Stay updated with our latest events and announcements by subscribing to our newsletter.
								</p>
								<div class="newsletter-signup">
									<input type="email" class="form-control mb-2" placeholder="Enter your email">
									<button class="btn btn-outline-primary">Subscribe</button>
								</div>
							</div>
						</div>
						
						<div class="card mt-3">
							<div class="card-body">
								<h4 class="card-title"><i class="fas fa-hand-holding-heart me-2"></i>Volunteer</h4>
								<p class="card-text">
									Interested in helping organize events? We welcome volunteers for various roles.
								</p>
								<a href="#" class="btn btn-outline-success">Volunteer Now</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />

<style>
	/* Main Layout */
	main {
		min-height: 100vh;
	}

	/* Typography */
	.text-justify {
		text-align: justify;
		line-height: 1.8;
	}



	h3 {
		color: #7a1f1f;
		font-weight: 600;
		font-size: 1.5rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		border-bottom: 2px solid #f0d9b5;
		padding-bottom: 0.5rem;
	}

	h5 {
		color: #7a1f1f;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 1rem;
	}





	.kannada-title {
		color: #8a4b4b;
		font-size: 2.5rem;
		font-weight: 500;
		margin: 0;
		font-family: 'Noto Sans Kannada', Arial, sans-serif;
	}

	/* Cards */
	.card {
		border: 2px solid #7a1f1f;
		border-radius: 15px;
		box-shadow: 0 8px 25px rgba(122, 31, 31, 0.15);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 35px rgba(122, 31, 31, 0.25);
	}

	.card-title {
		color: #7a1f1f;
		font-weight: bold;
		font-size: 1.1rem;
	}



	/* Regular Events */
	.regular-events {
		margin-top: 2rem;
	}

	.event-item {
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border: 2px solid #7a1f1f;
		border-radius: 10px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		transition: transform 0.3s ease;
	}

	.event-item:hover {
		transform: translateX(5px);
		background: linear-gradient(135deg, #f0d9b5 0%, #e8c8a0 100%);
	}

	.event-item h4 {
		color: #7a1f1f;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.event-item p {
		margin-bottom: 0.3rem;
		color: #666;
	}

	/* Buttons */
	.btn-primary {
		background: linear-gradient(135deg, #7a1f1f 0%, #5a1515 100%);
		border: none;
		border-radius: 25px;
		padding: 0.8rem 2rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0 4px 15px rgba(122, 31, 31, 0.3);
		transition: all 0.3s ease;
	}



	/* Contact Info */
	.contact-info p {
		margin-bottom: 0.5rem;
	}

	/* Newsletter */
	.newsletter-signup {
		margin-top: 1rem;
	}

	.form-control {
		border: 2px solid #7a1f1f;
		border-radius: 10px;
	}

	.form-control:focus {
		border-color: #5a1515;
		box-shadow: 0 0 0 0.2rem rgba(122, 31, 31, 0.25);
	}

	/* Icons */
	.fas {
		color: #7a1f1f;
	}

	.event-header .fas {
		color: white;
	}

	/* Responsive Design */
	@media (max-width: 768px) {


		h3 {
			font-size: 1.3rem;
		}

		.event-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}



		.kannada-title {
			font-size: 2rem;
		}
	}

	/* Content Sections */
	.col-md-8 {
		background: rgba(255, 255, 255, 0.8);
		padding: 2rem;
		border-radius: 20px;
		box-shadow: 0 10px 30px rgba(122, 31, 31, 0.1);
	}

	/* Main Event Image */
	.main-event-image {
		background: linear-gradient(135deg, #f0d9b5 0%, #e8c8a0 100%);
		height: 300px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2px solid #7a1f1f;
		border-radius: 15px;
		position: relative;
		overflow: hidden;
		margin-bottom: 2rem;
		box-shadow: 0 8px 25px rgba(122, 31, 31, 0.15);
	}

	.main-event-image::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, rgba(122, 31, 31, 0.1) 0%, rgba(240, 217, 181, 0.1) 100%);
	}

	.image-placeholder {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #7a1f1f;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	.image-placeholder i {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.7;
	}

	.image-placeholder p {
		margin: 0;
		font-weight: 600;
		font-size: 1.3rem;
		text-align: center;
	}

	/* Community Highlights */
	.community-highlights {
		margin-top: 2rem;
	}

	.highlight-card {
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		border: 2px solid #7a1f1f;
		border-radius: 15px;
		padding: 2rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		box-shadow: 0 8px 25px rgba(122, 31, 31, 0.15);
	}

	.highlight-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 35px rgba(122, 31, 31, 0.25);
	}

	.highlight-icon {
		background: linear-gradient(135deg, #7a1f1f 0%, #5a1515 100%);
		color: white;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 4px 15px rgba(122, 31, 31, 0.3);
	}

	.highlight-icon i {
		font-size: 1.5rem;
		color: white;
	}

	.highlight-content h4 {
		color: #7a1f1f;
		font-weight: 600;
		margin-bottom: 1rem;
		font-size: 1.3rem;
	}

	.highlight-content p {
		color: #666;
		line-height: 1.8;
		margin-bottom: 0;
		text-align: justify;
	}



	/* Enhanced Regular Events */
	.event-item {
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border: 2px solid #7a1f1f;
		border-radius: 15px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.event-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: linear-gradient(135deg, #7a1f1f 0%, #5a1515 100%);
	}

	.event-item:hover {
		transform: translateX(5px);
		background: linear-gradient(135deg, #f0d9b5 0%, #e8c8a0 100%);
		box-shadow: 0 8px 25px rgba(122, 31, 31, 0.2);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.highlight-card {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.highlight-icon {
			align-self: center;
		}

		.main-event-image {
			height: 200px;
		}

		.image-placeholder i {
			font-size: 3rem;
		}

		.image-placeholder p {
			font-size: 1.1rem;
		}
	}
</style> 