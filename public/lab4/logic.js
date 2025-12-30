const FORECAST_HOURS = [0, 6, 12, 18];

function parseWeatherData(rawData) {
    if (!rawData || !rawData.hourly) {
        return null;
    }

    const times = rawData.hourly.time;
    const temps = rawData.hourly.temperature_2m;
    const codes = rawData.hourly.weathercode;

    const result = [];

    const today = new Date().toISOString().split('T')[0];

    // сегодня + 2 дня
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);

        const dateStr = date.toISOString().split('T')[0];
        const dayForecast = {
            date: dateStr,
            parts: {}
        };

        FORECAST_HOURS.forEach(hour => {
            const timeStr = `${dateStr}T${hour.toString().padStart(2, '0')}:00`;

            const index = times.indexOf(timeStr);
            if (index !== -1) {
                dayForecast.parts[hour] = {
                    temp: temps[index],
                    code: codes[index]
                };
            }
        });

        result.push(dayForecast);
    }

    return {
        current: rawData.current_weather,
        forecast: result
    };
}

async function updateLocationWeather(location) {
    try {
        location.error = null; 
        renderLocations(); 

        const rawData = await fetchWeatherByCoords(location.lat, location.lon);
        const parsed = parseWeatherData(rawData);

        if (!parsed) {
            throw new Error('Failed to parse weather data');
        }

        location.weather = parsed;
        renderLocations();
        saveToStorage();
    } catch (error) {
        location.weather = null;
        location.error = error.message;

        renderLocations();
        saveToStorage();
        throw error;
    }
}

async function updateAllWeather() {
    const tasks = locations.map(async location => {
        try {
            await updateLocationWeather(location);
        } catch (_) {
        }
    });

    await Promise.all(tasks);
}

function searchCities(query, limit = 10) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    return worldcities
        .filter(city => city.name.toLowerCase().startsWith(q))
        .slice(0, limit);
}

function deleteCity(location) {
    if (location.type == 'geo') {
        showCityModalForCurrentLocation();
        locations = locations.filter(l => l.type != 'geo');

        updateLocationWeather(location);
        saveToStorage();
        return;
    }

    locations = locations.filter(l => l != location);
    saveToStorage();
    renderLocations();
}

function addCity(city) {
    if (locations.length == MAX_LOCATIONS) {
        showFormError('Maximum number of cities reached');
        return;
    }

    if (
        locations.some(l =>
            Math.abs(l.lat - city.lat) < 0.0001 &&
            Math.abs(l.lon - city.lon) < 0.0001
        )
    ) {
        showFormError('City already added');
        return;
    }

    const location = {
        id: Date.now(),
        name: `${city.name}, ${city.country}`,
        lat: city.lat,
        lon: city.lon,
        weather: null,
        error: ''
    };

    locations.push(location);
    saveToStorage();
    updateAllWeather();
    renderLocations();
    clearFormError();
}

async function refreshCity(location, button) {
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Loading...';

    try {
        location.error = null;
        await updateLocationWeather(location);
    } catch (err) {
        console.error('Error updating weather for', location.name, err);
        location.weather = null;
        location.error = err?.message || 'Failed to load weather data';

        renderLocations();
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}