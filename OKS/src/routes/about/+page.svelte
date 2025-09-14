<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Navbar />
<Hero 
  page="About Page" 
  leftImage="/images/NASA.svg"
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

						<!-- Community Section -->
			<div class="row">
				<div class="col-md-7">
					<!-- History Section - First Part (wraps around gallery) -->
					<div class="history-content">
						<div class="history-paragraph">
							<p>In September 2024, wherever you looked there was a crowd of people; the temple hall was packed with around <strong>500 Kannadigas</strong> who had come to watch the Yakshagana performance. Everyone there was enjoying the program. Seeing this filled my heart with great joy. So many people! And especially seeing our Kannadigas united together made me very happy. It made me wonder—had it been about thirty or forty years since this last happened?</p>
						</div>

						<div class="history-paragraph">
							<p>In the <span class="highlight-year">1990s</span>, it became rare for Kannadigas living in Orlando, away from their native land, to hear their mother tongue. At that time, scattered Kannadigas from here and there came together to create a <em>"mailing list."</em> This effort was initiated by <strong>Mr. Guruprasad, Mr. Girish Budibetta, and Mr. Badarish</strong>.</p>
						</div>

						<div class="history-paragraph">
							<p>In <span class="highlight-year">2000</span>, Orlando hosted its first Kannadiga picnic. Since then, this united picnic has been held every year. In <span class="highlight-year">2004</span>, the popularity of the Orlando Kannada Koota reached the point where it hosted the <strong>Akhila Bharatiya Kannada Sammelana</strong>. Orlando Kannadigas enthusiastically joined hands with the Shrigandha Kannada Koota to make the event a success.</p>
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
					<button class="btn btn-primary community-btn">
						<i class="fas fa-users me-2"></i>Join Our Community
					</button>
				</div>
			</div>

			<!-- History Section - Second Part (full width) -->
			<div class="row mt-4">
				<div class="col-12">
					<div class="history-content-full">
						<div class="history-paragraph">
							<p>As the Kannada families in Orlando grew, from <span class="highlight-year">2010</span> onward the Kannada Koota began organizing annual cultural programs. <span class="highlight-date">August 24, 2012</span>, was a landmark day, when the <strong>"Orlando Kannada Sangha Inc."</strong> was officially registered. With the support of <strong>Mr. Kiran Babaladi</strong> and his team, it became a non-profit organization in <span class="highlight-year">2015</span>.</p>
						</div>

						<div class="history-paragraph">
							<p>Every year, starting with the <em>Yugadi celebration</em>, the Sangha organizes various programs throughout the year. In summer, there is a <em>beach party</em>, and in November during <em>Rajyotsava</em>, Kannadigas get a chance to showcase their talents.</p>
						</div>

						<div class="history-paragraph">
							<p>For our children, under the guidance of <strong>Mr. Pradeep Krishnamurthy, Mrs. Vedashree Bhat, and Mrs. Shyamala Purohit</strong>, the Sangha runs the <strong>"Kannada Kali"</strong> school to teach Kannada. Many dedicated volunteer teachers conduct the classes, and the school helps children earn bilingual credits.</p>
						</div>

						<div class="history-paragraph">
							<p>In addition, artists from India are invited to showcase Kannada culture. There have been two <em>Yakshagana performances</em> and concerts by some of the finest Kannada singers such as <strong>Vidyabhushan, B. R. Chaya, and Manjula Gururaj</strong>.</p>
						</div>

						<div class="history-paragraph">
							<p>The Kannada Sangha never misses an opportunity to bring Kannada families together. It also carries out various community service activities according to need, and makes children aware of these efforts.</p>
						</div>

						<div class="history-paragraph">
							<p>Thanks to the hard work of all past and current office bearers who have taken on the responsibilities of the Sangha, the Orlando Kannada Sangha has been growing, welcoming new faces at every gathering. This year, <strong>"Navika,"</strong> a Kannada festival, is being planned in collaboration with other Kannada associations in Florida.</p>
						</div>
						
						<div class="author-section">
							<p class="author-text">
								<em>— Written by Mrs. Ranjini Somayaji</em>
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
						<div class="col-lg-3 col-md-6 mb-4">
							<div class="board-member-card">
								<div class="member-image">
									<img src="https://picsum.photos/300/300?random=10" alt="Board Member 1" class="member-img">
								</div>
								<div class="member-info">
									<h4 class="member-name">Mr. Venugopal Kulkarni</h4>
									<p class="member-position">President</p>
									<p class="member-description">Leading the organization with dedication and vision for Kannada culture preservation.</p>
								</div>
							</div>
						</div>
						<div class="col-lg-3 col-md-6 mb-4">
							<div class="board-member-card">
								<div class="member-image">
									<img src="https://picsum.photos/300/300?random=11" alt="Board Member 2" class="member-img">
								</div>
								<div class="member-info">
									<h4 class="member-name">Mr. Vishwa</h4>
									<p class="member-position">Vice President</p>
									<p class="member-description">Supporting cultural initiatives and community engagement programs.</p>
								</div>
							</div>
						</div>
						<div class="col-lg-3 col-md-6 mb-4">
							<div class="board-member-card">
								<div class="member-image">
									<img src="https://picsum.photos/300/300?random=12" alt="Board Member 3" class="member-img">
								</div>
								<div class="member-info">
									<h4 class="member-name">Mrs. Supreeta Bolar</h4>
									<p class="member-position">Secretary</p>
									<p class="member-description">Managing organizational communications and event coordination.</p>
								</div>
							</div>
						</div>
						<div class="col-lg-3 col-md-6 mb-4">
							<div class="board-member-card">
								<div class="member-image">
									<img src="https://picsum.photos/300/300?random=13" alt="Board Member 4" class="member-img">
								</div>
								<div class="member-info">
									<h4 class="member-name">Mrs. Sindhu Raju</h4>
									<p class="member-position">Treasurer</p>
									<p class="member-description">Overseeing financial management and resource allocation.</p>
								</div>
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

	/* History Content Styles */
	.history-content {
		padding: 0;
	}

	.history-content-full {
		padding: 0 0 1rem 0;
	}

	.history-paragraph {
		margin-bottom: 2rem;
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
	.community-heading {
		font-size: 2.2rem;
		font-weight: 700;
		color: #333;
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	.community-text {
		font-size: 1.1rem;
		color: #666;
		line-height: 1.7;
		margin-bottom: 2rem;
	}

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
		grid-auto-rows: 100px;
		grid-auto-flow: dense;
		height: auto;
		min-height: 450px;
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

		.community-heading {
			font-size: 1.8rem;
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
		height: 250px;
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
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.member-description {
		font-size: 0.95rem;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	/* Author Section Styles */
	.author-section {
		margin-top: 1rem;
		padding-top: 0.5rem;
		text-align: right;
	}

	.author-text {
		font-size: 1.1rem;
		color: #7a1f1f;
		font-style: italic;
		margin: 0;
		font-weight: 500;
	}
</style> 