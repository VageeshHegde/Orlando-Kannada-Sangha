<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase.js';

	// Props
	export let members = [];
	export let title = '';
	export let subtitle = '';
	export let icon = 'fas fa-users';
	export let folderPath = '';
	export let showYear = true;
	export let showPosition = true;
	export let useBoardTitleStyle = false;
	export let images = {};
	export let imagesLoaded = false;

	// State
	let memberImages = {};
	let localImagesLoaded = false;

	// Load member images from Supabase Storage
	async function loadMemberImages() {
		// If images are already provided and loaded, use them
		if (imagesLoaded && images && Object.keys(images).length > 0) {
			memberImages = images;
			localImagesLoaded = true;
			return;
		}
		
		// If images are provided but not yet loaded, wait for them
		if (images && Object.keys(images).length > 0) {
			memberImages = images;
			localImagesLoaded = true;
			return;
		}
		
		if (!folderPath || members.length === 0) {
			localImagesLoaded = true;
			return;
		}

		try {
			
			// Check what files exist in the folder
			const { data: files, error: listError } = await supabase.storage
				.from('OKS')
				.list(folderPath, {
					limit: 100,
					offset: 0
				});
			

			// Load images for each member
			const imagePromises = members.map(async (member) => {
				if (member.imageFile) {
					const { data: imageData, error: imageError } = await supabase.storage
						.from('OKS')
						.download(`${folderPath}/${member.imageFile}`);
					
					if (imageError) {
						return { id: member.id, imageUrl: null };
					}
					
					const imageUrl = URL.createObjectURL(imageData);
					return { id: member.id, imageUrl };
				}
				return { id: member.id, imageUrl: null };
			});

			const results = await Promise.all(imagePromises);
			
			// Convert results to object
			memberImages = results.reduce((acc, result) => {
				acc[result.id] = result.imageUrl;
				return acc;
			}, {});

			localImagesLoaded = true;
			
		} catch (error) {
			localImagesLoaded = true;
		}
	}

	// Reactive statement to update images when they change
	$: if (imagesLoaded && images) {
		memberImages = images;
		localImagesLoaded = true;
	}

	onMount(() => {
		loadMemberImages();
	});
</script>

<div class="member-slider-section">
	{#if title}
		{#if useBoardTitleStyle}
			<h2 class="text-center mb-5 board-members-title">
				<i class="{icon} icon"></i>{title}
			</h2>
		{:else}
			<h3 class="text-center mb-4">
				<i class="{icon} icon"></i>{title}
			</h3>
		{/if}
	{/if}
	
	{#if subtitle}
		<h4 class="text-center mb-4" lang="kn" style="font-family: 'Noto Sans Kannada', sans-serif; color: #7a1f1f;">{subtitle}</h4>
	{/if}
	
	<!-- Members Slider -->
	<div class="members-scroller my-3">
		<div class="scroll-container">
			<div class="scroll-content" style="--member-count: {members.length}; --animation-duration: {Math.max(30, members.length * 8)}s;">
				<!-- Duplicate the members for seamless loop -->
				{#each [...members, ...members] as member, index}
					<div class="member-slide">
						<div class="member-image">
							{#if (imagesLoaded || localImagesLoaded) && memberImages[member.id]}
								<img src={memberImages[member.id]} alt={member.name} class="member-photo" />
							{:else}
								<div class="image-placeholder">
									<i class="fas fa-user fa-3x text-muted"></i>
									<p class="text-muted small mt-2">Image not available</p>
								</div>
							{/if}
							<div class="image-overlay">
								<h4 class="member-name">{member.name}</h4>
								{#if showPosition && (member.tag_line || member.position)}
									<p class="member-position">{member.tag_line || member.position}</p>
								{/if}
								{#if showYear && member.year}
									<p class="member-year">{member.year}</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	/* Member Slider Styles */
	.members-scroller {
		position: relative;
		width: 100%;
		overflow: hidden;
		margin: 2rem 0;
	}

	.scroll-container {
		overflow: hidden;
		position: relative;
		padding: 10px;
	}

	.scroll-content {
		display: flex;
		gap: 2rem;
		position: relative;
		animation: scroll var(--animation-duration, 40s) linear infinite;
		width: max-content;
	}

	.scroll-content:hover {
		animation-play-state: paused;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-50% - 3rem));
		}
	}

	.member-slide {
		flex: 0 0 auto;
		width: 250px;
		height: 300px;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
		border: 2px solid #f8a07a;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		transition: all 0.4s ease;
	}

	.member-slide:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
		border-color: #7a1f1f;
	}

	.member-slide .member-image {
		height: 100%;
		position: relative;
	}

	.member-slide .member-photo {
		width: 100%;
		height: 100%;
		object-fit: fill;
		object-position: center;
		aspect-ratio: 2 / 4;
	}

	.member-slide .image-placeholder {
		height: 100%;
		background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
		border: 2px dashed #6c757d;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.member-slide .image-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
		color: white;
		padding: 1rem 0.5rem 0.5rem 0.5rem;
		text-align: center;
		border-radius: 0 0 20px 20px;
	}

	.member-slide .image-overlay .member-name {
		color: white;
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
	}

	.member-slide .image-overlay .member-position {
		color: #f0f0f0;
		font-size: 0.85rem;
		font-weight: 500;
		font-style: italic;
		margin: 0 0 0.25rem 0;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
	}

	.member-slide .image-overlay .member-year {
		color: #7a1f1f;
		font-size: 0.8rem;
		font-weight: 700;
		margin: 0;
		background: rgba(255, 255, 255, 0.9);
		padding: 0.2rem 0.5rem;
		border-radius: 10px;
		display: inline-block;
		text-shadow: none;
	}

	/* Board Members Title Styles */
	.board-members-title {
		font-size: 2.5rem;
		font-weight: 550;
		color: #7a1f1f;
		margin-bottom: 3rem;
		position: relative;
	}

	.board-members-title::after {
		content: '';
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 4px;
		background: linear-gradient(135deg, #7a1f1f 0%, #f26c4f 100%);
		border-radius: 2px;
	}

	/* Icon styles */
	.icon {
		color: #7a1f1f;
		margin-right: 0.5rem;
	}
</style>