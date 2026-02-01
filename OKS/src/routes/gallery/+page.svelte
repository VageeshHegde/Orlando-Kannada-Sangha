<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import MasonryGallery from '$lib/components/MasonryGallery.svelte';
	import { user } from '$lib/stores/auth.js';
	import { supabase } from '$lib/supabase.js';
	import { onMount } from 'svelte';
	
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

	// Gallery images state
	let galleryImages = {
		'all': [],
		'cultural-events': [],
		'community-gatherings': [],
		'kannada-kali': [],
		'performances': [],
		'youth-programs': []
	};
	let imagesLoading = false;
	let imagesError = '';
	let imagesLoaded = false;

	// Load gallery images from Supabase Storage
	async function loadGalleryImages() {
		try {
			imagesLoading = true;
			imagesError = '';

			// Image extensions to filter
			const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif'];
			
			// Helper function to filter image files
			const filterImageFiles = (files) => {
				return (files || []).filter(file => {
					if (!file || !file.name) return false;
					// Skip folders
					if (file.metadata && file.metadata.mimetype === 'folder') return false;
					if (file.id && !file.name.includes('.')) return false;
					const parts = file.name.split('.');
					if (parts.length < 2) return false;
					const extension = file.name.toLowerCase().split('.').pop();
					return imageExtensions.includes(extension);
				});
			};

			// Map section IDs to folder names
			const folderMap = {
				'cultural-events': 'cultural-events',
				'community-gatherings': 'community-gatherings',
				'kannada-kali': 'kannada-kali',
				'performances': 'performances',
				'youth-programs': 'youth-programs'
			};

			// Load images for each category
			const imagePromises = Object.entries(folderMap).map(async ([sectionId, folderName]) => {
				try {
					const folderPath = `gallery/${folderName}`;
					
					// List files in the folder
					const { data: files, error: listError } = await supabase.storage
						.from('OKS')
						.list(folderPath, {
							limit: 100,
							offset: 0,
							sortBy: { column: 'name', order: 'asc' }
						});

					if (listError) {
						return { sectionId, images: [] };
					}

					// Filter for image files
					const imageFiles = filterImageFiles(files);

					// Generate signed URLs for each image
					const urlPromises = imageFiles.map(async (file) => {
						try {
							const { data: signedUrlData, error: signedUrlError } = await supabase.storage
								.from('OKS')
								.createSignedUrl(`${folderPath}/${file.name}`, 3600); // 1 hour expiration

							if (signedUrlError) {
								return null;
							}

							return {
								url: signedUrlData.signedUrl,
								name: file.name,
								category: sectionId
							};
						} catch (error) {
							return null;
						}
					});

					const urls = await Promise.all(urlPromises);
					const validUrls = urls.filter(url => url !== null);

					return { sectionId, images: validUrls };
				} catch (error) {
					return { sectionId, images: [] };
				}
			});

			const results = await Promise.all(imagePromises);

			// Organize images by section
			const newGalleryImages = {
				'all': [],
				'cultural-events': [],
				'community-gatherings': [],
				'kannada-kali': [],
				'performances': [],
				'youth-programs': []
			};

			let totalImages = 0;
			results.forEach(({ sectionId, images }) => {
				newGalleryImages[sectionId] = images;
				totalImages += images.length;
				// Also add to 'all' category
				newGalleryImages['all'].push(...images);
			});

			// If no images found in subfolders, try listing root gallery folder
			if (totalImages === 0) {
				try {
					const { data: rootFiles, error: rootError } = await supabase.storage
						.from('OKS')
						.list('gallery', {
							limit: 100,
							offset: 0
						});

					if (!rootError && rootFiles && rootFiles.length > 0) {
						// Filter for image files
						const imageFiles = filterImageFiles(rootFiles);

						// Generate signed URLs
						const urlPromises = imageFiles.map(async (file) => {
							try {
								const { data: signedUrlData, error: signedUrlError } = await supabase.storage
									.from('OKS')
									.createSignedUrl(`gallery/${file.name}`, 3600);

								if (signedUrlError) {
									return null;
								}

								return {
									url: signedUrlData.signedUrl,
									name: file.name,
									category: 'all'
								};
							} catch (error) {
								return null;
							}
						});

						const urls = await Promise.all(urlPromises);
						const validUrls = urls.filter(url => url !== null);

						if (validUrls.length > 0) {
							newGalleryImages['all'] = validUrls;
							totalImages = validUrls.length;
						}
					}
				} catch (error) {
					// Silently handle error
				}
			}

			galleryImages = newGalleryImages;
			imagesLoaded = true;

		} catch (error) {
			imagesError = 'Failed to load gallery images';
			imagesLoaded = true;
		} finally {
			imagesLoading = false;
		}
	}

	// Reactive statement to reinitialize lightbox when gallery images are loaded
	$: if (imagesLoaded && !imagesLoading && window.lightbox) {
		setTimeout(() => {
			if (window.lightbox) {
				window.lightbox.init();
				// Add click handlers to ensure lightbox works
				document.querySelectorAll('a[data-lightbox="gallery"]').forEach(link => {
					link.addEventListener('click', (e) => {
						e.preventDefault();
						if (window.lightbox) {
							window.lightbox.start(link);
						}
					});
				});
			}
		}, 100);
	}

	// Reload images when user logs in
	$: if (isLoggedIn && !imagesLoaded) {
		if (!imagesLoading) {
			loadGalleryImages();
		}
	}


	// Load images when component mounts and initialize lightbox
	onMount(() => {
		if (isLoggedIn && !imagesLoaded) {
			loadGalleryImages();
		} else if (!isLoggedIn) {
			imagesLoading = false;
			imagesLoaded = true;
		}

		// Initialize lightbox after images are loaded
		if (window.lightbox) {
			window.lightbox.option({
				'resizeDuration': 200,
				'wrapAround': true,
				'showImageNumberLabel': true,
				'albumLabel': 'Image %1 of %2'
			});
			
			// Reinitialize lightbox to bind to new images
			setTimeout(() => {
				if (window.lightbox) {
					window.lightbox.init();
				}
			}, 100);
		}
	});
