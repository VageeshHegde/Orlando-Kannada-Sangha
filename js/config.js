// Check if we're in a GitHub Pages environment
const isGitHubPages = window.location.hostname.includes('github.io');

// Development configuration (local)
const devConfig = {
    weatherApiKey: '',
    googleMapsApiKey: 'development_key_here',
    contactEmail: 'suddhi@orlandokannadasangha.org',
    siteUrl: 'http://localhost:5500',
    weatherApiEndpoint: 'https://api.openweathermap.org/data/2.5/weather',
    environment: 'development'
};

// Production configuration (will be replaced by GitHub Actions)
const prodConfig = {
    weatherApiKey: '7fc8ed424124d6c406af0d3e49afa4f5',
    googleMapsApiKey: '',
    contactEmail: 'suddhi@orlandokannadasangha.org',
    siteUrl: 'https://orlandokannadasangha.org',
    weatherApiEndpoint: 'https://api.openweathermap.org/data/2.5/weather',
    environment: 'production'
};

// Choose configuration based on environment
const config = isGitHubPages ? prodConfig : devConfig;

// Add development indicator
if (config.environment === 'development') {
    console.log('Running in development mode');
}

// Prevent modifications to the config object
Object.freeze(config); 