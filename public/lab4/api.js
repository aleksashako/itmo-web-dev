const API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

async function fetchWeatherByCoords(lat, lon) {
    const url = `${API_URL}?latitude=${lat}&longitude=${lon}` +
        `&current_weather=true` +
        `&hourly=temperature_2m,weathercode` +
        `&timezone=auto`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Weather request failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('fetching error:', error);
        throw error;
    }
}