</script>

<svelte:head>
	<title>Gallery - Orlando Kannada Sangha</title>
	<meta name="description" content="Browse our photo gallery showcasing cultural events, community gatherings, and memorable moments from Orlando Kannada Sangha." />
	<meta name="keywords" content="Orlando Kannada Sangha gallery, OKS photos, Kannada cultural events, community photos, Ugadi celebrations, Kannada Kali classes, cultural performances, Orlando Indian community photos" />
</svelte:head>

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
							<i class="fas fa-lock me-3" aria-hidden="true"></i>
							<div class="flex-grow-1">
								<h5 class="alert-heading mb-2">Member Access Required</h5>
								<p class="mb-3">To view our gallery, you must be a registered member of Orlando Kannada Sangha.</p>
								<p class="mb-3">If you are a member, please login to access the gallery.</p>
								<div class="d-flex gap-2">
									<a href="https://www.zeffy.com/en-US/ticketing/oks-membership--2026" target="_blank" class="btn btn-primary" aria-label="Become a member - opens in new window">
										<i class="fas fa-user-plus me-2" aria-hidden="true"></i>Become a Member
									</a>
									<a href="/login" class="btn btn-outline-primary">
										<i class="fas fa-sign-in-alt me-2" aria-hidden="true"></i>Login
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
					<p class="mt-3">
						<a href="https://framemebeautiful.shootproof.com/gallery/28697646" target="_blank" class="btn btn-outline-primary" aria-label="View Kannada Rajyotsava Images 2025 - opens in new window">
							<i class="fas fa-images me-2" aria-hidden="true"></i>Kannada Rajyotsava Images 2025
						</a>
					</p>
				</div>
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<h3 class="card-title">Gallery Categories</h3>
							<ul class="list-unstyled">
								{#each sections as section}
									<li class="mb-2">
										<button 
											class="category-link {activeSection === section.id ? 'active' : ''}"
											on:click={() => setActiveSection(section.id)}
											aria-pressed={activeSection === section.id ? 'true' : 'false'}
											aria-label={`Filter gallery by ${section.name}`}
											type="button"
										>
											<i class="{section.icon} me-2" aria-hidden="true"></i>{section.name}
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
				<h2 class="category-title">
					<i class="{sections.find(s => s.id === activeSection)?.icon} me-2" aria-hidden="true"></i>
					{sections.find(s => s.id === activeSection)?.name}
				</h2>
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
			{#if !isLoggedIn}
				<!-- Login required message is shown above, gallery is hidden -->
			{:else}
				<MasonryGallery 
					items={galleryImages[activeSection] || []}
					loading={imagesLoading}
					error={imagesError}
					emptyMessage="No images found in this category"
					emptySubtitle="Images will appear here once uploaded to Storage"
					showDownloadButton={true}
					showOverlay={false}
					enableLightbox={true}
					lightboxGalleryName="gallery"
				/>
			{/if}
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
	
	h2 {
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

	.category-link:focus {
		outline: 3px solid #7a1f1f;
		outline-offset: 2px;
	}

	.category-link:focus-visible {
		outline: 3px solid #7a1f1f;
		outline-offset: 2px;
	}

	.category-link:hover {
		background-color: rgba(122, 31, 31, 0.1);
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

	/* Screen reader only text */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
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
</style> 