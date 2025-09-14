<script>
	export let event = {
		title: '',
		date: '',
		description: '',
		time: '',
		location: '',
		audience: '',
		highlights: [],
		highlightsTitle: 'Highlights:',
		icon: 'fas fa-calendar-alt',
		image: null
	};
</script>

<div class="event-card">
	{#if event.image}
		<div class="event-image">
			<img src={event.image} alt="{event.title}" />
		</div>
	{:else}
		<div class="event-image-placeholder">
			<div class="image-placeholder">
				<i class="fas fa-image"></i>
				<p>{event.title} Image</p>
			</div>
		</div>
	{/if}
	
	<div class="event-content">
		<p class="event-description">
			{event.description}
		</p>
		<div class="event-details">
			<h4><i class="{event.icon} me-2"></i>{event.title}</h4>
			<p><i class="fas fa-calendar me-2"></i>{event.date}</p>
			<p><i class="fas fa-clock me-2"></i>Time: {event.time}</p>
			<p><i class="fas fa-map-marker-alt me-2"></i>Location: {event.location}</p>
			<p><i class="fas fa-users me-2"></i>{event.audience}</p>
		</div>
		<div class="event-highlights">
			<h6>{event.highlightsTitle}</h6>
			<ul>
				{#each event.highlights as highlight}
					<li>{highlight}</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	/* Event Cards - Modern Design */
	.event-card {
		background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
		border: none;
		border-radius: 20px;
		margin-bottom: 2.5rem;
		box-shadow: 
			0 10px 30px rgba(122, 31, 31, 0.1),
			0 4px 8px rgba(0, 0, 0, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		overflow: hidden;
		position: relative;
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
	}

	.event-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 5px;
		background: linear-gradient(90deg, #7a1f1f 0%, #8a4b4b 50%, #7a1f1f 100%);
		z-index: 2;
	}



	/* Event Image - Enhanced */
	.event-image {
		width: 100%;
		height: 220px;
		overflow: hidden;
		position: relative;
		border-radius: 20px 20px 0 0;
	}

	.event-image::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60px;
		background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
		z-index: 1;
	}

	.event-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		filter: brightness(0.95);
	}



	.event-image-placeholder {
		width: 100%;
		height: 220px;
		background: linear-gradient(135deg, #f0d9b5 0%, #e8c8a0 50%, #f0d9b5 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;
		border-radius: 20px 20px 0 0;
	}

	.event-image-placeholder::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: 
			radial-gradient(circle at 30% 20%, rgba(122, 31, 31, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 70% 80%, rgba(240, 217, 181, 0.1) 0%, transparent 50%);
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
		font-size: 3.5rem;
		margin-bottom: 1rem;
		opacity: 0.8;
		transition: all 0.3s ease;
	}



	.image-placeholder p {
		margin: 0;
		font-weight: 700;
		font-size: 1.2rem;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0,0,0,0.1);
	}

	/* Event Header - Modern */
	.event-header {
		background: linear-gradient(135deg, #7a1f1f 0%, #8a4b4b 50%, #7a1f1f 100%);
		color: white;
		padding: 1.8rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		position: relative;
		overflow: hidden;
	}

	.event-header::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
		transition: left 0.6s ease;
	}



	.event-header h4 {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 700;
		text-shadow: 0 2px 4px rgba(0,0,0,0.3);
		position: relative;
		z-index: 1;
	}

	.event-date {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		padding: 0.6rem 1.2rem;
		border-radius: 25px;
		font-weight: 600;
		border: 1px solid rgba(255, 255, 255, 0.2);
		position: relative;
		z-index: 1;
		transition: all 0.3s ease;
	}



	/* Event Content - Enhanced */
	.event-content {
		padding: 2rem;
		background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
	}

	.event-description {
		font-size: 1.15rem;
		line-height: 1.7;
		margin-bottom: 2rem;
		color: #2c3e50;
		font-weight: 400;
		text-align: justify;
	}

	/* Event Details - Modern */
	.event-details {
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		padding: 1.5rem;
		border-radius: 15px;
		margin-bottom: 1.5rem;
		border-left: 5px solid #7a1f1f;
		box-shadow: 0 4px 15px rgba(122, 31, 31, 0.08);
		position: relative;
		overflow: hidden;
	}

	.event-details::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(45deg, transparent 30%, rgba(122, 31, 31, 0.02) 50%, transparent 70%);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}



	.event-details p {
		margin-bottom: 0.8rem;
		font-weight: 500;
		color: #34495e;
		position: relative;
		z-index: 1;
	}

	.event-details p:last-child {
		margin-bottom: 0;
	}

	/* Event Highlights - Enhanced */
	.event-highlights {
		background: linear-gradient(135deg, #f0d9b5 0%, #e8c8a0 50%, #f0d9b5 100%);
		padding: 1.5rem;
		border-radius: 15px;
		position: relative;
		overflow: hidden;
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
	}

	.event-highlights::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, #7a1f1f, #8a4b4b, #7a1f1f);
	}

	.event-highlights h6 {
		color: #7a1f1f;
		font-weight: 700;
		margin-bottom: 1rem;
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		position: relative;
		z-index: 1;
	}

	.event-highlights ul {
		list-style: none;
		padding-left: 0;
		margin-bottom: 0;
		position: relative;
		z-index: 1;
	}

	.event-highlights li {
		padding: 0.5rem 0;
		position: relative;
		padding-left: 2rem;
		transition: all 0.3s ease;
	}

	.event-highlights li:hover {
		transform: translateX(5px);
	}

	.event-highlights li:before {
		content: "✓";
		color: #7a1f1f;
		font-weight: bold;
		position: absolute;
		left: 0;
		top: 0.5rem;
		font-size: 1.1rem;
		background: rgba(255, 255, 255, 0.8);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	/* Icons - Enhanced */
	.fas {
		color: #7a1f1f;
		transition: all 0.3s ease;
	}

	.event-header .fas {
		color: white;
		text-shadow: 0 1px 2px rgba(0,0,0,0.3);
	}

	.event-details .fas {
		margin-right: 0.5rem;
		width: 16px;
		text-align: center;
	}

	/* Responsive Design - Enhanced */
	@media (max-width: 768px) {
		.event-card {
			margin-bottom: 2rem;
			border-radius: 15px;
		}

		.event-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
			padding: 1.5rem;
		}

		.event-header h4 {
			font-size: 1.2rem;
		}

		.event-content {
			padding: 1.5rem;
		}

		.event-image,
		.event-image-placeholder {
			height: 180px;
		}

		.image-placeholder i {
			font-size: 3rem;
		}

		.image-placeholder p {
			font-size: 1rem;
		}

		.event-description {
			font-size: 1rem;
			line-height: 1.6;
		}

		.event-details,
		.event-highlights {
			padding: 1.2rem;
		}
	}

	@media (max-width: 480px) {
		.event-image,
		.event-image-placeholder {
			height: 150px;
		}

		.event-header {
			padding: 1.2rem;
		}

		.event-content {
			padding: 1.2rem;
		}

		.event-header h4 {
			font-size: 1.1rem;
		}

		.event-date {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}
	}
</style> 