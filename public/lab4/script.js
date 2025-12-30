let locations = [];
let geoDenied = false;
const MAX_LOCATIONS = 6;

let CITIES_DATA = [];

async function loadCitiesCSV() {
    const res = await fetch('worldcities.csv');
    const text = await res.text();

    const lines = text.split('\n').filter(Boolean);

    const header = parseCSVLine(lines.shift());

    const indexCity = header.indexOf('city_ascii');
    const indexCountry = header.indexOf('country');
    const indexLat = header.indexOf('lat');
    const indexLng = header.indexOf('lng');

    CITIES_DATA = lines.map(line => {
        const cols = parseCSVLine(line);

        return {
            name: cols[indexCity],
            country: cols[indexCountry],
            lat: Number(cols[indexLat]),
            lon: Number(cols[indexLng])
        };
    });
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char == '"' && line[i + 1] == '"') {
            current += '"';
            i++;
        } else if (char == '"') {
            inQuotes = !inQuotes;
        } else if (char == ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}


function saveToStorage() {
    localStorage.setItem('locations', JSON.stringify(locations));
    localStorage.setItem('geoDenied', JSON.stringify(geoDenied));
}

function loadFromStorage() {
    const storedLocations = localStorage.getItem('locations');
    const storedGeoDenied = localStorage.getItem('geoDenied');

    if (storedLocations) locations = JSON.parse(storedLocations);
    if (storedGeoDenied) geoDenied = JSON.parse(storedGeoDenied);
}

async function loadPage() {
    loadFromStorage();

    const body = document.body;
    body.replaceChildren();

    const app = document.createElement('div');
    body.appendChild(app);

    const header = document.createElement('header');
    header.className = 'page-header';

    const refreshAllBtn = document.createElement('button');
    refreshAllBtn.textContent = 'Refresh';
    refreshAllBtn.className = 'refresh-all-btn';
    refreshAllBtn.addEventListener('click', updateAllWeather);
    header.appendChild(refreshAllBtn);

    const title = document.createElement('h1');
    title.textContent = 'Weather Forecast';
    header.appendChild(title);
    app.appendChild(header);

    const main = document.createElement('main');
    main.className = 'content';
    app.appendChild(main);


    const clearAllBtn = document.createElement('button');
    clearAllBtn.textContent = 'Clear All';
    clearAllBtn.className = 'clear-all-btn';
    clearAllBtn.addEventListener('click', () => {
        locations = locations.filter(l => l.type == 'geo');
        saveToStorage();
        renderLocations();
    });
    header.appendChild(clearAllBtn);

    const currentContainer = document.createElement('div');
    currentContainer.id = 'currentLocationContainer';
    currentContainer.className = 'current-location-container';
    main.appendChild(currentContainer);

    main.appendChild(createCityForm());

    const locationsContainer = document.createElement('div');
    locationsContainer.id = 'locationsContainer';
    locationsContainer.className = 'locations-container';
    main.appendChild(locationsContainer);

    if (locations.length == 0) requestGeolocation();
    else renderLocations();
}

function requestGeolocation() {
    if (!navigator.geolocation) {
        geoDenied = true;
        saveToStorage();
        renderLocations();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            locations.unshift({
                id: Date.now(),
                type: 'geo',
                name: 'Current location',
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                weather: null,
                status: 'idle'
            });

            saveToStorage();
            updateAllWeather();
        },
        () => {
            geoDenied = true;
            saveToStorage();
            renderLocations();
        }
    );
}

function resetGeolocation() {
    locations = locations.filter(l => l.type == 'city');
    geoDenied = false;
    saveToStorage();
    renderLocations();
}

function renderLocations() {
    const current = document.getElementById('currentLocationContainer');
    const list = document.getElementById('locationsContainer');

    current.replaceChildren();
    list.replaceChildren();

    locations.forEach(loc => {
        const card = createWeatherCard(loc);

        if (loc.type == 'geo') {
            card.classList.add('weather-card--main');
            current.appendChild(card);
        } else {
            list.appendChild(card);
        }
    });
}

