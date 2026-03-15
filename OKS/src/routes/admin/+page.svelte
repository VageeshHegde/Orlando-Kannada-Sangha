<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { onMount } from 'svelte';
	import { getMemberInitial, getAvatarColor } from '$lib/utils/avatarUtils.js';
	import { supabase } from '$lib/supabase.js';
	import { base } from '$app/paths';
	import { getAccessToken } from '$lib/stores/auth.js';

	const authApiUrl = `${base}/api/auth`.replace(/\/+/g, '/');

	/** Headers for admin API calls (includes Bearer token). Use for GET and POST. */
	function authApiHeaders(includeContentType = true) {
		const token = getAccessToken();
		return {
			...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
			...(token ? { Authorization: `Bearer ${token}` } : {})
		};
	}

	// ===========================================
	// COMPONENT STATE VARIABLES
	// ===========================================
	
	// Member Count Dashboard
	let memberCount = {
		confirmedUsers: 0,
		totalUsers: 0,
		pastMembers: 0,
		lifetimeMembers: 0
	};
	let memberCountLoading = true;
	let memberCountError = '';

	// Current Members Management
	let allMembers = [];
	let membersLoading = false;
	let membersError = '';
	let currentPage = 1;
	let itemsPerPage = '10';
	let totalPages = 0;
	let searchQuery = '';
	let filteredMembers = [];

	// Past Board Members Management
	let pastMembers = [];
	let pastMembersLoading = false;
	let pastMembersError = '';
	let pastMemberSearchQuery = '';
	let pastMemberFilterBy = 'all';
	let filteredPastMembers = [];
	let pastMemberCurrentPage = 1;
	let pastMemberItemsPerPage = '10';
	let pastMemberTotalPages = 0;

	// Lifetime Members Management
	let lifetimeMembers = [];
	let lifetimeMembersLoading = false;
	let lifetimeMembersError = '';
	let lifetimeMemberSearchQuery = '';
	let filteredLifetimeMembers = [];
	let lifetimeMemberCurrentPage = 1;
	let lifetimeMemberItemsPerPage = '10';
	let lifetimeMemberTotalPages = 0;

	// CSV Bulk Upload
	let selectedFile = null;
	let isProcessing = false;
	let progress = 0;
	let results = null;
	let errors = [];
	let successMessage = '';
	let errorMessage = '';

	// Single User Creation
	let singleUser = {
		email: '',
		first_name: '',
		last_name: ''
	};
	let isCreatingUser = false;
	let singleUserError = '';
	let singleUserSuccess = '';

	// Lifetime Member Creation
	let lifetimeMember = {
		email: '',
		name: '',
		tag_line: '',
		image_file: ''
	};
	let isCreatingLifetimeMember = false;
	let lifetimeMemberError = '';
	let lifetimeMemberSuccess = '';

	// Past Member Creation
	let pastMember = {
		name: '',
		position: '',
		year: '',
		image_file: ''
	};
	let isCreatingPastMember = false;
	let pastMemberError = '';
	let pastMemberSuccess = '';

	// Sponsors Management
	let sponsors = [];
	let sponsorsLoading = false;
	let sponsorsError = '';
	let sponsorSearchQuery = '';
	let filteredSponsors = [];
	let sponsorCurrentPage = 1;
	let sponsorItemsPerPage = '10';
	let sponsorTotalPages = 0;

	// Sponsor Creation
	let sponsor = {
		name: '',
		company: '',
		logo_file: '',
		website: ''
	};
	let isCreatingSponsor = false;
	let sponsorError = '';
	let sponsorSuccess = '';

	// ===========================================
	// API FUNCTIONS - DATA LOADING
	// ===========================================
	
	// Load member count
	async function loadMemberCount() {
		try {
			memberCountLoading = true;
			memberCountError = '';

			// Fetch member count from auth API
			const response = await fetch(authApiUrl, {
				method: 'POST',
				headers: authApiHeaders(),
				body: JSON.stringify({ action: 'get_member_count' })
			});

			if (!response.ok) {
				throw new Error('Failed to fetch member count');
			}

			const data = await response.json();
			memberCount = data;

			// Fetch past members count
			try {
				const pastMembersResponse = await fetch('/api/past-members', {
					headers: authApiHeaders(false)
				});
				if (pastMembersResponse.ok) {
					const pastMembersData = await pastMembersResponse.json();
					memberCount.pastMembers = pastMembersData.total || 0;
				}
			} catch (error) {
				console.error('Error fetching past members count:', error);
				memberCount.pastMembers = 0;
			}

			// Fetch lifetime members count
			try {
				const lifetimeMembersResponse = await fetch('/api/lifetime-members', {
					headers: authApiHeaders(false)
				});
				if (lifetimeMembersResponse.ok) {
					const lifetimeMembersData = await lifetimeMembersResponse.json();
					memberCount.lifetimeMembers = lifetimeMembersData.total || 0;
				} else {
					// If table doesn't exist, set to 0
					memberCount.lifetimeMembers = 0;
				}
			} catch (error) {
				console.error('Error fetching lifetime members count:', error);
				memberCount.lifetimeMembers = 0;
			}

		} catch (error) {
			console.error('Error loading member count:', error);
			memberCountError = 'Failed to load member count';
		} finally {
			memberCountLoading = false;
		}
	}

	// Load all members
	async function loadAllMembers() {
		try {
			membersLoading = true;
			membersError = '';

			const response = await fetch(authApiUrl, {
				method: 'POST',
				headers: authApiHeaders(),
				body: JSON.stringify({ action: 'get_all_members' })
			});

			if (!response.ok) {
				throw new Error('Failed to fetch members');
			}

			const data = await response.json();
			allMembers = data.members || [];
			filterMembers();

		} catch (error) {
			console.error('Error loading members:', error);
			membersError = 'Failed to load members';
		} finally {
			membersLoading = false;
		}
	}

	// Filter members based on search query
	function filterMembers() {
		if (!searchQuery.trim()) {
			filteredMembers = [...allMembers];
		} else {
			const query = searchQuery.toLowerCase();
			filteredMembers = allMembers.filter(member => 
				member.first_name?.toLowerCase().includes(query) ||
				member.last_name?.toLowerCase().includes(query) ||
				member.email?.toLowerCase().includes(query)
			);
		}
		updatePagination();
	}

	// Update pagination
	function updatePagination() {
		totalPages = Math.ceil(filteredMembers.length / parseInt(itemsPerPage));
		if (currentPage > totalPages) {
			currentPage = Math.max(1, totalPages);
		}
	}

	// Get paginated members
	$: paginatedMembers = filteredMembers.slice(
		(currentPage - 1) * parseInt(itemsPerPage),
		currentPage * parseInt(itemsPerPage)
	);

	// Pagination functions
	function goToPage(page) {
		currentPage = Math.max(1, Math.min(page, totalPages));
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function changeItemsPerPage() {
		currentPage = 1;
		updatePagination();
	}

	// CSV file handling
	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file && file.type === 'text/csv') {
			selectedFile = file;
			clearMessages();
		} else {
			errorMessage = 'Please select a valid CSV file';
		}
	}

	function clearFile() {
		selectedFile = null;
		results = null;
		errors = [];
		clearMessages();
	}

	async function processFile() {
		if (!selectedFile) return;

		try {
		isProcessing = true;
			progress = 0;
			clearMessages();

			const text = await selectedFile.text();
			const lines = text.split('\n').filter(line => line.trim());
			const headers = lines[0].split(',').map(h => h.trim());
			
			// Validate headers
			const requiredHeaders = ['email', 'first_name', 'last_name'];
			const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
			
			if (missingHeaders.length > 0) {
				throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
			}

			const users = [];
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].split(',').map(v => v.trim());
				if (values.length >= 3) {
					users.push({
						email: values[0],
						first_name: values[1],
						last_name: values[2]
					});
				}
				progress = Math.round((i / (lines.length - 1)) * 100);
			}

			// Send to API
			const response = await fetch(authApiUrl, {
				method: 'POST',
				headers: authApiHeaders(),
				body: JSON.stringify({ 
					action: 'bulk_create_users',
					users: users
				})
			});

			const data = await response.json();
			results = data;
			
			if (data.successful && data.successful.length > 0) {
				successMessage = `Successfully created ${data.successful.length} users`;
			}
			if (data.failed && data.failed.length > 0) {
				errors = data.failed;
			}

		} catch (error) {
			console.error('Error processing file:', error);
			errorMessage = error.message || 'Failed to process file';
		} finally {
			isProcessing = false;
		}
	}

	function downloadTemplate() {
		const csvContent = 'email,first_name,last_name\njohn@example.com,John,Doe\njane@example.com,Jane,Smith';
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'user_template.csv';
		a.click();
		window.URL.revokeObjectURL(url);
	}

	// Single user creation
	async function createSingleUser() {
		if (!singleUser.email || !singleUser.first_name || !singleUser.last_name) {
			singleUserError = 'All fields are required';
			return;
		}

		try {
			isCreatingUser = true;
			singleUserError = '';
			singleUserSuccess = '';

			const response = await fetch(authApiUrl, {
				method: 'POST',
				headers: authApiHeaders(),
				body: JSON.stringify({ 
					action: 'bulk_create_users',
					users: [singleUser]
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			
			if (data.successful && data.successful.length > 0) {
				singleUserSuccess = 'User created successfully';
				singleUser = { email: '', first_name: '', last_name: '' };
				loadMemberCount(); // Refresh counts
			} else if (data.failed && data.failed.length > 0) {
				singleUserError = data.failed[0].error;
			} else {
				singleUserError = 'Failed to create user';
			}

		} catch (error) {
			console.error('Error creating user:', error);
			singleUserError = error.message || 'Failed to create user';
		} finally {
			isCreatingUser = false;
		}
	}

	function clearSingleUserMessages() {
		singleUserError = '';
		singleUserSuccess = '';
	}

	function clearMessages() {
		successMessage = '';
		errorMessage = '';
		errors = [];
	}

	// Calculate member duration (same as Navbar component)
	function getMembershipDuration(createdAt) {
		if (!createdAt) return null;
		
		const createdDate = new Date(createdAt);
		const now = new Date();
		const diffTime = Math.abs(now - createdDate);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const diffYears = Math.floor(diffDays / 365);
		const diffMonths = Math.floor((diffDays % 365) / 30);
		const diffWeeks = Math.floor((diffDays % 30) / 7);
		
		if (diffYears > 0) {
			return diffYears === 1 ? '1 year' : `${diffYears} years`;
		} else if (diffMonths > 0) {
			return diffMonths === 1 ? '1 month' : `${diffMonths} months`;
		} else if (diffWeeks > 0) {
			return diffWeeks === 1 ? '1 week' : `${diffWeeks} weeks`;
		} else {
			return diffDays === 1 ? '1 day' : `${diffDays} days`;
		}
	}

	// ===========================================
	// LIFETIME MEMBER CREATION FUNCTIONS
	// ===========================================
	
	// Create lifetime member
	async function createLifetimeMember() {
		if (!lifetimeMember.email || !lifetimeMember.name || !lifetimeMember.tag_line) {
			lifetimeMemberError = 'Email, name and tag line are required';
			return;
		}

		try {
			isCreatingLifetimeMember = true;
			lifetimeMemberError = '';
			lifetimeMemberSuccess = '';

			const response = await fetch('/api/lifetime-members', {
				method: 'POST',
				headers: authApiHeaders(),
				body: JSON.stringify(lifetimeMember)
			});

			if (!response.ok) {
				throw new Error('Failed to create lifetime member');
			}

			lifetimeMemberSuccess = 'Lifetime member created successfully!';
			lifetimeMember = { email: '', name: '', tag_line: '', image_file: '' };
			loadLifetimeMembers(); // Refresh the list
			loadMemberCount(); // Refresh the count

		} catch (error) {
			console.error('Error creating lifetime member:', error);
			lifetimeMemberError = 'Failed to create lifetime member';
		} finally {
			isCreatingLifetimeMember = false;
		}
	}

	// ===========================================
	// PAST MEMBER CREATION FUNCTIONS
	// ===========================================
	
	// Create past member
	async function createPastMember() {
		if (!pastMember.name || !pastMember.position || !pastMember.year) {
			pastMemberError = 'Name, position, and year are required';
			return;
		}

		try {
			isCreatingPastMember = true;
			pastMemberError = '';
			pastMemberSuccess = '';

			const response = await fetch('/api/past-members', {
				method: 'POST',
				headers: authApiHeaders(),
				body: JSON.stringify(pastMember)
			});

			if (!response.ok) {
				throw new Error('Failed to create past member');
			}

			pastMemberSuccess = 'Past member created successfully!';
			pastMember = { name: '', position: '', year: '', image_file: '' };
			loadPastMembers(); // Refresh the list
			loadMemberCount(); // Refresh the count

		} catch (error) {
			console.error('Error creating past member:', error);
			pastMemberError = 'Failed to create past member';
		} finally {
			isCreatingPastMember = false;
		}
	}

	// Load past board members
	async function loadPastMembers() {
		try {
			pastMembersLoading = true;
			pastMembersError = '';

			const response = await fetch('/api/past-members', {
				headers: authApiHeaders(false)
			});

			if (!response.ok) {
				throw new Error('Failed to fetch past members');
			}

			const data = await response.json();
			pastMembers = data.members || [];
			filterPastMembers();

		} catch (error) {
			console.error('Error loading past members:', error);
			pastMembersError = 'Failed to load past members';
		} finally {
			pastMembersLoading = false;
		}
	}

	// Filter past members based on search query and filter criteria
	function filterPastMembers() {
		let filtered = [...pastMembers];

		// Apply search filter
		if (pastMemberSearchQuery.trim()) {
			const query = pastMemberSearchQuery.toLowerCase();
			filtered = filtered.filter(member => 
				member.name?.toLowerCase().includes(query) ||
				member.position?.toLowerCase().includes(query) ||
				member.year?.toString().includes(query)
			);
		}

		// Apply category filter
		if (pastMemberFilterBy !== 'all') {
			filtered = filtered.filter(member => {
				const position = member.position?.toLowerCase() || '';
				switch (pastMemberFilterBy) {
					case 'president':
						return position === 'former president' || position.startsWith('former president ') || position.endsWith('former president');
					case 'vice-president':
						return position.includes('former vice president') || position.includes('former vice-president') || position.startsWith('former vice president');
					case 'secretary':
						return position.includes('former secretary');
					case 'treasurer':
						return position.includes('former treasurer');
					case 'recent':
						return member.year >= 2020;
					case 'older':
						return member.year < 2020;
					default:
						return true;
				}
			});
		}

		filteredPastMembers = filtered;
		updatePastMemberPagination();
	}

	// Update past member pagination
	function updatePastMemberPagination() {
		pastMemberTotalPages = Math.ceil(filteredPastMembers.length / parseInt(pastMemberItemsPerPage));
		if (pastMemberCurrentPage > pastMemberTotalPages) {
			pastMemberCurrentPage = Math.max(1, pastMemberTotalPages);
		}
	}

	// Get paginated past members
	$: paginatedPastMembers = filteredPastMembers.slice(
		(pastMemberCurrentPage - 1) * parseInt(pastMemberItemsPerPage),
		pastMemberCurrentPage * parseInt(pastMemberItemsPerPage)
	);

	// Past member pagination functions
	function goToPastMemberPage(page) {
		pastMemberCurrentPage = Math.max(1, Math.min(page, pastMemberTotalPages));
	}

	function nextPastMemberPage() {
		if (pastMemberCurrentPage < pastMemberTotalPages) {
			pastMemberCurrentPage++;
		}
	}

	function prevPastMemberPage() {
		if (pastMemberCurrentPage > 1) {
			pastMemberCurrentPage--;
		}
	}

	function changePastMemberItemsPerPage() {
		pastMemberCurrentPage = 1;
		updatePastMemberPagination();
	}

	// Load lifetime members
	async function loadLifetimeMembers() {
		try {
			lifetimeMembersLoading = true;
			lifetimeMembersError = '';

			const response = await fetch('/api/lifetime-members', {
				headers: authApiHeaders(false)
			});

			if (!response.ok) {
				throw new Error('Failed to fetch lifetime members');
			}

			const data = await response.json();
			lifetimeMembers = data.members || [];
			filterLifetimeMembers();

		} catch (error) {
			console.error('Error loading lifetime members:', error);
			lifetimeMembersError = 'Failed to load lifetime members';
		} finally {
			lifetimeMembersLoading = false;
		}
	}

	// Filter lifetime members based on search query
	function filterLifetimeMembers() {
		let filtered = [...lifetimeMembers];

		// Apply search filter
		if (lifetimeMemberSearchQuery.trim()) {
			const query = lifetimeMemberSearchQuery.toLowerCase();
			filtered = filtered.filter(member => 
				member.name?.toLowerCase().includes(query) ||
				member.position?.toLowerCase().includes(query)
			);
		}

		filteredLifetimeMembers = filtered;
		updateLifetimeMemberPagination();
	}

	// Update lifetime member pagination
	function updateLifetimeMemberPagination() {
		lifetimeMemberTotalPages = Math.ceil(filteredLifetimeMembers.length / parseInt(lifetimeMemberItemsPerPage));
		lifetimeMemberCurrentPage = Math.min(lifetimeMemberCurrentPage, Math.max(1, lifetimeMemberTotalPages));
	}

	// Lifetime member pagination functions
	function goToLifetimeMemberPage(page) {
		lifetimeMemberCurrentPage = Math.max(1, Math.min(page, lifetimeMemberTotalPages));
	}

	function nextLifetimeMemberPage() {
		if (lifetimeMemberCurrentPage < lifetimeMemberTotalPages) {
			lifetimeMemberCurrentPage++;
		}
	}

	function prevLifetimeMemberPage() {
		if (lifetimeMemberCurrentPage > 1) {
			lifetimeMemberCurrentPage--;
		}
	}

	function changeLifetimeMemberItemsPerPage() {
		lifetimeMemberCurrentPage = 1;
		updateLifetimeMemberPagination();
	}

	// ===========================================
	// SPONSORS MANAGEMENT FUNCTIONS
	// ===========================================
	
	// Load sponsors
	async function loadSponsors() {
		try {
			sponsorsLoading = true;
			sponsorsError = '';

			const response = await fetch('/api/sponsors', {
				headers: authApiHeaders(false)
			});

			if (!response.ok) {
				throw new Error('Failed to fetch sponsors');
			}

			const data = await response.json();
			sponsors = data.sponsors || [];
			filterSponsors();

		} catch (error) {
			console.error('Error loading sponsors:', error);
			sponsorsError = 'Failed to load sponsors';
		} finally {
			sponsorsLoading = false;
		}
	}

	// Filter sponsors based on search query
	function filterSponsors() {
		let filtered = [...sponsors];

		// Apply search filter
		if (sponsorSearchQuery.trim()) {
			const query = sponsorSearchQuery.toLowerCase();
			filtered = filtered.filter(sponsor => 
				sponsor.name?.toLowerCase().includes(query) ||
				sponsor.company?.toLowerCase().includes(query)
			);
		}

		filteredSponsors = filtered;
		updateSponsorPagination();
	}

	// Update sponsor pagination
	function updateSponsorPagination() {
		sponsorTotalPages = Math.ceil(filteredSponsors.length / parseInt(sponsorItemsPerPage));
		sponsorCurrentPage = Math.min(sponsorCurrentPage, Math.max(1, sponsorTotalPages));
	}

	// Get paginated sponsors
	$: paginatedSponsors = filteredSponsors.slice(
		(sponsorCurrentPage - 1) * parseInt(sponsorItemsPerPage),
		sponsorCurrentPage * parseInt(sponsorItemsPerPage)
	);

	// Sponsor pagination functions
	function goToSponsorPage(page) {
		sponsorCurrentPage = Math.max(1, Math.min(page, sponsorTotalPages));
	}

	function nextSponsorPage() {
		if (sponsorCurrentPage < sponsorTotalPages) {
			sponsorCurrentPage++;
		}
	}

	function prevSponsorPage() {
		if (sponsorCurrentPage > 1) {
			sponsorCurrentPage--;
		}
	}

	function changeSponsorItemsPerPage() {
		sponsorCurrentPage = 1;
		updateSponsorPagination();
	}

	// Delete handlers (confirm then call API and refresh)
	async function deleteMember(member) {
		if (!confirm(`Remove member ${member.first_name} ${member.last_name}? This will delete their auth account.`)) return;
		try {
			const res = await fetch(authApiUrl, {
				method: 'POST',
				headers: authApiHeaders(),
				body: JSON.stringify({ action: 'delete_user', data: { userId: member.id } })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error || 'Failed to delete');
			await loadMembers();
		} catch (e) {
			alert(e.message || 'Delete failed');
		}
	}

	async function deletePastMember(member) {
		if (!confirm(`Delete past board member "${member.name}"?`)) return;
		try {
			const res = await fetch(`/api/past-members?id=${encodeURIComponent(member.id)}`, {
				method: 'DELETE',
				headers: authApiHeaders(false)
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || 'Failed to delete');
			}
			await loadPastMembers();
		} catch (e) {
			alert(e.message || 'Delete failed');
		}
	}

	async function deleteLifetimeMember(member) {
		if (!confirm(`Delete lifetime member "${member.name}"?`)) return;
		try {
			const res = await fetch(`/api/lifetime-members?id=${encodeURIComponent(member.id)}`, {
				method: 'DELETE',
				headers: authApiHeaders(false)
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || 'Failed to delete');
			}
			await loadLifetimeMembers();
		} catch (e) {
			alert(e.message || 'Delete failed');
		}
	}

	async function deleteSponsor(sponsor) {
		if (!confirm(`Delete sponsor "${sponsor.company}" (${sponsor.name})?`)) return;
		try {
			const res = await fetch(`/api/sponsors?id=${encodeURIComponent(sponsor.id)}`, {
				method: 'DELETE',
				headers: authApiHeaders(false)
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || 'Failed to delete');
			}
			await loadSponsors();
		} catch (e) {
			alert(e.message || 'Delete failed');
		}
	}

	// Create sponsor directly using Supabase
	async function createSponsor() {
		if (!sponsor.name || !sponsor.company) {
			sponsorError = 'Name and company are required';
			return;
		}

		try {
			isCreatingSponsor = true;
			sponsorError = '';
			sponsorSuccess = '';

			const { data, error } = await supabase
				.from('sponsors')
				.insert([
					{
						name: sponsor.name.trim(),
						company: sponsor.company.trim(),
						logo_file: sponsor.logo_file?.trim() || null,
						website: sponsor.website?.trim() || null
					}
				])
				.select()
				.single();

			if (error) {
				console.error('Error creating sponsor:', error);
				throw new Error(error.message);
			}

			sponsorSuccess = 'Sponsor created successfully!';
			sponsor = { name: '', company: '', logo_file: '', website: '' };
			loadSponsors(); // Refresh the list

		} catch (error) {
			console.error('Error creating sponsor:', error);
			sponsorError = error.message || 'Failed to create sponsor';
		} finally {
			isCreatingSponsor = false;
		}
	}

	// Initialize on mount
	onMount(() => {
		loadMemberCount();
		loadAllMembers();
		loadPastMembers();
		loadLifetimeMembers();
		loadSponsors();
	});
</script>

<svelte:head>
	<title>Admin | Orlando Kannada Sangha</title>
	<meta name="description" content="Admin panel for Orlando Kannada Sangha - Manage members, events, and organization content." />
	<meta name="keywords" content="Orlando Kannada Sangha admin, OKS admin panel, member management, event management" />
</svelte:head>

<Navbar />

<Hero page="Admin" />

<main class="container my-5">
	<!-- Page Title -->
	<div class="row">
		<div class="col-12">
			<PageTitle englishTitle="Admin Panel" kannadaTitle="ಆಡಳಿತ ಫಲಕ" />
		</div>
	</div>
			
			<!-- Member Count Display -->
	<div class="row mb-4">
				<div class="col-12">
					<div class="card member-count-card">
				<div class="card-header">
					<h3 class="mb-0"><i class="fas fa-chart-bar me-2"></i>Member Statistics</h3>
				</div>
				<div class="card-body">
							{#if memberCountLoading}
						<LoadingSpinner message="Loading member statistics..." />
					{:else if memberCountError}
						<div class="alert alert-danger">
							<i class="fas fa-exclamation-triangle me-2"></i>
							{memberCountError}
								</div>
							{:else}
								<div class="member-count-display">
									<div class="member-count-item">
										<span class="member-count-number">{memberCount.confirmedUsers}</span>
										<span class="member-count-label">Active Members</span>
									</div>
									<!-- <div class="member-count-item">
								<span class="member-count-number">{memberCount.totalUsers}</span>
								<span class="member-count-label">Total Users</span>
										</div> -->
										<div class="member-count-item">
								<span class="member-count-number">{sponsors.length}</span>
								<span class="member-count-label">Sponsors</span>
										</div>
							<div class="member-count-item">
								<span class="member-count-number">{memberCount.pastMembers}</span>
								<span class="member-count-label">Past Board Members</span>
								</div>
							<div class="member-count-item">
								<span class="member-count-number">{memberCount.lifetimeMembers}</span>
								<span class="member-count-label">Lifetime Members</span>
						</div>
					</div>
					{/if}
				</div>
			</div>
				</div>
				</div>

	<!-- User Management Tabs -->
	<div class="row">
				<div class="col-12">
					<div class="card">
				<div class="card-header">
					<ul class="nav nav-tabs card-header-tabs" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" data-bs-toggle="tab" data-bs-target="#all-members" type="button" role="tab">
								<i class="fas fa-users me-2"></i>All Members
							</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" data-bs-toggle="tab" data-bs-target="#past-members" type="button" role="tab">
								<i class="fas fa-history me-2"></i>Past Board Members
							</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" data-bs-toggle="tab" data-bs-target="#lifetime-members" type="button" role="tab">
								<i class="fas fa-crown me-2"></i>Lifetime Members
							</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" data-bs-toggle="tab" data-bs-target="#bulk-upload" type="button" role="tab">
								<i class="fas fa-upload me-2"></i>Bulk Upload
							</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" data-bs-toggle="tab" data-bs-target="#single-user" type="button" role="tab">
								<i class="fas fa-user-plus me-2"></i>Add Single User
							</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" data-bs-toggle="tab" data-bs-target="#sponsors" type="button" role="tab">
								<i class="fas fa-handshake me-2"></i>Sponsors
							</button>
						</li>
					</ul>
						</div>
						<div class="card-body">
					<div class="tab-content">
						<!-- All Members Tab -->
						<div class="tab-pane fade show active" id="all-members" role="tabpanel">
							<div class="d-flex justify-content-between align-items-center mb-3">
								<h4 class="mb-0">All Members ({filteredMembers.length})</h4>
								<button class="btn btn-outline-primary btn-sm" on:click={loadAllMembers}>
									<i class="fas fa-sync-alt me-1"></i>Refresh
								</button>
							</div>

							<!-- Search and Pagination Controls -->
							<div class="row mb-3">
								<div class="col-md-6">
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-search"></i></span>
									<input
											type="text" 
										class="form-control"
											placeholder="Search by name or email..." 
											bind:value={searchQuery}
											on:input={filterMembers}
										/>
										{#if searchQuery}
											<button class="btn btn-outline-secondary" on:click={() => { searchQuery = ''; filterMembers(); }} aria-label="Clear search">
												<i class="fas fa-times"></i>
											</button>
									{/if}
								</div>
								</div>
								<div class="col-md-6">
									<div class="d-flex justify-content-end align-items-center">
										<label class="form-label me-2 mb-0" for="itemsPerPage">Show:</label>
										<select id="itemsPerPage" class="form-select w-auto" bind:value={itemsPerPage} on:change={changeItemsPerPage}>
											<option value="5">5 rows</option>
											<option value="10">10 rows</option>
											<option value="25">25 rows</option>
											<option value="50">50 rows</option>
										</select>
									</div>
								</div>
							</div>

							<!-- Members Table -->
					{#if membersLoading}
						<LoadingSpinner message="Loading members..." />
							{:else if membersError}
								<div class="alert alert-danger">
									<i class="fas fa-exclamation-triangle me-2"></i>
									{membersError}
								</div>
							{:else if paginatedMembers.length === 0}
								<div class="text-center py-4">
									<i class="fas fa-users fa-3x text-muted mb-3"></i>
									<p class="text-muted">No members found</p>
								</div>
										{:else}
								<div class="table-responsive">
									<table class="table table-hover">
										<thead>
											<tr>
												<th>Avatar</th>
												<th>Name</th>
												<th>Email</th>
												<th>UID</th>
												<th>Member Since</th>
												<th>Status</th>
												<th class="text-end">Action</th>
											</tr>
										</thead>
										<tbody>
											{#each paginatedMembers as member}
												<tr>
													<td>
														<div class="member-avatar" style="background-color: {getAvatarColor(member.first_name + ' ' + member.last_name)}">
															<span class="member-initial">{getMemberInitial(member.first_name + ' ' + member.last_name)}</span>
														</div>
													</td>
													<td>
														<strong>{member.first_name} {member.last_name}</strong>
													</td>
													<td>{member.email}</td>
													<td>
														<code class="text-muted" style="font-size: 0.8rem;">{member.id}</code>
													</td>
													<td>
														{#if getMembershipDuration(member.created_at)}
															Joined {getMembershipDuration(member.created_at)} ago
														{:else}
															Unknown
										{/if}
													</td>
													<td>
														{#if member.email_confirmed_at}
															<span class="badge bg-success">Verified</span>
														{:else}
															<span class="badge bg-warning">Pending</span>
														{/if}
													</td>
													<td class="text-end">
														<button type="button" class="btn btn-sm btn-outline-danger" on:click={() => deleteMember(member)} title="Delete member" aria-label="Delete member">
															<i class="fas fa-trash-alt"></i>
														</button>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>

								<!-- Pagination -->
								{#if totalPages > 1}
									<nav aria-label="Members pagination">
										<ul class="pagination justify-content-center">
											<li class="page-item" class:disabled={currentPage === 1}>
												<button class="page-link" on:click={prevPage}>Previous</button>
											</li>
											{#each Array(totalPages) as _, i}
												<li class="page-item" class:active={currentPage === i + 1}>
													<button class="page-link" on:click={() => goToPage(i + 1)}>{i + 1}</button>
												</li>
											{/each}
											<li class="page-item" class:disabled={currentPage === totalPages}>
												<button class="page-link" on:click={nextPage}>Next</button>
											</li>
										</ul>
									</nav>
								{/if}
							{/if}
						</div>

						<!-- Past Board Members Tab -->
						<div class="tab-pane fade" id="past-members" role="tabpanel">
							<div class="d-flex justify-content-between align-items-center mb-3">
								<h4 class="mb-0">Past Board Members ({filteredPastMembers.length})</h4>
								<button class="btn btn-outline-primary btn-sm" on:click={loadPastMembers}>
									<i class="fas fa-sync-alt me-1"></i>Refresh
									</button>
								</div>

							<!-- Create Past Member Form -->
							<div class="card mb-4">
								<div class="card-header">
									<h5 class="mb-0"><i class="fas fa-plus me-2"></i>Add New Past Board Member</h5>
								</div>
								<div class="card-body">
									{#if pastMemberSuccess}
										<div class="alert alert-success alert-dismissible fade show" role="alert">
											<i class="fas fa-check-circle me-2"></i>{pastMemberSuccess}
											<button type="button" class="btn-close" on:click={() => pastMemberSuccess = ''}></button>
										</div>
									{/if}
									{#if pastMemberError}
										<div class="alert alert-danger alert-dismissible fade show" role="alert">
											<i class="fas fa-exclamation-circle me-2"></i>{pastMemberError}
											<button type="button" class="btn-close" on:click={() => pastMemberError = ''}></button>
										</div>
									{/if}
									<form on:submit|preventDefault={createPastMember}>
										<div class="row">
											<div class="col-md-3">
												<label for="pastMemberName" class="form-label">Name *</label>
												<input 
													type="text" 
													id="pastMemberName"
													class="form-control" 
													bind:value={pastMember.name}
													placeholder="Enter full name"
													required
												/>
											</div>
											<div class="col-md-3">
												<label for="pastMemberPosition" class="form-label">Position *</label>
												<input 
													type="text" 
													id="pastMemberPosition"
													class="form-control" 
													bind:value={pastMember.position}
													placeholder="e.g., Former President"
													required
												/>
											</div>
											<div class="col-md-3">
												<label for="pastMemberYear" class="form-label">Year *</label>
												<input 
													type="text" 
													id="pastMemberYear"
													class="form-control" 
													bind:value={pastMember.year}
													placeholder="e.g., 2020-2021"
													required
												/>
											</div>
											<div class="col-md-3">
												<label for="pastMemberImage" class="form-label">Image File</label>
												<input 
													type="text" 
													id="pastMemberImage"
													class="form-control" 
													bind:value={pastMember.image_file}
													placeholder="e.g., member-photo.jpg"
												/>
											</div>
										</div>
										<div class="mt-3">
											<button 
												type="submit" 
												class="btn btn-primary" 
												disabled={isCreatingPastMember}
											>
												{#if isCreatingPastMember}
													<i class="fas fa-spinner fa-spin me-2"></i>Creating...
												{:else}
													<i class="fas fa-plus me-2"></i>Add Past Member
												{/if}
											</button>
										</div>
									</form>
								</div>
							</div>

							<!-- Search, Filter and Pagination Controls -->
							<div class="row mb-3">
								<div class="col-md-4">
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-search"></i></span>
										<input 
											type="text" 
											class="form-control" 
											placeholder="Search by name, position, or year..." 
											bind:value={pastMemberSearchQuery}
											on:input={filterPastMembers}
										/>
										{#if pastMemberSearchQuery}
											<button class="btn btn-outline-secondary" on:click={() => { pastMemberSearchQuery = ''; filterPastMembers(); }} aria-label="Clear search">
												<i class="fas fa-times"></i>
											</button>
										{/if}
							</div>
						</div>
								<div class="col-md-4">
									<select class="form-select" bind:value={pastMemberFilterBy} on:change={filterPastMembers}>
										<option value="all">All Positions</option>
										<option value="president">President</option>
										<option value="vice-president">Vice President</option>
										<option value="secretary">Secretary</option>
										<option value="treasurer">Treasurer</option>
										<option value="recent">Recent (2020+)</option>
										<option value="older">Older (Before 2020)</option>
									</select>
								</div>
								<div class="col-md-4">
									<div class="d-flex justify-content-end align-items-center">
										<label class="form-label me-2 mb-0" for="pastMemberItemsPerPage">Show:</label>
										<select id="pastMemberItemsPerPage" class="form-select w-auto" bind:value={pastMemberItemsPerPage} on:change={changePastMemberItemsPerPage}>
											<option value="5">5 rows</option>
											<option value="10">10 rows</option>
											<option value="25">25 rows</option>
											<option value="50">50 rows</option>
										</select>
					</div>
				</div>
			</div>

							<!-- Past Members Table -->
					{#if pastMembersLoading}
						<LoadingSpinner message="Loading past board members..." />
							{:else if pastMembersError}
								<div class="alert alert-danger">
									<i class="fas fa-exclamation-triangle me-2"></i>
									{pastMembersError}
								</div>
							{:else if paginatedPastMembers.length === 0}
								<div class="text-center py-4">
									<i class="fas fa-history fa-3x text-muted mb-3"></i>
									<p class="text-muted">No past board members found</p>
								</div>
							{:else}
								<div class="table-responsive">
									<table class="table table-hover">
										<thead>
											<tr>
												<th>Avatar</th>
												<th>Name</th>
												<th>Position</th>
												<th>Year</th>
												<th>Image File</th>
												<th class="text-end">Action</th>
											</tr>
										</thead>
										<tbody>
											{#each paginatedPastMembers as member}
												<tr>
													<td>
														<div class="member-avatar" style="background-color: {getAvatarColor(member.name)}">
															<span class="member-initial">{getMemberInitial(member.name)}</span>
														</div>
													</td>
													<td>
														<strong>{member.name}</strong>
													</td>
													<td>
														<span class="badge bg-primary">{member.position}</span>
													</td>
													<td>
														<span class="text-muted">{member.year}</span>
													</td>
													<td>
														{#if member.image_file}
															<span class="text-muted small">{member.image_file}</span>
														{:else}
															<span class="text-muted small">No image</span>
														{/if}
													</td>
													<td class="text-end">
														<button type="button" class="btn btn-sm btn-outline-danger" on:click={() => deletePastMember(member)} title="Delete past member" aria-label="Delete past member">
															<i class="fas fa-trash-alt"></i>
														</button>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>

								<!-- Pagination -->
								{#if pastMemberTotalPages > 1}
									<nav aria-label="Past members pagination">
										<ul class="pagination justify-content-center">
											<li class="page-item" class:disabled={pastMemberCurrentPage === 1}>
												<button class="page-link" on:click={prevPastMemberPage}>Previous</button>
											</li>
											{#each Array(pastMemberTotalPages) as _, i}
												<li class="page-item" class:active={pastMemberCurrentPage === i + 1}>
													<button class="page-link" on:click={() => goToPastMemberPage(i + 1)}>{i + 1}</button>
												</li>
											{/each}
											<li class="page-item" class:disabled={pastMemberCurrentPage === pastMemberTotalPages}>
												<button class="page-link" on:click={nextPastMemberPage}>Next</button>
											</li>
										</ul>
									</nav>
								{/if}
							{/if}
						</div>

						<!-- Lifetime Members Tab -->
						<div class="tab-pane fade" id="lifetime-members" role="tabpanel">
							<div class="d-flex justify-content-between align-items-center mb-3">
								<h4 class="mb-0">Lifetime Members ({filteredLifetimeMembers.length})</h4>
								<button class="btn btn-outline-primary btn-sm" on:click={loadLifetimeMembers}>
									<i class="fas fa-sync-alt me-1"></i>Refresh
								</button>
							</div>

							<!-- Create Lifetime Member Form -->
							<div class="card mb-4">
								<div class="card-header">
									<h5 class="mb-0"><i class="fas fa-plus me-2"></i>Add New Lifetime Member</h5>
								</div>
								<div class="card-body">
									{#if lifetimeMemberSuccess}
										<div class="alert alert-success alert-dismissible fade show" role="alert">
											<i class="fas fa-check-circle me-2"></i>{lifetimeMemberSuccess}
											<button type="button" class="btn-close" on:click={() => lifetimeMemberSuccess = ''}></button>
										</div>
									{/if}
									{#if lifetimeMemberError}
										<div class="alert alert-danger alert-dismissible fade show" role="alert">
											<i class="fas fa-exclamation-circle me-2"></i>{lifetimeMemberError}
											<button type="button" class="btn-close" on:click={() => lifetimeMemberError = ''}></button>
										</div>
									{/if}
									<form on:submit|preventDefault={createLifetimeMember}>
										<div class="row">
											<div class="col-md-3">
												<label for="lifetimeMemberEmail" class="form-label">Email *</label>
												<input 
													type="email" 
													id="lifetimeMemberEmail"
													class="form-control" 
													bind:value={lifetimeMember.email}
													placeholder="user@example.com"
													required
												/>
											</div>
											<div class="col-md-3">
												<label for="lifetimeMemberName" class="form-label">Name *</label>
												<input 
													type="text" 
													id="lifetimeMemberName"
													class="form-control" 
													bind:value={lifetimeMember.name}
													placeholder="Enter full name"
													required
												/>
											</div>
											<div class="col-md-4">
												<label for="lifetimeMemberTagLine" class="form-label">Tag Line *</label>
												<input 
													type="text" 
													id="lifetimeMemberTagLine"
													class="form-control" 
													bind:value={lifetimeMember.tag_line}
													placeholder="e.g., And Family, Lifetime Member"
													required
												/>
											</div>
											<div class="col-md-4">
												<label for="lifetimeMemberImage" class="form-label">Image File</label>
												<input 
													type="text" 
													id="lifetimeMemberImage"
													class="form-control" 
													bind:value={lifetimeMember.image_file}
													placeholder="e.g., member-photo.jpg"
												/>
											</div>
										</div>
										<div class="mt-3">
											<button 
												type="submit" 
												class="btn btn-primary" 
												disabled={isCreatingLifetimeMember}
											>
												{#if isCreatingLifetimeMember}
													<i class="fas fa-spinner fa-spin me-2"></i>Creating...
												{:else}
													<i class="fas fa-plus me-2"></i>Add Lifetime Member
												{/if}
											</button>
										</div>
									</form>
								</div>
							</div>

							<!-- Search and Pagination Controls -->
							<div class="row mb-3">
								<div class="col-md-6">
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-search"></i></span>
										<input 
											type="text" 
											class="form-control" 
											placeholder="Search by name or position..." 
											bind:value={lifetimeMemberSearchQuery}
											on:input={filterLifetimeMembers}
										/>
										{#if lifetimeMemberSearchQuery}
											<button class="btn btn-outline-secondary" on:click={() => { lifetimeMemberSearchQuery = ''; filterLifetimeMembers(); }} aria-label="Clear search">
												<i class="fas fa-times"></i>
											</button>
										{/if}
									</div>
								</div>
								<div class="col-md-6">
									<div class="d-flex justify-content-end align-items-center">
										<label class="form-label me-2 mb-0" for="lifetimeMemberItemsPerPage">Show:</label>
										<select id="lifetimeMemberItemsPerPage" class="form-select w-auto" bind:value={lifetimeMemberItemsPerPage} on:change={changeLifetimeMemberItemsPerPage}>
											<option value="5">5 rows</option>
											<option value="10">10 rows</option>
											<option value="25">25 rows</option>
											<option value="50">50 rows</option>
										</select>
									</div>
								</div>
							</div>

							<!-- Lifetime Members Table -->
							{#if lifetimeMembersLoading}
								<LoadingSpinner message="Loading lifetime members..." />
							{:else if lifetimeMembersError}
								<div class="alert alert-danger">
									<i class="fas fa-exclamation-triangle me-2"></i>
									{lifetimeMembersError}
								</div>
							{:else if filteredLifetimeMembers.length === 0}
								<div class="text-center py-4">
									<i class="fas fa-crown fa-3x text-muted mb-3"></i>
									<p class="text-muted">No lifetime members found</p>
								</div>
							{:else}
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="table-light">
											<tr>
												<th>Avatar</th>
												<th>Email</th>
												<th>Name</th>
												<th>Tag Line</th>
												<th>Image File</th>
												<th class="text-end">Action</th>
											</tr>
										</thead>
										<tbody>
											{#each filteredLifetimeMembers.slice((lifetimeMemberCurrentPage - 1) * lifetimeMemberItemsPerPage, lifetimeMemberCurrentPage * lifetimeMemberItemsPerPage) as member}
												<tr>
													<td>
														<div class="member-avatar" style="background-color: {getAvatarColor(member.name)}">
															<span class="member-initial">{getMemberInitial(member.name)}</span>
														</div>
													</td>
													<td>
														<span class="text-muted small">{member.email || 'N/A'}</span>
													</td>
													<td>
														<div class="d-flex align-items-center">
															<div>
																<div class="fw-bold">{member.name}</div>
															</div>
														</div>
													</td>
													<td>
														<span class="badge bg-warning text-dark">{member.tag_line || 'Lifetime Member'}</span>
													</td>
													<td>
														{#if member.image_file}
															<span class="text-muted small">{member.image_file}</span>
														{:else}
															<span class="text-muted small">No image</span>
														{/if}
													</td>
													<td class="text-end">
														<button type="button" class="btn btn-sm btn-outline-danger" on:click={() => deleteLifetimeMember(member)} title="Delete lifetime member" aria-label="Delete lifetime member">
															<i class="fas fa-trash-alt"></i>
														</button>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>

								<!-- Pagination -->
								{#if lifetimeMemberTotalPages > 1}
									<nav aria-label="Lifetime members pagination">
										<ul class="pagination justify-content-center">
											<li class="page-item" class:disabled={lifetimeMemberCurrentPage === 1}>
												<button class="page-link" on:click={prevLifetimeMemberPage}>Previous</button>
											</li>
											{#each Array.from({length: Math.min(5, lifetimeMemberTotalPages)}, (_, i) => {
												const startPage = Math.max(1, lifetimeMemberCurrentPage - 2);
												const page = startPage + i;
												return page <= lifetimeMemberTotalPages ? page : null;
											}).filter(Boolean) as page}
												<li class="page-item" class:active={lifetimeMemberCurrentPage === page}>
													<button class="page-link" on:click={() => goToLifetimeMemberPage(page)}>{page}</button>
												</li>
											{/each}
											<li class="page-item" class:disabled={lifetimeMemberCurrentPage === lifetimeMemberTotalPages}>
												<button class="page-link" on:click={nextLifetimeMemberPage}>Next</button>
											</li>
										</ul>
									</nav>
								{/if}
							{/if}
						</div>

						<!-- Bulk Upload Tab -->
						<div class="tab-pane fade" id="bulk-upload" role="tabpanel">
							<h4 class="mb-3">Bulk User Upload</h4>
							
							<div class="row">
								<div class="col-md-6">
					<div class="card">
										<div class="card-header">
											<h5 class="mb-0">Upload CSV File</h5>
						</div>
						<div class="card-body">
							<div class="mb-3">
												<label for="csvFile" class="form-label">Select CSV File</label>
									<input
										type="file"
										class="form-control"
													id="csvFile"
													accept=".csv"
													on:change={handleFileSelect}
												/>
							</div>

											{#if selectedFile}
							<div class="alert alert-info">
													<i class="fas fa-file-csv me-2"></i>
													Selected: {selectedFile.name}
													<button class="btn btn-sm btn-outline-danger ms-2" on:click={clearFile} aria-label="Remove selected file">
														<i class="fas fa-times"></i>
									</button>
								</div>
											{/if}

											<div class="d-grid gap-2">
								<button
													class="btn btn-primary" 
									disabled={!selectedFile || isProcessing}
													on:click={processFile}
								>
									{#if isProcessing}
														<i class="fas fa-spinner fa-spin me-2"></i>
														Processing... {progress}%
									{:else}
														<i class="fas fa-upload me-2"></i>Process File
									{/if}
								</button>
								
												<button class="btn btn-outline-secondary" on:click={downloadTemplate}>
													<i class="fas fa-download me-2"></i>Download Template
									</button>
							</div>
										</div>
				</div>
			</div>

								<div class="col-md-6">
						<div class="card">
										<div class="card-header">
											<h5 class="mb-0">Results</h5>
							</div>
							<div class="card-body">
											{#if successMessage}
												<div class="alert alert-success">
													<i class="fas fa-check-circle me-2"></i>
													{successMessage}
											</div>
											{/if}

											{#if errorMessage}
												<div class="alert alert-danger">
													<i class="fas fa-exclamation-triangle me-2"></i>
													{errorMessage}
										</div>
											{/if}

											{#if results}
												<div class="mb-3">
													<h5>Upload Summary</h5>
													<p class="mb-1">Total: {results.total}</p>
													<p class="mb-1 text-success">Successful: {results.successful?.length || 0}</p>
													<p class="mb-1 text-danger">Failed: {results.failed?.length || 0}</p>
								</div>

												{#if results.failed && results.failed.length > 0}
													<div class="mb-3">
														<h5 class="text-danger">Failed Users</h5>
										<div class="table-responsive">
															<table class="table table-sm">
												<thead>
													<tr>
														<th>Email</th>
														<th>Error</th>
													</tr>
												</thead>
												<tbody>
																	{#each results.failed as failure}
														<tr>
															<td>{failure.email}</td>
															<td class="text-danger">{failure.error}</td>
														</tr>
													{/each}
												</tbody>
											</table>
										</div>
									</div>
								{/if}
											{/if}
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Single User Tab -->
						<div class="tab-pane fade" id="single-user" role="tabpanel">
							<h4 class="mb-3">Add Single User</h4>
							
							<div class="row">
								<div class="col-md-8">
									<div class="card">
										<div class="card-body">
											<form on:submit|preventDefault={createSingleUser}>
												<div class="row">
													<div class="col-md-6 mb-3">
														<label for="firstName" class="form-label">First Name</label>
														<input 
															type="text" 
															class="form-control" 
															id="firstName"
															bind:value={singleUser.first_name}
															required
														/>
										</div>
													<div class="col-md-6 mb-3">
														<label for="lastName" class="form-label">Last Name</label>
														<input 
															type="text" 
															class="form-control" 
															id="lastName"
															bind:value={singleUser.last_name}
															required
														/>
									</div>
							</div>
												
												<div class="mb-3">
													<label for="email" class="form-label">Email</label>
													<input 
														type="email" 
														class="form-control" 
														id="email"
														bind:value={singleUser.email}
														required
													/>
						</div>

												{#if singleUserSuccess}
													<div class="alert alert-success">
														<i class="fas fa-check-circle me-2"></i>
														{singleUserSuccess}
					</div>
												{/if}

												{#if singleUserError}
													<div class="alert alert-danger">
														<i class="fas fa-exclamation-triangle me-2"></i>
														{singleUserError}
				</div>
			{/if}

												<div class="d-grid gap-2 d-md-flex justify-content-md-end">
													<button 
														type="button" 
														class="btn btn-outline-secondary" 
														on:click={clearSingleUserMessages}
													>
														Clear
													</button>
													<button 
														type="submit" 
														class="btn btn-primary"
														disabled={isCreatingUser}
													>
														{#if isCreatingUser}
															<i class="fas fa-spinner fa-spin me-2"></i>
															Creating...
														{:else}
															<i class="fas fa-user-plus me-2"></i>Create User
														{/if}
													</button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Sponsors Tab -->
						<div class="tab-pane fade" id="sponsors" role="tabpanel">
							<div class="d-flex justify-content-between align-items-center mb-3">
								<h4 class="mb-0">Sponsors ({filteredSponsors.length})</h4>
								<button class="btn btn-outline-primary btn-sm" on:click={loadSponsors}>
									<i class="fas fa-sync-alt me-1"></i>Refresh
								</button>
							</div>

							<!-- Create Sponsor Form -->
							<div class="card mb-4">
								<div class="card-header">
									<h5 class="mb-0"><i class="fas fa-plus me-2"></i>Add New Sponsor</h5>
								</div>
								<div class="card-body">
									{#if sponsorSuccess}
										<div class="alert alert-success alert-dismissible fade show" role="alert">
											<i class="fas fa-check-circle me-2"></i>{sponsorSuccess}
											<button type="button" class="btn-close" on:click={() => sponsorSuccess = ''} aria-label="Close"></button>
										</div>
									{/if}
									{#if sponsorError}
										<div class="alert alert-danger alert-dismissible fade show" role="alert">
											<i class="fas fa-exclamation-circle me-2"></i>{sponsorError}
											<button type="button" class="btn-close" on:click={() => sponsorError = ''} aria-label="Close"></button>
										</div>
									{/if}
									<form on:submit|preventDefault={createSponsor}>
										<div class="row">
											<div class="col-md-4">
												<label for="sponsorName" class="form-label">Contact Name *</label>
												<input 
													type="text" 
													id="sponsorName"
													class="form-control" 
													bind:value={sponsor.name}
													placeholder="Enter contact name"
													required
												/>
											</div>
											<div class="col-md-4">
												<label for="sponsorCompany" class="form-label">Company *</label>
												<input 
													type="text" 
													id="sponsorCompany"
													class="form-control" 
													bind:value={sponsor.company}
													placeholder="Company name"
													required
												/>
											</div>
											<div class="col-md-4">
												<label for="sponsorWebsite" class="form-label">Website</label>
												<input 
													type="url" 
													id="sponsorWebsite"
													class="form-control" 
													bind:value={sponsor.website}
													placeholder="https://example.com"
												/>
											</div>
										</div>
										<div class="row mt-3">
											<div class="col-md-12">
												<label for="sponsorLogo" class="form-label">Logo File</label>
												<input 
													type="text" 
													id="sponsorLogo"
													class="form-control" 
													bind:value={sponsor.logo_file}
													placeholder="e.g., company-logo.png"
												/>
												<small class="form-text text-muted">Upload logo file to /static/images/sponsors/ directory</small>
											</div>
										</div>
										<div class="mt-3">
											<button 
												type="submit" 
												class="btn btn-primary" 
												disabled={isCreatingSponsor}
											>
												{#if isCreatingSponsor}
													<i class="fas fa-spinner fa-spin me-2"></i>Creating...
												{:else}
													<i class="fas fa-plus me-2"></i>Add Sponsor
												{/if}
											</button>
										</div>
									</form>
								</div>
							</div>

							<!-- Search and Pagination Controls -->
							<div class="row mb-3">
								<div class="col-md-6">
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-search"></i></span>
										<input 
											type="text" 
											class="form-control" 
											placeholder="Search by name or company..." 
											bind:value={sponsorSearchQuery}
											on:input={filterSponsors}
										/>
										{#if sponsorSearchQuery}
											<button class="btn btn-outline-secondary" on:click={() => { sponsorSearchQuery = ''; filterSponsors(); }} aria-label="Clear search">
												<i class="fas fa-times"></i>
											</button>
										{/if}
									</div>
								</div>
								<div class="col-md-6">
									<div class="d-flex justify-content-end align-items-center">
										<label class="form-label me-2 mb-0" for="sponsorItemsPerPage">Show:</label>
										<select id="sponsorItemsPerPage" class="form-select w-auto" bind:value={sponsorItemsPerPage} on:change={changeSponsorItemsPerPage}>
											<option value="5">5 rows</option>
											<option value="10">10 rows</option>
											<option value="25">25 rows</option>
											<option value="50">50 rows</option>
										</select>
									</div>
								</div>
							</div>

							<!-- Sponsors Table -->
							{#if sponsorsLoading}
								<LoadingSpinner message="Loading sponsors..." />
							{:else if sponsorsError}
								<div class="alert alert-danger">
									<i class="fas fa-exclamation-triangle me-2"></i>
									{sponsorsError}
								</div>
							{:else if paginatedSponsors.length === 0}
								<div class="text-center py-4">
									<i class="fas fa-handshake fa-3x text-muted mb-3"></i>
									<p class="text-muted">No sponsors found</p>
								</div>
							{:else}
								<div class="table-responsive">
									<table class="table table-hover">
										<thead class="table-light">
											<tr>
												<th>Avatar</th>
												<th>Contact Name</th>
												<th>Company</th>
												<th>Logo</th>
												<th>Website</th>
												<th class="text-end">Action</th>
											</tr>
										</thead>
										<tbody>
											{#each paginatedSponsors as sponsor}
												<tr>
													<td>
														<div class="member-avatar" style="background-color: {getAvatarColor(sponsor.company)}">
															<span class="member-initial">{getMemberInitial(sponsor.company)}</span>
														</div>
													</td>
													<td>
														<strong>{sponsor.name}</strong>
													</td>
													<td>
														<span class="fw-bold text-primary">{sponsor.company}</span>
													</td>
													<td>
														{#if sponsor.logo_file}
															<span class="text-muted small">{sponsor.logo_file}</span>
														{:else}
															<span class="text-muted small">No logo</span>
														{/if}
													</td>
													<td>
														{#if sponsor.website}
															<a href={sponsor.website} target="_blank" rel="noopener noreferrer" class="text-decoration-none" aria-label="Visit sponsor website">
																<i class="fas fa-external-link-alt"></i>
															</a>
														{:else}
															<span class="text-muted small">N/A</span>
														{/if}
													</td>
													<td class="text-end">
														<button type="button" class="btn btn-sm btn-outline-danger" on:click={() => deleteSponsor(sponsor)} title="Delete sponsor" aria-label="Delete sponsor">
															<i class="fas fa-trash-alt"></i>
														</button>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>

								<!-- Pagination -->
								{#if sponsorTotalPages > 1}
									<nav aria-label="Sponsors pagination">
										<ul class="pagination justify-content-center">
											<li class="page-item" class:disabled={sponsorCurrentPage === 1}>
												<button class="page-link" on:click={prevSponsorPage}>Previous</button>
											</li>
											{#each Array.from({length: Math.min(5, sponsorTotalPages)}, (_, i) => {
												const startPage = Math.max(1, sponsorCurrentPage - 2);
												const page = startPage + i;
												return page <= sponsorTotalPages ? page : null;
											}).filter(Boolean) as page}
												<li class="page-item" class:active={sponsorCurrentPage === page}>
													<button class="page-link" on:click={() => goToSponsorPage(page)}>{page}</button>
												</li>
											{/each}
											<li class="page-item" class:disabled={sponsorCurrentPage === sponsorTotalPages}>
												<button class="page-link" on:click={nextSponsorPage}>Next</button>
											</li>
										</ul>
									</nav>
								{/if}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />

<style>
	/* Admin page styling */
	.card {
		border: none;
		border-radius: 12px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	.card-body {
		padding: 2rem;
	}

	/* Member Count Display */
	.member-count-card {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border: 1px solid #dee2e6;
	}

	/* Loading state for all components */
	.member-count-display {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.member-count-item {
		text-align: center;
		padding: 1.5rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.member-count-item:hover {
		transform: translateY(-3px);
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
	}

	.member-count-number {
		display: block;
		font-size: 2.5rem;
		font-weight: 700;
		color: #7a1f1f;
		margin-bottom: 0.5rem;
	}

	.member-count-label {
		display: block;
		font-size: 0.9rem;
		color: #6c757d;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	/* Tab Styling */
	.nav-tabs {
		border-bottom: 2px solid #dee2e6;
	}

	.nav-tabs .nav-link {
		border: none;
		border-radius: 0;
		color: #6c757d;
		font-weight: 500;
		padding: 1rem 1.5rem;
		transition: all 0.3s ease;
	}

	.nav-tabs .nav-link:hover {
		color: #7a1f1f;
		background-color: #f8f9fa;
	}

	.nav-tabs .nav-link.active {
		color: #7a1f1f;
		background-color: white;
		border-bottom: 3px solid #7a1f1f;
	}

	/* Table Styling */
	.table {
		margin-bottom: 0;
	}

	.table thead th {
		background-color: #f8f9fa;
		border-bottom: 2px solid #dee2e6;
		font-weight: 600;
		color: #495057;
		padding: 1rem 0.75rem;
	}

	.table tbody tr {
		transition: none;
	}

	.table tbody tr:hover {
		background-color: transparent;
		transform: none;
	}

	.table tbody td {
		padding: 1rem 0.75rem;
		vertical-align: middle;
	}

	/* Member Avatar */
	.member-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #7a1f1f, #8a4b4b);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.2rem;
		border: 2px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease;
	}

	.member-avatar:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.member-initial {
		color: white;
		font-weight: bold;
		font-size: 0.9rem;
		text-align: center;
		line-height: 1;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	/* Badge Styling */
	.badge {
		font-size: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 20px;
	}

	/* Pagination */
	.pagination {
		margin-top: 2rem;
	}

	.page-link {
		color: #7a1f1f;
		border: 1px solid #dee2e6;
		padding: 0.75rem 1rem;
		margin: 0 0.25rem;
		border-radius: 8px;
		transition: all 0.3s ease;
	}

	.page-link:hover {
		background-color: #7a1f1f;
		color: white;
		border-color: #7a1f1f;
	}

	.page-item.active .page-link {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
		color: white;
	}

	.page-item.disabled .page-link {
		color: #6c757d;
		background-color: #f8f9fa;
		border-color: #dee2e6;
	}

	/* Form Styling */
	.form-control, .form-select {
		border: 2px solid #e9ecef;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		transition: all 0.3s ease;
	}

	.form-control:focus, .form-select:focus {
		border-color: #7a1f1f;
		box-shadow: 0 0 0 0.2rem rgba(122, 31, 31, 0.25);
	}

	.form-label {
		font-weight: 600;
		color: #495057;
		margin-bottom: 0.5rem;
	}

	/* Button Styling */
	.btn {
		border-radius: 8px;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.btn::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		transition: width 0.6s, height 0.6s;
	}

	.btn:active::before {
		width: 300px;
		height: 300px;
	}

	.btn-primary {
		background: linear-gradient(135deg, #7a1f1f, #8a4b4b);
		border: none;
		box-shadow: 0 4px 15px rgba(122, 31, 31, 0.3);
	}

	.btn-primary:hover {
		background: linear-gradient(135deg, #6a1a1a, #7a4040);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(122, 31, 31, 0.4);
	}

	.btn-outline-primary {
		color: #7a1f1f;
		border: 2px solid #7a1f1f;
	}

	.btn-outline-primary:hover {
		background-color: #7a1f1f;
		border-color: #7a1f1f;
		transform: translateY(-2px);
		color: white;
	}

	.btn-outline-secondary {
		border: 2px solid #6c757d;
		color: #6c757d;
	}

	.btn-outline-secondary:hover {
		background-color: #6c757d;
		border-color: #6c757d;
		transform: translateY(-2px);
	}

	/* Input Group Styling */
	.input-group-text {
		background-color: #f8f9fa;
		border: 2px solid #e9ecef;
		color: #6c757d;
	}

	.input-group .form-control {
		border-left: none;
	}

	.input-group .form-control:focus {
		border-left: 2px solid #7a1f1f;
	}

	/* Spinner Animation */
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}


	/* Responsive Design */
	@media (max-width: 768px) {
		.member-count-display {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}

		.member-count-item {
			padding: 1rem;
		}

		.member-count-number {
			font-size: 2rem;
		}

		.card-body {
			padding: 1rem;
		}

		.nav-tabs .nav-link {
			padding: 0.75rem 1rem;
			font-size: 0.9rem;
		}

		.table-responsive {
			font-size: 0.9rem;
		}

		.btn {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 576px) {
		.member-count-display {
			grid-template-columns: 1fr;
		}

		.nav-tabs {
			flex-direction: column;
		}

		.nav-tabs .nav-link {
			text-align: center;
			margin-bottom: 0.5rem;
		}
	}

	/* Custom Scrollbar */
	::-webkit-scrollbar {
		width: 8px;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb {
		background: #7a1f1f;
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #6a1a1a;
	}
</style>