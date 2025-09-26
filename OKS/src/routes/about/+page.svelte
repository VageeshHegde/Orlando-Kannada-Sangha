<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MemberSlider from '$lib/components/MemberSlider.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase.js';
	
	// Image storage
	let boardMemberImages = {};
	let imagesLoaded = false;
	let webTeamImages = {};
	let webTeamImagesLoaded = false;
	let pastMemberImages = {};
	let pastMemberImagesLoaded = false;
	
	// Board members data
	const boardMembers = [
		{
			id: 'venugopal',
			name: 'Mr. Venugopal Kulkarni',
			position: 'President',
			year: '2024 - present',
			description: 'Leading the organization with dedication and vision for Kannada culture preservation.',
			imageFile: 'Venugopal.jpeg'
		},
		{
			id: 'vishwa',
			name: 'Mr. Vishwa',
			position: 'Vice President',
			year: '2025 - present', 
			description: 'Supporting cultural initiatives and community engagement programs.',
			imageFile: 'Vishwa.jpg'
		},
		{
			id: 'supreeta',
			name: 'Mrs. Supreeta Bolar',
			position: 'Secretary',
			year: '2025 - present',
			description: 'Managing organizational communications and event coordination.',
			imageFile: 'Supreeta.jpg'
		},
		{
			id: 'sindhu',
			name: 'Mrs. Sindhu Raju',
			position: 'Treasurer',
			year: '2025 - present',
			description: 'Overseeing financial management and resource allocation.',
			imageFile: 'Sindhu.jpeg'
		}
	];
	
	// Web development team data
	const webTeamMembers = [
		{
			id: 'ai-assistant',
			name: 'Mr. Venugopal Kulkarni',
			position: 'Content Segmentation',
			year: '2025 - present',
			description: 'Website architecture and content organization',
			imageFile: 'Venugopal.jpeg'
		},
		{
			id: 'backend-team',
			name: 'Mrs. Vedashri Bhat',
			position: 'Guidance & Hosting',
			year: '2025 - present',
			description: 'Project guidance and hosting management',
			imageFile: 'Backend-Team.png'
		},
		{
			id: 'design-team',
			name: 'Mrs. Supreeta Bolar',
			position: 'Design & Data Collection',
			year: '2025 - present',
			description: 'UI/UX design and data management',
			imageFile: 'Supreeta.jpg'
		},
		{
			id: 'devops-team',
			name: 'Mr. Vageesh Hegde',
			position: 'Development',
			year: '2025 - present',
			description: 'Core development and implementation',
			imageFile: 'Vageesh.jpg'
		}
	];
	
	// Past board members data - loaded from external JSON file
	let pastMembers = [];
	let pastMembersLoaded = false;
	
	// Load past members from database via API
	async function loadPastMembers() {
		try {
			const response = await fetch('/api/past-members');
			if (response.ok) {
				const data = await response.json();
				pastMembers = data.members || [];
				pastMembersLoaded = true;
				console.log('Past members loaded from database:', pastMembers.length);
				console.log('Sample member data:', pastMembers[0]);
				
				// Load images after members are loaded
				loadPastMemberImages();
			} else {
				console.error('Failed to load past members:', response.status);
				// Fallback to empty array
				pastMembers = [];
				pastMembersLoaded = true;
			}
		} catch (error) {
			console.error('Error loading past members:', error);
			// Fallback to empty array
			pastMembers = [];
			pastMembersLoaded = true;
		}
	}
	
	// Load board member images from Supabase Storage
	async function loadBoardMemberImages() {
		try {
			const { data: files, error: listError } = await supabase.storage
				.from('OKS')
				.list('board_members_2025', {
					limit: 100,
					offset: 0
				});
			
			const imagePromises = boardMembers.map(async (member) => {
				try {
					const { data: signedUrlData, error: signedUrlError } = await supabase.storage
						.from('OKS')
						.createSignedUrl(`board_members_2025/${member.imageFile}`, 3600);
					
					if (signedUrlError) {
						return {
							id: member.id,
							url: null,
							success: false
						};
					}
					
					return {
						id: member.id,
						url: signedUrlData.signedUrl,
						success: true
					};
				} catch (error) {
					return {
						id: member.id,
						url: null,
						success: false
					};
				}
			});
			
			const imageResults = await Promise.all(imagePromises);
			
			boardMemberImages = imageResults.reduce((acc, result) => {
				acc[result.id] = result.url;
				return acc;
			}, {});
			
			imagesLoaded = true;
			
		} catch (error) {
			boardMemberImages = {};
			imagesLoaded = true;
		}
	}
	
	// Load web team images from Supabase Storage
	async function loadWebTeamImages() {
		try {
			const imagePromises = webTeamMembers.map(async (member) => {
				try {
					const { data: signedUrlData, error: signedUrlError } = await supabase.storage
						.from('OKS')
						.createSignedUrl(`web_development_team/${member.imageFile}`, 3600);
					
					if (signedUrlError) {
						return {
							id: member.id,
							url: null,
							success: false
						};
					}
					
					return {
						id: member.id,
						url: signedUrlData.signedUrl,
						success: true
					};
				} catch (error) {
					return {
						id: member.id,
						url: null,
						success: false
					};
				}
			});
			
			const imageResults = await Promise.all(imagePromises);
			
			webTeamImages = imageResults.reduce((acc, result) => {
				acc[result.id] = result.url;
				return acc;
			}, {});
			
			webTeamImagesLoaded = true;
			
		} catch (error) {
			webTeamImages = {};
			webTeamImagesLoaded = true;
		}
	}

	// Load past board member images from Supabase Storage
	async function loadPastMemberImages() {
		try {
			console.log('Loading past member images for:', pastMembers.length, 'members');
			
			// Only process members that have image files
			const membersWithImages = pastMembers.filter(member => member.image_file);
			console.log('Members with images:', membersWithImages.length);
			
			const imagePromises = membersWithImages.map(async (member) => {
				try {
					const { data: signedUrlData, error: signedUrlError } = await supabase.storage
						.from('OKS')
						.createSignedUrl(`past_board_members/${member.image_file}`, 3600);
					
					if (signedUrlError) {
						return {
							id: member.id,
							url: null,
							success: false
						};
					}
					
					return {
						id: member.id,
						url: signedUrlData.signedUrl,
						success: true
					};
				} catch (error) {
					return {
						id: member.id,
						url: null,
						success: false
					};
				}
			});
			
			const imageResults = await Promise.all(imagePromises);
			
			pastMemberImages = imageResults.reduce((acc, result) => {
				acc[result.id] = result.url;
				return acc;
			}, {});
			
			pastMemberImagesLoaded = true;
			
		} catch (error) {
			pastMemberImages = {};
			pastMemberImagesLoaded = true;
		}
	}

	onMount(() => {
		loadPastMembers();
		loadBoardMemberImages();
		loadWebTeamImages();
	});
