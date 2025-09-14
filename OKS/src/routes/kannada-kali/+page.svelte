<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Navbar />
<Hero 
  page="Kannada Kali Page" 
  leftImage="/images/Da_ra_bendre.png"
  rightImage="/images/Yakshagana2.png"
  topLeftImage="/images/Kannada-Academy.png"
  bottomRightImage="/images/mysore-palace-vector.svg"
/>

<!-- Kannada Kali Content -->
<main class="container my-5">
	<div class="row">
		<div class="col-12">
			<h1 class="text-center mb-4">Kannada Kali</h1>
			<h2 class="kannada-title text-center mb-4">ಕನ್ನಡ ಕಲಿ</h2>
			<div class="row">
				<div>
					<h3>Kannada Kali 2024 – 25 Registration</h3>
					<div class="registration-info">
						<div class="alert alert-info">
							<h5><i class="fas fa-calendar-check me-2"></i>Classes Starting on Sunday, August 17th 2024</h5>
							<p><i class="fas fa-info-circle me-2"></i>Information session on class details will be on Aug 11th 2024.</p>
							<p><i class="fas fa-map-marker-alt me-2"></i>Location: Online via Google Meet.</p>
						</div>

						<h5>Highlights:</h5>
						<ul class="highlights-list">
							<li><i class="fas fa-laptop me-2"></i>Classes are online.</li>
							<li><i class="fas fa-book-open me-2"></i>Fun activities like storytelling will be part of class.</li>
							<li><i class="fas fa-users me-2"></i>Interactive classes to keep the kids engaged.</li>
							<li><i class="fas fa-book me-2"></i>Textbooks are available online. A copy can be purchased.</li>
						</ul>

						<h5>Pricing:</h5>
						<div class="pricing-table">
							<div class="row">
								<div class="col-md-6">
									<div class="card">
										<div class="card-header">
											<h6><i class="fas fa-user-friends me-2"></i>OKS Members</h6>
										</div>
										<div class="card-body">
											<p class="mb-1">$75 for one kid</p>
											<p class="mb-0">$120 for 2 kids (same family)</p>
										</div>
									</div>
								</div>
								<div class="col-md-6">
									<div class="card">
										<div class="card-header">
											<h6><i class="fas fa-user me-2"></i>Non Members</h6>
										</div>
										<div class="card-body">
											<p class="mb-1">$90 for one kid</p>
											<p class="mb-0">$150 for 2 kids (same family)</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="textbook-info">
							<h6><i class="fas fa-book me-2"></i>Textbooks: $15 each</h6>
							<p class="text-justify">Textbooks are highly recommended. If ordering, please include the cost of textbook in your payment. eg, For 1 OKS Member child with textbook $75 + $15 = $90.</p>
						</div>

						<div class="deadline-info">
							<div class="alert alert-warning">
								<h6><i class="fas fa-clock me-2"></i>Registration and Payment deadline: Jul 30th 2024.</h6>
								<p class="mb-0">No date extension. This will give us time to organize classes, teachers and order textbooks. Thank you.</p>
							</div>
						</div>

                        <h5 class="mt-4">REGISTRATION AND PAYMENT DETAILS</h5>
						<div class="registration-options">
							<div class="card mb-3">
								<div class="card-body">
									<h6 class="card-title"><i class="fas fa-credit-card me-2"></i>Online Registration</h6>
									<a href="#" class="btn btn-primary">Click here to Register and Pay Now</a>
								</div>
							</div>
							
							<div class="card mb-3">
								<div class="card-body">
									<h6 class="card-title"><i class="fas fa-envelope me-2"></i>Mail Check to:</h6>
									<p class="mb-1">Orlando Kannada Sangha</p>
									<p class="mb-0">1539 Katie Cove</p>
									<p class="mb-0">Sanford FL 32771</p>
								</div>
							</div>
						</div>

						<h5>Student Requirements</h5>
						<ul class="requirements-list">
							<li>Students should be able to sit for an hour at the computer without parents by their side.</li>
							<li>Students must have a computer with working video and audio. Video must be on during class.</li>
							<li>Students need to be on time to the class.</li>
							<li>Students must be able to complete assignments within a week of assigning. Homework assistance is offered during the week.</li>
							<li>For any missed classes, parents or students need to reach out to the teacher during the week about the covered material and make up the missed class.</li>
							<li>Teachers, admins, volunteers are here to help kids learn and have a successful year with active parents support.</li>
						</ul>

						<div class="contact-info">
							<div class="alert alert-success">
								<h6><i class="fas fa-envelope me-2"></i>For additional information, please contact:</h6>
								<p class="mb-0">Email: <a href="mailto:okskannadakali@gmail.com">okskannadakali@gmail.com</a></p>
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





	.kannada-title {
		color: #8a4b4b;
		font-size: 2.5rem;
		font-weight: 500;
		margin: 0;
		font-family: 'Noto Sans Kannada', Arial, sans-serif;
	}
	
	.contact-info p {
		margin-bottom: 0.5rem;
	}

	.registration-info {
		margin-top: 2rem;
	}

	.highlights-list, .requirements-list {
		list-style: none;
		padding-left: 0;
	}

	.highlights-list li, .requirements-list li {
		margin-bottom: 0.5rem;
		padding-left: 1.5rem;
		position: relative;
	}

	.highlights-list li:before, .requirements-list li:before {
		content: "•";
		color: #7a1f1f;
		font-weight: bold;
		position: absolute;
		left: 0;
	}

	.registration-options .card {
		border: 2px solid #7a1f1f;
		border-radius: 10px;
	}

	.pricing-table .card {
		border: 2px solid #7a1f1f;
		border-radius: 10px;
		margin-bottom: 1rem;
	}

	.pricing-table .card-header {
		background-color: #7a1f1f;
		color: white;
		border-radius: 8px 8px 0 0;
	}

	.textbook-info {
		background-color: #f8f9fa;
		padding: 1rem;
		border-radius: 10px;
		border-left: 4px solid #7a1f1f;
		margin: 1rem 0;
	}

	.deadline-info .alert {
		border-left: 4px solid #ffc107;
	}

	.contact-info .alert {
		border-left: 4px solid #28a745;
	}


</style> 