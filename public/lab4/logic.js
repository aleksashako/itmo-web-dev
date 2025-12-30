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
        location.status = 'loading';

        const rawData = await fetchWeatherByCoords(location.lat, location.lon);
        const parsed = parseWeatherData(rawData);

        if (!parsed) {
            throw new Error('Parsing error');
        }

        location.weather = parsed;
        location.status = 'success';

        renderLocations(); 
    } catch (error) {
        location.status = 'error';
        console.error('updateLocationWeather error:', error);
        renderLocations();
    }
}

async function updateAllWeather() {
    const tasks = locations.map(location => updateLocationWeather(location));
    await Promise.all(tasks);
}

function searchCities(query, limit = 10) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    return CITIES_DATA
        .filter(city => city.name.toLowerCase().startsWith(q))
        .slice(0, limit);
}