function createWeatherCard(location) {
    const card = document.createElement('div');
    card.className = 'weather-card';

    const cardHeader = document.createElement('h2');
    cardHeader.textContent = location.name;

    const reFrBtn = document.createElement('button');
    reFrBtn.textContent = 'Refresh city';
    reFrBtn.className = 'refresh-city-btn';
    reFrBtn.addEventListener('click', () => refreshCity(location, reFrBtn));
    cardHeader.appendChild(reFrBtn);

    card.appendChild(cardHeader);

    const status = document.createElement('div');
    status.className = 'status-text';
    if (location.status == 'loading') status.textContent = 'Loading...';
    else if (location.status == 'error') status.textContent = 'Error loading weather';
    card.appendChild(status);

    // curr
    if (location.weather?.current) {
        const current = document.createElement('div');
        current.className = 'current-weather';

        const temp = document.createElement('div');
        temp.textContent = `Now: ${location.weather.current.temperature}°C`;
        const wind = document.createElement('div');
        wind.textContent = `Wind: ${location.weather.current.windspeed} km/h`;

        current.appendChild(temp);
        current.appendChild(wind);
        card.appendChild(current);
    }

    if (location.weather?.forecast) {
        const forecastContainer = document.createElement('div');
        forecastContainer.className = 'forecast-container';

        location.weather.forecast.forEach(day => {
            const dayBlock = document.createElement('div');
            dayBlock.className = 'day-block';

            const dayTitle = document.createElement('div');
            dayTitle.className = 'day-title';
            const dateObj = new Date(day.date);
            dayTitle.textContent = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'    
            });


            const partsContainer = document.createElement('div');
            partsContainer.className = 'day-parts';

            const partsMap = { 0:'Night',6:'Morning',12:'Day',18:'Evening' };
            Object.keys(partsMap).forEach(hour => {
                const part = day.parts[hour];
                if (!part) return;
                const partDiv = document.createElement('div');
                partDiv.className = 'day-part';

                const label = document.createElement('span');
                label.textContent = partsMap[hour];
                const temp = document.createElement('span');
                temp.textContent = `${part.temp}°C`;

                partDiv.appendChild(label);
                partDiv.appendChild(temp);
                partsContainer.appendChild(partDiv);
            });

            dayBlock.appendChild(dayTitle);
            dayBlock.appendChild(partsContainer);
            forecastContainer.appendChild(dayBlock);
        });

        card.appendChild(forecastContainer);
    }

    return card;
}

function createCityForm() {
    const form = document.createElement('div');
    form.className = 'city-form';

    const input = document.createElement('input');
    input.placeholder = 'Enter city name';

    const list = document.createElement('div');
    list.className = 'suggestions';

    const error = document.createElement('div');
    error.className = 'form-error';

    form.append(input, list, error);

    input.addEventListener('input', () => {
        const value = input.value.trim();
        list.innerHTML = '';
        error.textContent = '';

        if (value.length < 2) return;

        const results = searchCities(value);

        if (results.length == 0) {
            error.textContent = 'City not found';
            return;
        }

        results.forEach(city => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = `${city.name}, ${city.country}`;

            item.addEventListener('click', () => {
                addCity(city);
                input.value = '';
                list.innerHTML = '';
            });

            list.appendChild(item);
        });
    });

    return form;
}

function addCity(city) {
    if (locations.length == MAX_LOCATIONS) {
        alert('Maximum number of cities reached');
        return;
    }

    if (locations.some(l => l.name == city.name)) {
        alert('City already added');
        return;
    }

    const location = {
        id: Date.now(),
        name: `${city.name}, ${city.country}`,
        lat: city.lat,
        lon: city.lon,
        weather: null,
    };

    locations.push(location);
    saveToStorage();

    updateLocationWeather(location);
    renderLocations();
}

async function refreshCity(location, button) {
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Loading...';

    try {
        await updateLocationWeather(location); 
    } catch (err) {
        console.error('Error updating weather for', location.name, err);
        button.textContent = 'Error';
        setTimeout(() => button.textContent = originalText, 2000); 
    } finally {
        button.disabled = false;
        if (button.textContent !== 'Error') button.textContent = originalText;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCitiesCSV();
    loadPage();
});
