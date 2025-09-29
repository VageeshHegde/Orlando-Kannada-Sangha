<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { user } from '$lib/stores/auth.js';
	
	// Real authentication state from Supabase
	$: isLoggedIn = !!$user;
	$: memberName = $user ? getUserDisplayName($user) : 'Guest';
	
	// Enhanced name extraction function
	function getUserDisplayName(user) {
		if (!user) return 'Guest';
		
		// Try to get full name from metadata first
		const firstName = user.user_metadata?.first_name || '';
		const lastName = user.user_metadata?.last_name || '';
		
		if (firstName && lastName) {
			return `${firstName} ${lastName}`;
		} else if (firstName) {
			return firstName;
		} else if (lastName) {
			return lastName;
		}
		
		// Enhanced email parsing for better name extraction
		if (user.email) {
			const emailUser = user.email.split('@')[0];
			
			if (emailUser.includes('.')) {
				// Handle patterns like "john.doe"
				const parts = emailUser.split('.');
				const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
				const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
				return last ? `${first} ${last}` : first;
			} else if (emailUser.includes('_')) {
				// Handle patterns like "john_doe"
				const parts = emailUser.split('_');
				const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
				const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
				return last ? `${first} ${last}` : first;
			} else {
				// Simple capitalization
				return emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
			}
		}
		
		return 'Member';
	}
	
	// Gallery section state
	let activeSection = 'all'; // 'all', 'cultural-events', 'community-gatherings', 'kannada-kali', 'performances', 'youth-programs'
	
	const sections = [
		{ id: 'all', name: 'All Photos', icon: 'fas fa-images' },
		{ id: 'cultural-events', name: 'Cultural Events', icon: 'fas fa-calendar-alt' },
		{ id: 'community-gatherings', name: 'Community Gatherings', icon: 'fas fa-users' },
		{ id: 'kannada-kali', name: 'Kannada Kali Classes', icon: 'fas fa-graduation-cap' },
		{ id: 'performances', name: 'Performances', icon: 'fas fa-music' },
		{ id: 'youth-programs', name: 'Youth Programs', icon: 'fas fa-child' }
	];
	
	function setActiveSection(sectionId) {
		activeSection = sectionId;
	}
</script>

<Navbar />
<Hero 
  page="Gallery" 
  leftImage="/images/Yakshagana.png"
  rightImage="/images/Hampi.png"
  topLeftImage="/images/Mickey_Mouse.png"
  bottomRightImage="/images/Rocket.png"
/>

