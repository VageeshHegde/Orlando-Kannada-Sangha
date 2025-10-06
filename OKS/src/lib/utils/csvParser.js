/**
 * CSV Parser utility for handling bulk invitation uploads
 */

/**
 * Parse CSV content and extract email addresses
 * @param {string} csvContent - Raw CSV content
 * @param {Object} options - Parsing options
 * @returns {Object} Parsed data with emails and metadata
 */
export function parseCSV(csvContent, options = {}) {
	const {
		delimiter = ',',
		emailColumn = 'email',
		hasHeader = true,
		skipEmptyRows = true
	} = options;

	const lines = csvContent.split('\n').filter(line => line.trim());
	
	if (lines.length === 0) {
		throw new Error('CSV file is empty');
	}

	// Parse header row
	const headerRow = hasHeader ? lines[0].split(delimiter).map(col => col.trim().toLowerCase()) : null;
	const dataRows = hasHeader ? lines.slice(1) : lines;

	// Find email column index
	let emailColumnIndex = 0;
	if (hasHeader && headerRow) {
		emailColumnIndex = headerRow.findIndex(col => 
			col.includes('email') || col.includes('e-mail') || col === emailColumn.toLowerCase()
		);
		
		if (emailColumnIndex === -1) {
			throw new Error(`Email column not found. Expected column containing 'email' or '${emailColumn}'. Available columns: ${headerRow.join(', ')}`);
		}
	}

	const emails = [];
	const errors = [];
	const metadata = {
		totalRows: dataRows.length,
		validEmails: 0,
		invalidEmails: 0,
		duplicates: 0
	};

	const emailSet = new Set();

	for (let i = 0; i < dataRows.length; i++) {
		const row = dataRows[i];
		
		if (skipEmptyRows && !row.trim()) {
			continue;
		}

		const columns = row.split(delimiter);
		const email = columns[emailColumnIndex]?.trim();

		if (!email) {
			errors.push({
				row: i + (hasHeader ? 2 : 1), // +2 because we skip header and arrays are 0-indexed
				error: 'Empty email address',
				data: row
			});
			metadata.invalidEmails++;
			continue;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			errors.push({
				row: i + (hasHeader ? 2 : 1),
				error: 'Invalid email format',
				data: row,
				email: email
			});
			metadata.invalidEmails++;
			continue;
		}

		// Check for duplicates
		if (emailSet.has(email.toLowerCase())) {
			errors.push({
				row: i + (hasHeader ? 2 : 1),
				error: 'Duplicate email address',
				data: row,
				email: email
			});
			metadata.duplicates++;
			continue;
		}

		emails.push(email);
		emailSet.add(email.toLowerCase());
		metadata.validEmails++;
	}

	return {
		emails,
		errors,
		metadata,
		headerRow
	};
}

/**
 * Parse Excel file content (simplified - assumes CSV-like format)
 * @param {string} content - File content
 * @param {Object} options - Parsing options
 * @returns {Object} Parsed data
 */
export function parseExcel(content, options = {}) {
	// For now, treat Excel as CSV
	// In a production app, you'd use a library like xlsx
	return parseCSV(content, options);
}

/**
 * Validate file type and size
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
	const {
		maxSize = 5 * 1024 * 1024, // 5MB
		allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
		allowedExtensions = ['.csv', '.xlsx', '.xls']
	} = options;

	const errors = [];

	// Check file size
	if (file.size > maxSize) {
		errors.push(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
	}

	// Check file type
	const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
	if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
		errors.push(`File type not supported. Allowed types: ${allowedExtensions.join(', ')}`);
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Read file content as text
 * @param {File} file - File object
 * @returns {Promise<string>} File content
 */
export function readFileContent(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		
		reader.onload = (event) => {
			resolve(event.target.result);
		};
		
		reader.onerror = (error) => {
			reject(new Error('Failed to read file: ' + error.message));
		};
		
		reader.readAsText(file);
	});
}

/**
 * Generate CSV template for download
 * @param {Array} headers - Column headers
 * @returns {string} CSV content
 */
export function generateCSVTemplate(headers = ['email', 'first_name', 'last_name']) {
	const csvContent = headers.join(',') + '\n' +
		'example@email.com,John,Doe\n' +
		'another@email.com,Jane,Smith';
	
	return csvContent;
}

/**
 * Download CSV template
 * @param {Array} headers - Column headers
 * @param {string} filename - Download filename
 */
export function downloadCSVTemplate(headers = ['email', 'first_name', 'last_name'], filename = 'invitation_template.csv') {
	const csvContent = generateCSVTemplate(headers);
	const blob = new Blob([csvContent], { type: 'text/csv' });
	const url = window.URL.createObjectURL(blob);
	
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}