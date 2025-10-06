/**
 * Avatar utility functions for consistent avatar display across the application
 */

/**
 * Get initials from name for avatar display (first letter of first name + first letter of last name)
 * @param {string} name - The full name
 * @returns {string} - Two letters in uppercase, or 'U' if no name
 */
export function getMemberInitial(name) {
	if (!name || typeof name !== 'string') return 'U';
	const trimmedName = name.trim();
	if (!trimmedName) return 'U';
	
	// Split name into parts
	const nameParts = trimmedName.split(/\s+/);
	
	if (nameParts.length === 1) {
		// Only one name, return first letter
		return nameParts[0].charAt(0).toUpperCase();
	} else if (nameParts.length >= 2) {
		// Two or more names, return first letter of first and last name
		const firstInitial = nameParts[0].charAt(0).toUpperCase();
		const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
		return firstInitial + lastInitial;
	}
	
	return 'U';
}

/**
 * Get avatar color based on name (consistent colors)
 * @param {string} name - The full name
 * @returns {string} - Hex color code
 */
export function getAvatarColor(name) {
	if (!name || typeof name !== 'string') return '#7a1f1f';
	
	const colors = [
		'#7a1f1f', '#4c2e2e', '#8b4513', '#a0522d', '#cd853f',
		'#2c5530', '#4a6741', '#6b8e23', '#8fbc8f', '#98fb98',
		'#4682b4', '#5f9ea0', '#87ceeb', '#b0c4de', '#dda0dd',
		'#da70d6', '#ff69b4', '#ff1493', '#dc143c', '#b22222'
	];
	
	// Create a simple hash from the name
	const hash = name.split('').reduce((a, b) => {
		a = ((a << 5) - a) + b.charCodeAt(0);
		return a & a;
	}, 0);
	
	return colors[Math.abs(hash) % colors.length];
}

/**
 * Get user display name from various sources (same logic as Navbar)
 * @param {object} user - Supabase user object
 * @returns {string} - Formatted display name
 */
export function getUserDisplayName(user) {
	if (!user) return 'Guest';
	
	// Priority 1: Check for 'name' field in metadata (most direct)
	if (user.user_metadata?.name) {
		return user.user_metadata.name;
	}
	
	// Priority 2: Try to get full name from first_name and last_name
	const firstName = user.user_metadata?.first_name || '';
	const lastName = user.user_metadata?.last_name || '';
	
	if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	} else if (firstName) {
		return firstName;
	} else if (lastName) {
		return lastName;
	}
	
	// Priority 3: Enhanced email parsing for better name extraction
	if (user.email) {
		const emailUser = user.email.split('@')[0];
		
		// Handle common email patterns
		if (emailUser.includes('.')) {
			// Handle patterns like "john.doe" or "first.last"
			const parts = emailUser.split('.');
			const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
			const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
			return lastName ? `${firstName} ${lastName}` : firstName;
		} else if (emailUser.includes('_')) {
			// Handle patterns like "john_doe"
			const parts = emailUser.split('_');
			const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
			const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
			return lastName ? `${firstName} ${lastName}` : firstName;
		} else {
			// Simple capitalization
			return emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
		}
	}
	
	return 'Guest';
}

/**
 * Calculate membership duration from creation date
 * @param {string} createdAt - ISO date string
 * @returns {string|null} - Formatted duration or null
 */
export function getMembershipDuration(createdAt) {
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

/**
 * Create user profile object with all necessary data
 * @param {object} currentUser - Supabase user object
 * @returns {object} - Complete user profile object
 */
export function createUserProfile(currentUser) {
	if (!currentUser) {
		return {
			name: '',
			email: '',
			avatar: '/images/default-avatar.png',
			memberSince: null
		};
	}
	
	const fullName = getUserDisplayName(currentUser);
	
	return {
		name: fullName || 'User',
		email: currentUser.email || '',
		avatar: currentUser.user_metadata?.avatar_url || '/images/default-avatar.png',
		memberSince: getMembershipDuration(currentUser.created_at)
	};
}

/**
 * Get default avatar based on name (for chat component)
 * @param {string} name - The name to generate avatar for
 * @returns {string} - Base64 encoded SVG avatar
 */
export function getDefaultAvatar(name) {
	const firstLetter = getMemberInitial(name);
	const color = getAvatarColor(name);
	
	return `data:image/svg+xml;base64,${btoa(`
		<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
			<circle cx="20" cy="20" r="20" fill="${color}"/>
			<text x="20" y="26" text-anchor="middle" fill="white" font-family="Georgia, serif" font-size="16" font-weight="bold">${firstLetter}</text>
		</svg>
	`)}`;
}