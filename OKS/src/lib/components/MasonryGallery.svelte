<script>
	import { createEventDispatcher } from 'svelte';
	
	// Props
	export let items = []; // Array of items to display
	export let loading = false;
	export let error = '';
	export let emptyMessage = 'No items found';
	export let emptySubtitle = '';
	export let showDownloadButton = false;
	export let showOverlay = true;
	export let enableLightbox = false;
	export let lightboxGalleryName = 'gallery';
	
	const dispatch = createEventDispatcher();
	
	// Download image function
	async function downloadImage(imageUrl, imageName) {
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = imageName || 'image.jpg';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading image:', error);
			// Fallback: open in new tab
			window.open(imageUrl, '_blank');
		}
	}
	
	function handleItemClick(item, index) {
		dispatch('itemClick', { item, index });
	}
</script>

<!-- Masonry Gallery -->
<div class="masonry-gallery" role="region" aria-label="Gallery">
	{#if loading}
		<div class="loading-state" role="status" aria-live="polite" aria-busy="true">
			<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
			<p>Loading...</p>
		</div>
	{:else if error}
		<div class="error-state" role="alert" aria-live="assertive">
			<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
			<p>{error}</p>
		</div>
	{:else if items.length === 0}
		<div class="empty-state" role="status" aria-live="polite">
			<i class="fas fa-images" aria-hidden="true"></i>
			<p>{emptyMessage}</p>
			{#if emptySubtitle}
				<p class="empty-subtitle">{emptySubtitle}</p>
			{/if}
		</div>
	{:else}
		{#each items as item, index}
			<article class="gallery-item" aria-label={item.alt || item.name || `Gallery item ${index + 1}`}>
				{#if item.link}
					<!-- Item has a link (e.g., sponsor website) -->
					<a 
						href={item.link} 
						target="_blank" 
						rel="noopener noreferrer"
						class="gallery-link"
						on:click={() => handleItemClick(item, index)}
					>
						<img 
							src={item.url || item.image} 
							alt={item.alt || item.name || `Gallery item ${index + 1}`}
							loading="lazy"
							style="display: block; width: 100%; height: auto;"
							on:error={(e) => {
								e.target.style.display = 'none';
								const placeholder = e.target.nextElementSibling;
								if (placeholder && placeholder.classList.contains('placeholder-image')) {
									placeholder.style.display = 'flex';
								}
							}}
						/>
						<div class="placeholder-image" style="display: none;">
							<div class="placeholder-content">
								<i class="fas fa-image" aria-hidden="true"></i>
								<p>Image not available</p>
							</div>
						</div>
						{#if showOverlay && (item.title || item.subtitle)}
							<div class="gallery-overlay">
								{#if item.title}
									<h4 class="gallery-overlay-title">{item.title}</h4>
								{/if}
								{#if item.subtitle}
									<p class="gallery-overlay-subtitle">{item.subtitle}</p>
								{/if}
							</div>
						{/if}
					</a>
				{:else if enableLightbox}
					<!-- Lightbox enabled (for gallery images) -->
					<a 
						href={item.url || item.image} 
						data-lightbox={lightboxGalleryName}
						data-title={item.name || item.alt || `Gallery item ${index + 1}`}
						aria-label={`View full size: ${item.name || item.alt || `Gallery item ${index + 1}`}`}
						on:click={() => handleItemClick(item, index)}
					>
						<img 
							src={item.url || item.image} 
							alt={item.alt || item.name || `Gallery item ${index + 1}`}
							loading="lazy"
							style="display: block; width: 100%; height: auto;"
							on:error={(e) => {
								e.target.style.display = 'none';
								const placeholder = e.target.nextElementSibling;
								if (placeholder && placeholder.classList.contains('placeholder-image')) {
									placeholder.style.display = 'flex';
								}
							}}
						/>
						<div class="placeholder-image" style="display: none;">
							<div class="placeholder-content">
								<i class="fas fa-image" aria-hidden="true"></i>
								<p>Image not available</p>
							</div>
						</div>
					</a>
					{#if showDownloadButton}
						<button 
							class="download-btn"
							on:click|stopPropagation={(e) => {
								e.preventDefault();
								downloadImage(item.url || item.image, item.name);
							}}
							aria-label={`Download ${item.name || `image ${index + 1}`}`}
							title={`Download ${item.name || `image ${index + 1}`}`}
							type="button"
						>
							<i class="fas fa-download" aria-hidden="true"></i>
							<span class="sr-only">Download image</span>
						</button>
					{/if}
				{:else}
					<!-- Simple display (no link, no lightbox) -->
					<div on:click={() => handleItemClick(item, index)} on:keydown={(e) => e.key === 'Enter' && handleItemClick(item, index)} role="button" tabindex="0">
						<img 
							src={item.url || item.image} 
							alt={item.alt || item.name || `Gallery item ${index + 1}`}
							loading="lazy"
							style="display: block; width: 100%; height: auto;"
							on:error={(e) => {
								e.target.style.display = 'none';
								const placeholder = e.target.nextElementSibling;
								if (placeholder && placeholder.classList.contains('placeholder-image')) {
									placeholder.style.display = 'flex';
								}
							}}
						/>
						<div class="placeholder-image" style="display: none;">
							<div class="placeholder-content">
								<i class="fas fa-image" aria-hidden="true"></i>
								<p>Image not available</p>
							</div>
						</div>
						{#if showOverlay && (item.title || item.subtitle)}
							<div class="gallery-overlay">
								{#if item.title}
									<h4 class="gallery-overlay-title">{item.title}</h4>
								{/if}
								{#if item.subtitle}
									<p class="gallery-overlay-subtitle">{item.subtitle}</p>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</article>
		{/each}
	{/if}
</div>

<style>
	/* Masonry Gallery Styles */
	.masonry-gallery {
		columns: 4;
		column-gap: 20px;
		margin-top: 2rem;
		column-fill: balance;
	}

	.gallery-item {
		break-inside: avoid;
		page-break-inside: avoid;
		margin-bottom: 20px;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		position: relative;
		cursor: pointer;
		display: inline-block;
		width: 100%;
		vertical-align: top;
	}

	.gallery-item:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 30px rgba(122, 31, 31, 0.25);
		z-index: 10;
	}

	.gallery-link {
		text-decoration: none;
		display: block;
		width: 100%;
		height: 100%;
		color: inherit;
	}

	.gallery-link:focus {
		outline: 3px solid #7a1f1f;
		outline-offset: 2px;
		border-radius: 12px;
	}

	.gallery-link:focus-visible {
		outline: 3px solid #7a1f1f;
		outline-offset: 2px;
		border-radius: 12px;
	}

	.gallery-item img {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
		border-radius: 12px;
		transition: transform 0.3s ease;
	}

	.gallery-item:hover img {
		transform: scale(1.05);
	}

	.placeholder-image {
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(45deg, #7a1f1f, #f0d9b5);
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

	/* Gallery overlay text */
	.gallery-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to bottom, rgba(122, 31, 31, 0.7), rgba(0, 0, 0, 0.8));
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 1;
		transition: opacity 0.3s ease;
		padding: 1rem;
	}

	.gallery-overlay-title {
		color: #fff;
		font-size: 1.2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		text-align: center;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.gallery-overlay-subtitle {
		color: #f26c4f;
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		text-align: center;
		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
	}

	.download-btn {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background-color: rgba(122, 31, 31, 0.9);
		color: white;
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
		z-index: 20;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		font-size: 1rem;
	}

	.download-btn:focus {
		outline: 3px solid #7a1f1f;
		outline-offset: 2px;
		opacity: 1;
	}

	.download-btn:focus-visible {
		outline: 3px solid #7a1f1f;
		outline-offset: 2px;
		opacity: 1;
	}

	.gallery-item:hover .download-btn {
		opacity: 1;
		transform: scale(1.1);
	}

	.download-btn:hover {
		background-color: rgba(90, 21, 21, 1);
		transform: scale(1.15);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.download-btn:active {
		transform: scale(1.05);
	}

	.download-btn i {
		font-size: 1rem;
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

	/* Loading, Error, and Empty States */
	.loading-state,
	.error-state,
	.empty-state {
		column-span: all;
		text-align: center;
		padding: 4rem 2rem;
		color: #7a1f1f;
	}

	.loading-state i,
	.error-state i,
	.empty-state i {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.loading-state i {
		animation: spin 1s linear infinite;
		color: #7a1f1f;
	}

	.error-state,
	.error-state i {
		color: #dc3545;
	}

	.empty-state i {
		color: #7a1f1f;
	}

	.empty-state p {
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}

	.empty-subtitle {
		font-size: 0.9rem;
		color: #666;
		font-style: italic;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Responsive Design */
	@media (max-width: 1400px) {
		.masonry-gallery {
			columns: 4;
			column-gap: 18px;
		}
	}

	@media (max-width: 1200px) {
		.masonry-gallery {
			columns: 3;
			column-gap: 18px;
		}
	}

	@media (max-width: 992px) {
		.masonry-gallery {
			columns: 3;
			column-gap: 15px;
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

		.gallery-item:hover {
			transform: translateY(-5px);
		}

		.download-btn {
			width: 36px;
			height: 36px;
			bottom: 8px;
			right: 8px;
			opacity: 1;
		}

		.download-btn i {
			font-size: 0.9rem;
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
			margin-bottom: 12px;
		}

		.gallery-item:hover {
			transform: translateY(-3px);
		}

		.download-btn {
			width: 32px;
			height: 32px;
			bottom: 6px;
			right: 6px;
			opacity: 1;
		}

		.download-btn i {
			font-size: 0.8rem;
		}
		
		.placeholder-content i {
			font-size: 2rem;
		}
		
		.placeholder-content p {
			font-size: 0.9rem;
		}
	}
</style>
