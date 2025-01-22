export const environment = {
	production: true,
	BackEndUrl: 'http://deboleia_be:',
	BackEndPort: '8082', // Add the port here
	// googleMapsApiKey: 'AIzaSyCBIEfLxuj0XzTC82J78kH5X5NVIRsnPog'
	// GeoApiUrl: 'https://api.opencagedata.com/geocode/v1/json',
};

// Combine the URL and port
export const fullBackEndUrl = `${environment.BackEndUrl}${environment.BackEndPort}`;