</script>

<Navbar />
<Hero 
  page="About" 
  leftImage="/images/Hampi.png"
  rightImage="/images/OKSlogo.png"
  topLeftImage="/images/Yakshagana2.png"
  bottomRightImage="/images/disney-castle-sketch.png"
/>

<!-- About Content -->
<main class="container my-5">
	<div class="row">
		<div class="col-12">
			<h1 class="text-center mb-4">About Orlando Kannada Sangha</h1>
			<h2 class="text-center mb-4" style="font-family: 'Noto Sans Kannada', sans-serif; color: #7a1f1f;">ಒರ್ಲಾಂಡೊ ಕನ್ನಡ ಸಂಘದ ಬಗ್ಗೆ</h2>
		</div>
	</div>

						<!-- Community Section -->
			<div class="row">
				<div class="col-md-7">
					<!-- History Section - First Part (wraps around gallery) -->
					<div class="history-content">
						<div class="history-paragraph">
							<p><span class="highlight-date">September 2024</span> - Wherever you looked, there was a festive buzz. About <strong>500 Kannadigas</strong> packed the temple hall to watch Yakshagana, and the joy on everyone's faces was palpable. Seeing so many of our own together filled me with pride—and made me wonder: what was it like thirty or forty years ago?</p>
						</div>

						<div class="history-paragraph">
							<p>Back in the <span class="highlight-year">1990s</span>, for Kannadigas living in Orlando, simply hearing their mother tongue was rare. At that time, a single <em>"mailing list"</em> brought together those scattered across the city—an effort led by <strong>Sri Guruprasad, Sri Girish Budibetta, and Sri Badarish</strong>.</p>
						</div>

						<div class="history-paragraph">
							<p>In <span class="highlight-year">2000</span>, Orlando's Kannadigas held their first community picnic. The tradition continued annually, and in <span class="highlight-year">2004</span> the growing popularity of the Orlando Kannada Koota helped attract the <strong>AKKA Sammelana</strong>. With great enthusiasm, the community partnered with Tampa's Shrigandha Kannada Koota to make the event a success.</p>
						</div>

						<div class="history-paragraph">
							<p>As Kannada families flourished in Orlando, the Koota began hosting yearly cultural programs from <span class="highlight-year">2010</span> onward. A milestone came on <span class="highlight-date">August 24, 2012</span>, when <strong>Orlando Kannada Sangha Inc.</strong> was officially registered; with support from <strong>Sri Kiran Babaladi</strong> and team, it became a nonprofit in <span class="highlight-year">2015</span>.</p>
						</div>
					</div>
				</div>
				<div class="col-md-5">
					<div class="image-gallery">
						<div class="gallery-item large desktop-only">
							<img src="images/OKSlogo.png" alt="OKS Community" class="gallery-image">
						</div>
						<div class="gallery-item small desktop-only">
							<img src="images/Florida.png" alt="OKS Community" class="gallery-image">
						</div>
						<div class="gallery-item small">
							<img src="images/OKSlogo.png" alt="OKS Logo" class="gallery-image">
						</div>
						<div class="gallery-item small desktop-only">
							<img src="images/Kannada-Academy.png" alt="OKS Community" class="gallery-image">
						</div>
						<div class="gallery-item small desktop-only">
							<img src="images/Kannada-Academy.png" alt="OKS Community" class="gallery-image">
						</div>
						<div class="gallery-item small desktop-only">
							<img src="images/Yakshagana2.png" alt="OKS Community" class="gallery-image">
						</div>
					</div>
					<a href="/membership" class="btn btn-primary community-btn">
						<i class="fas fa-users me-2"></i>Join Our Community
					</a>
				</div>
			</div>

			<!-- History Section - Second Part (full width) -->
			<div class="row mt-4">
				<div class="col-12">
					<div class="history-content-full">

						<div class="history-paragraph">
							<p>Each year now begins with <em>Ugadi celebrations</em> and features events throughout—summer beach parties and a <em>Rajyotsava program</em> in November that showcases local talent. For children, under the leadership of <strong>Sri Pradeep Krishnamurthy, Smt. Vedashri Bhat, and Smt. Shyamala Purohit</strong>, the Sangha runs <strong>Kannada Kali School</strong>, supported by many volunteer teachers and helping students earn bilingual credit.</p>
						</div>

						<div class="history-paragraph">
							<p>The Sangha also invites artists from India to celebrate Kannada culture. Highlights include two <em>Yakshagana productions</em> and concerts by renowned singers <strong>Sri Vidyabhushana, Smt. B. R. Chaya, and Smt. Manjula Gururaj</strong>.</p>
						</div>

						<div class="history-paragraph">
							<p>True to its mission, the Sangha embraces every opportunity to bring Kannada families together, while contributing to social causes and nurturing a spirit of service among children. Thanks to the dedication of past and present office-bearers, the Orlando Kannada Sangha continues to grow—welcoming new faces at every gathering.</p>
						</div>

						<div class="history-paragraph">
							<p>In <span class="highlight-date">August 2025</span>, together with other Kannada associations across Florida, the Sangha helped organize the <strong>8th NAVIKA World Kannada Convention</strong>. Its resounding success further elevated the stature of the Orlando Kannada Sangha.</p>
						</div>

						<!-- Author Attribution for History Content -->
						<div class="history-author">
							<div class="author-divider-small"></div>
							<p class="history-author-text">
								<i class="fas fa-feather-alt me-2"></i>
								<em>— Mrs. Ranjani Somayaji</em>
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Present Board Members Section -->
			<div class="row mt-5">
				<div class="col-12">
					<h2 class="text-center mb-5 board-members-title">Present Board Members</h2>
					<div class="row">
						{#if imagesLoaded}
							{#each boardMembers as member}
								<div class="col-lg-3 col-md-6 mb-4">
									<div class="board-member-card">
										<div class="member-image">
											{#if boardMemberImages[member.id]}
												<img 
													src={boardMemberImages[member.id]} 
													alt={member.name} 
													class="member-img"
													loading="lazy"
												>
											{:else}
												<div class="image-placeholder">
													<i class="fas fa-user fa-3x text-muted"></i>
													<p class="text-muted small mt-2">Image not available</p>
												</div>
											{/if}
										</div>
										<div class="member-info">
											<h4 class="member-name">{member.name}</h4>
											<p class="member-position">{member.position}</p>
											<p class="member-year">{member.year}</p>
											<p class="member-description">{member.description}</p>
										</div>
									</div>
								</div>
							{/each}
						{:else}
							<!-- Loading state -->
							{#each Array(4) as _, index}
								<div class="col-lg-3 col-md-6 mb-4">
									<div class="board-member-card">
										<div class="member-image">
											<div class="member-img loading-placeholder">
												<i class="fas fa-spinner fa-spin"></i>
											</div>
										</div>
										<div class="member-info">
											<div class="loading-text"></div>
											<div class="loading-text-small"></div>
											<div class="loading-text-description"></div>
										</div>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- Past Board Members Section -->
			<div class="row mt-5">
				<div class="col-12">
					{#if pastMembersLoaded}
						<MemberSlider 
							members={pastMembers}
							title="Past Board Members"
							icon=""
							showYear={true}
							showPosition={true}
							useBoardTitleStyle={true}
							images={pastMemberImages}
							imagesLoaded={pastMemberImagesLoaded}
						/>
					{:else}
						<div class="loading-state">
							<i class="fas fa-spinner fa-spin"></i>
							<p>Loading past board members...</p>
						</div>
					{/if}
					
					<div class="text-center mt-4">
						<p class="text-muted">
							<i class="fas fa-history me-2"></i>
							We honor and appreciate the contributions of all past board members who have helped build our community.
						</p>
					</div>
				</div>
			</div>


			<!-- Web Development Team Section -->
			<!-- <div class="row mt-5">
				<div class="col-12">
					<h2 class="text-center mb-5 board-members-title">Web Development Team</h2>

					<div class="row justify-content-center">
						{#each webTeamMembers as member}
							<div class="col-lg-3 col-md-6 mb-4">
								<div class="board-member-card">
									<div class="member-image">
										{#if webTeamImagesLoaded && webTeamImages[member.id]}
											<img 
												src={webTeamImages[member.id]} 
												alt={member.name} 
												class="member-img"
												loading="lazy"
											>
										{:else}
											<div class="image-placeholder">
												<i class="fas fa-user fa-3x text-muted"></i>
												<p class="text-muted small mt-2">Image not available</p>
											</div>
										{/if}
									</div>
									<div class="member-info">
										<h4 class="member-name">{member.name}</h4>
										<p class="member-position">{member.position}</p>
										<p class="member-year">{member.year}</p>
										<p class="member-description">{member.description}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
			-->

</main>

<Footer />

<style>

	/* History Content Styles */
	.history-content {
		padding: 0;
	}

	.history-content-full {
		padding: 0 0 1rem 0;
	}

	.history-paragraph {
		margin-bottom: 1.2rem;
		transition: all 0.3s ease;
	}

	.history-paragraph:hover {
		transform: translateX(5px);
	}

	.history-paragraph:last-child {
		margin-bottom: 0;
	}

	.history-paragraph p {
		font-size: 1.15rem;
		line-height: 1.9;
		color: #2c3e50;
		text-align: justify;
		margin: 0;
		font-weight: 400;
		letter-spacing: 0.3px;
	}

	/* Text Highlighting Styles */
	.highlight-year {
		background: linear-gradient(120deg, #f26c4f 0%, #f26c4f 100%);
		background-repeat: no-repeat;
		background-size: 100% 0.2em;
		background-position: 0 88%;
		transition: background-size 0.25s ease-in;
		font-weight: 600;
		color: #7a1f1f;
		padding: 0 2px;
	}

	.highlight-year:hover {
		background-size: 100% 100%;
		color: white;
	}

	.highlight-date {
		background: linear-gradient(120deg, #7a1f1f 0%, #7a1f1f 100%);
		background-repeat: no-repeat;
		background-size: 100% 0.2em;
		background-position: 0 88%;
		transition: background-size 0.25s ease-in;
		font-weight: 600;
		color: #7a1f1f;
		padding: 0 2px;
	}

	.highlight-date:hover {
		background-size: 100% 100%;
		color: white;
	}

	.history-paragraph strong {
		color: #7a1f1f;
		font-weight: 700;
		text-shadow: 0 1px 2px rgba(122, 31, 31, 0.1);
	}

	.history-paragraph em {
		color: #f26c4f;
		font-style: italic;
		font-weight: 500;
	}

	/* Community Section Styles */

	.community-btn {
		background: linear-gradient(135deg, #7a1f1f 0%, #5a1515 100%);
		border: none;
		padding: 15px 30px;
		font-size: 1.1rem;
		font-weight: 600;
		border-radius: 30px;
		transition: all 0.3s ease;
		box-shadow: 0 8px 20px rgba(122, 31, 31, 0.3);
		width: 100%;
		margin: 0;
		margin-top: 12px;
	}

	.community-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 30px rgba(122, 31, 31, 0.4);
	}

	/* Image Gallery Styles */
	.image-gallery {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		grid-auto-rows: 115px;
		grid-auto-flow: dense;
		height: auto;
		min-height: 645px;
		padding: 0.8rem;
		max-width: 100%;
		/* overflow: hidden; */
	}

	.gallery-item {
		position: relative;
		overflow: hidden;
		transition: all 0.4s ease;
		background: transparent;
		border-radius: 20px;
		border: 1px solid rgba(122, 31, 31, 0.2);
	}

	.gallery-item:hover {
		transform: scale(1.001) translateY(-5px);
		z-index: 10;
	}

	.gallery-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: transform 0.4s ease;
		filter: brightness(0.9) drop-shadow(0 8px 25px rgba(0, 0, 0, 0.2)) drop-shadow(0 4px 15px rgba(122, 31, 31, 0.1));
	}

	.gallery-item:hover .gallery-image {
		transform: scale(1.1);
		filter: brightness(1.1) drop-shadow(0 15px 40px rgba(0, 0, 0, 0.3)) drop-shadow(0 8px 25px rgba(122, 31, 31, 0.2));
	}

	/* Unique border radius for each item - different on all sides */
	.gallery-item:nth-child(1) {
		grid-column: span 2;
		grid-row: span 3;
		border-radius: 40px 25px 35px 30px;
	}

	.gallery-item:nth-child(2) {
		grid-column: span 1;
		grid-row: span 1;
		border-radius: 30px 20px 25px 35px;
	}

	.gallery-item:nth-child(3) {
		grid-column: span 1;
		grid-row: span 2;
		border-radius: 35px 30px 40px 25px;
	}

	.gallery-item:nth-child(4) {
		grid-column: span 1;
		grid-row: span 1;
		border-radius: 25px 35px 30px 40px;
	}

	.gallery-item:nth-child(5) {
		grid-column: span 2;
		grid-row: span 2;
		border-radius: 30px 25px 35px 40px;
	}

	.gallery-item:nth-child(6) {
		grid-column: span 1;
		grid-row: span 1;
		border-radius: 35px 40px 25px 30px;
	}


	/* Responsive Design */
	@media (max-width: 768px) {
		.history-content {
			padding: 1rem 0;
		}

		.history-paragraph {
			margin-bottom: 1.5rem;
		}

		.history-paragraph p {
			font-size: 1rem;
			line-height: 1.7;
		}


		.desktop-only {
			display: none !important;
		}

		.image-gallery {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 200px;
			padding: 1rem;
		}

		.gallery-item {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.gallery-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		.board-members-title {
			font-size: 2rem;
			margin-bottom: 2rem;
		}

		.member-image {
			height: 200px;
		}

		.member-name {
			font-size: 1.2rem;
		}

		.member-position {
			font-size: 0.9rem;
		}

		.member-description {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 576px) {
		.image-gallery {
			height: 200px;
		}
	}

	/* Board Members Section Styles */
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

	.board-member-card {
		background: #fff;
		border-radius: 20px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: all 0.4s ease;
		height: 100%;
		border: 2px solid #f8a07a;
	}

	.board-member-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
		border-color: #7a1f1f;
	}

	.member-image {
		position: relative;
		overflow: hidden;
		height: 300px;
	}

	.member-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
		filter: brightness(0.9);
	}

	.board-member-card:hover .member-img {
		transform: scale(1.1);
		filter: brightness(1.1);
	}

	.image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f9fa;
		border: 2px dashed #dee2e6;
		border-radius: 15px;
		color: #6c757d;
	}

	.member-info {
		padding: 1.5rem;
		text-align: center;
	}

	.member-name {
		font-size: 1.3rem;
		font-weight: 700;
		color: #7a1f1f;
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.member-position {
		font-size: 1rem;
		font-weight: 600;
		color: #f26c4f;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.member-year {
		font-size: 0.9rem;
		font-weight: 700;
		color: #7a1f1f;
		margin-bottom: 1rem;
		background: rgba(122, 31, 31, 0.1);
		padding: 0.3rem 0.8rem;
		border-radius: 15px;
		display: inline-block;
		border: 1px solid rgba(122, 31, 31, 0.2);
	}

	.member-description {
		font-size: 0.95rem;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	/* Loading state for all components */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		width: 100%;
		color: #6c757d;
		text-align: center;
		padding: 2rem;
	}

	.loading-state i {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.loading-state p {
		margin: 0;
		font-size: 0.9rem;
	}

	/* Loading Placeholder Styles */
	.loading-placeholder {
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		font-size: 1.5rem;
	}

	@keyframes loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.loading-text {
		height: 1.3rem;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
		margin-bottom: 0.5rem;
		width: 80%;
		margin-left: auto;
		margin-right: auto;
	}


	/* History Author Styles */
	.history-author {
		text-align: right;
		margin-top: 1rem;
		padding-top: 0.5rem;
	}

	.author-divider-small {
		height: 1px;
		background: linear-gradient(90deg, transparent 0%, #7a1f1f 70%, transparent 100%);
		margin: 0.5rem 0;
		width: 150px;
		margin-left: auto;
		border-radius: 0.5px;
	}

	.history-author-text {
		font-size: 1rem;
		color: #7a1f1f;
		margin-bottom: 0;
		font-style: italic;
		font-weight: 500;
	}

	.history-author-text i {
		color: #7a1f1f;
		opacity: 0.8;
	}

	.loading-text-small {
		height: 1rem;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
		margin-bottom: 1rem;
		width: 60%;
		margin-left: auto;
		margin-right: auto;
	}

	.loading-text-description {
		height: 0.95rem;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
		width: 90%;
		margin-left: auto;
		margin-right: auto;
	}
</style> 