<!-- Gallery Content -->
<main class="container my-5">
	<div class="row">
		<div class="col-12">
			<PageTitle englishTitle="Photo Collection/Gallery" kannadaTitle="ಛಾಯಾಚಿತ್ರ ಸಂಗ್ರಹ" />
			
			<!-- Login Required Notice -->
			{#if !isLoggedIn}
				<div class="login-notice mb-4">
					<div class="alert alert-warning" role="alert">
						<div class="d-flex align-items-center">
							<i class="fas fa-lock me-3"></i>
							<div class="flex-grow-1">
								<h5 class="alert-heading mb-2">Member Access Required</h5>
								<p class="mb-3">To view our gallery, you must be a registered member of Orlando Kannada Sangha.</p>
								<p class="mb-3">If you are a member, please login to access the gallery.</p>
								<div class="d-flex gap-2">
									<a href="https://www.zeffy.com/en-US/ticketing/d0cea646-0ac3-449b-8687-153653b0dc10" target="_blank" class="btn btn-primary">
										<i class="fas fa-user-plus me-2"></i>Become a Member
									</a>
									<a href="/login" class="btn btn-outline-primary">
										<i class="fas fa-sign-in-alt me-2"></i>Login
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
			
			<!-- Gallery Categories Card -->
			<div class="row mb-5">
				<div class="col-md-8">
					<p class="text-justify">
						Welcome {isLoggedIn ? memberName : ''} to our gallery showcasing the vibrant cultural events, community gatherings, 
						and memorable moments from Orlando Kannada Sangha. Here you'll find photos from our 
						Ugadi celebrations, Kannada Kali classes, cultural performances, and various social events 
						that bring our community together.
					</p>
					<p class="text-justify">
						Our gallery captures the essence of Kannada culture through various celebrations 
						and events. From traditional Ugadi celebrations to modern cultural performances, 
						each image tells a story of our community's commitment to preserving and promoting 
						Karnataka's rich heritage.
					</p>
					<p class="text-justify">
						Browse through our collection of community events, youth programs, and social gatherings. 
						These images reflect the strong bonds within our Kannadiga community and the joy we share 
						in celebrating our cultural identity together.
					</p>
				</div>
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Gallery Categories</h5>
							<ul class="list-unstyled">
								{#each sections as section}
									<li class="mb-2">
										<button 
											class="category-link {activeSection === section.id ? 'active' : ''}"
											on:click={() => setActiveSection(section.id)}
										>
											<i class="{section.icon} me-2"></i>{section.name}
										</button>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- Gallery Category Title -->
			<div class="category-title-section mb-4">
				<h3 class="category-title">
					<i class="{sections.find(s => s.id === activeSection)?.icon} me-2"></i>
					{sections.find(s => s.id === activeSection)?.name}
				</h3>
				<div class="category-subtitle">
					{#if activeSection === 'all'}
						Browse all our gallery photos
					{:else if activeSection === 'cultural-events'}
						Traditional celebrations and cultural events
					{:else if activeSection === 'community-gatherings'}
						Community bonding and social gatherings
					{:else if activeSection === 'kannada-kali'}
						Language learning and educational activities
					{:else if activeSection === 'performances'}
						Musical and dance performances
					{:else if activeSection === 'youth-programs'}
						Youth activities and special moments
					{/if}
				</div>
			</div>

			<!-- Masonry Gallery -->
			<div class="masonry-gallery">
				{#if activeSection === 'all' || activeSection === 'cultural-events'}
					<div class="gallery-item" data-category="cultural-events" style="height: 300px;">
						<div class="placeholder-image" style="background: linear-gradient(45deg, #7a1f1f, #f0d9b5);">
							<div class="placeholder-content">
								<i class="fas fa-calendar-alt"></i>
								<p>Ugadi Celebration 2024</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="cultural-events" style="height: 350px;">
						<div class="placeholder-image" style="background: linear-gradient(135deg, #f0d9b5, #7a1f1f);">
							<div class="placeholder-content">
								<i class="fas fa-star"></i>
								<p>Annual Event 2024</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="cultural-events" style="height: 280px;">
						<div class="placeholder-image" style="background: linear-gradient(225deg, #7a1f1f, #f0d9b5);">
							<div class="placeholder-content">
								<i class="fas fa-trophy"></i>
								<p>Competition Winners</p>
							</div>
						</div>
					</div>
				{/if}
				
				{#if activeSection === 'all' || activeSection === 'community-gatherings'}
					<div class="gallery-item" data-category="community-gatherings" style="height: 400px;">
						<div class="placeholder-image" style="background: linear-gradient(135deg, #f0d9b5, #7a1f1f);">
							<div class="placeholder-content">
								<i class="fas fa-users"></i>
								<p>Community Gathering</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="community-gatherings" style="height: 320px;">
						<div class="placeholder-image" style="background: linear-gradient(315deg, #f0d9b5, #7a1f1f);">
							<div class="placeholder-content">
								<i class="fas fa-heart"></i>
								<p>Community Bonding</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="community-gatherings" style="height: 290px;">
						<div class="placeholder-image" style="background: linear-gradient(45deg, #7a1f1f, #f0d9b5);">
							<div class="placeholder-content">
								<i class="fas fa-camera"></i>
								<p>Photo Session</p>
							</div>
						</div>
					</div>
				{/if}
				
				{#if activeSection === 'all' || activeSection === 'kannada-kali'}
					<div class="gallery-item" data-category="kannada-kali" style="height: 250px;">
						<div class="placeholder-image" style="background: linear-gradient(225deg, #7a1f1f, #f0d9b5);">
							<div class="placeholder-content">
								<i class="fas fa-graduation-cap"></i>
								<p>Kannada Kali Class</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="kannada-kali" style="height: 260px;">
						<div class="placeholder-image" style="background: linear-gradient(315deg, #f0d9b5, #7a1f1f);">
							<div class="placeholder-content">
								<i class="fas fa-book"></i>
								<p>Language Workshop</p>
							</div>
						</div>
					</div>
				{/if}
				
				{#if activeSection === 'all' || activeSection === 'performances'}
					<div class="gallery-item" data-category="performances" style="height: 350px;">
						<div class="placeholder-image" style="background: linear-gradient(315deg, #f0d9b5, #7a1f1f);">
							<div class="placeholder-content">
								<i class="fas fa-music"></i>
								<p>Cultural Performance</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="performances" style="height: 380px;">
						<div class="placeholder-image" style="background: linear-gradient(225deg, #7a1f1f, #f0d9b5);">
							<div class="placeholder-content">
								<i class="fas fa-drum"></i>
								<p>Traditional Dance</p>
							</div>
						</div>
					</div>
				{/if}
				
				{#if activeSection === 'all' || activeSection === 'youth-programs'}
					<div class="gallery-item" data-category="youth-programs" style="height: 280px;">
						<div class="placeholder-image" style="background: linear-gradient(45deg, #7a1f1f, #f0d9b5);">
							<div class="placeholder-content">
								<i class="fas fa-child"></i>
								<p>Youth Program</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="youth-programs" style="height: 270px;">
						<div class="placeholder-image" style="background: linear-gradient(315deg, #f0d9b5, #7a1f1f);">
							<div class="placeholder-content">
								<i class="fas fa-star"></i>
								<p>Special Moments</p>
							</div>
						</div>
					</div>
					
					<div class="gallery-item" data-category="youth-programs" style="height: 330px;">
						<div class="placeholder-image" style="background: linear-gradient(45deg, #7a1f1f, #f0d9b5);">
							<div class="placeholder-content">
								<i class="fas fa-smile"></i>
								<p>Happy Memories</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
			{/if}
		</div>
	</div>
</main>

<Footer />

<style>
	.text-justify {
		text-align: justify;
	}
	
	.card {
		border: 2px solid #7a1f1f;
		border-radius: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	
	.card-title {
		color: #7a1f1f;
		font-weight: bold;
	}
	
	h3 {
		color: #7a1f1f;
	}

	/* Category Link Styles */
	.category-link {
		background: none;
		border: none;
		color: #7a1f1f;
		text-decoration: none;
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		transition: all 0.3s ease;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.category-link:hover {
		background-color: rgba(122, 31, 31, 0.1);
		color: #7a1f1f;
		transform: translateX(5px);
	}

	.category-link.active {
		background-color: #7a1f1f;
		color: white;
		font-weight: 600;
		box-shadow: 0 2px 8px rgba(122, 31, 31, 0.3);
	}

	.category-link.active:hover {
		background-color: #5a1515;
		transform: translateX(5px);
	}

	.category-link i {
		width: 20px;
		text-align: center;
	}

	/* Category Title Styles */
	.category-title-section {
		text-align: center;
		padding: 2rem 0;
		border-bottom: 2px solid rgba(122, 31, 31, 0.2);
	}

	.category-title {
		color: #7a1f1f;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.category-title i {
		font-size: 2.2rem;
		margin-right: 1rem;
		color: #7a1f1f;
	}

	.category-subtitle {
		color: #666;
		font-size: 1.1rem;
		font-style: italic;
		margin-top: 0.5rem;
	}

	/* Login Notice Styles */
	.login-notice .alert {
		border: 2px solid #ffc107;
		border-radius: 12px;
		background: linear-gradient(135deg, #fff3cd, #ffeaa7);
		box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
	}

	.login-notice .alert-heading {
		color: #856404;
		font-weight: 600;
		font-size: 1.2rem;
	}

	.login-notice .alert p {
		color: #856404;
		font-size: 1rem;
		margin-bottom: 0;
	}

	.login-notice .btn-primary {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		transition: all 0.3s ease;
	}

	.login-notice .btn-primary:hover {
		background-color: #5a1515;
		border-color: #5a1515;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
	}

	.login-notice .btn-outline-primary {
		color: #7a1f1f;
		border-color: #7a1f1f;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		transition: all 0.3s ease;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.login-notice .btn-outline-primary:hover {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(122, 31, 31, 0.3);
	}

	.login-notice i.fa-lock {
		font-size: 2rem;
		color: #856404;
	}

	/* Masonry Gallery Styles */
	.masonry-gallery {
		columns: 4;
		column-gap: 20px;
		margin-top: 2rem;
	}

	.gallery-item {
		break-inside: avoid;
		margin-bottom: 20px;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.gallery-item:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	.placeholder-image {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		cursor: pointer;
	}

	.placeholder-content {
		text-align: center;
		color: white;
		padding: 20px;
	}

	.placeholder-content i {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.9;
	}

	.placeholder-content p {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* Responsive Design */
	@media (max-width: 1200px) {
		.masonry-gallery {
			columns: 3;
		}
	}

	@media (max-width: 768px) {
		.masonry-gallery {
			columns: 2;
			column-gap: 15px;
		}
		
		.gallery-item {
			margin-bottom: 15px;
		}
		
		.placeholder-content i {
			font-size: 2.5rem;
		}
		
		.placeholder-content p {
			font-size: 1rem;
		}
	}

	@media (max-width: 576px) {
		.masonry-gallery {
			columns: 1;
			column-gap: 10px;
		}
		
		.gallery-item {
			margin-bottom: 10px;
		}
		
		.placeholder-content i {
			font-size: 2rem;
		}
		
		.placeholder-content p {
			font-size: 0.9rem;
		}
	}
</style> 