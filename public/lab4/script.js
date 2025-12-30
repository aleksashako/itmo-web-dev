let locations = [];
let geoDenied = false;
const MAX_LOCATIONS = 6;

let worldcities = [];

async function loadPage() {
    loadFromStorage();

    const body = document.body;
    body.replaceChildren();

    const app = document.createElement('div');
    body.appendChild(app);

    const header = document.createElement('header');
    header.className = 'page-header';

    const refreshAllBtn = document.createElement('button');
    refreshAllBtn.textContent = 'Refresh all';
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
    clearAllBtn.textContent = 'Clear all locations';
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

    const addLocs = document.createElement('h2');
    addLocs.className = 'additional-locations';
    addLocs.textContent = 'Additional Locations';

    main.appendChild(addLocs);

    main.appendChild(createCityForm());

    const locationsContainer = document.createElement('div');
    locationsContainer.id = 'locationsContainer';
    locationsContainer.className = 'locations-container';
    main.appendChild(locationsContainer);

    if (locations.length == 0) requestGeolocation();
    else renderLocations();
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

async function loadCitiesCSV() {
    const res = await fetch('worldcities.csv');
    const text = await res.text();

    const lines = text.split('\n').filter(Boolean);
    const header = parseCSVLine(lines.shift());

    const indexCity = header.indexOf('city_ascii');
    const indexCountry = header.indexOf('country');
    const indexLat = header.indexOf('lat');
    const indexLng = header.indexOf('lng');

    worldcities = lines.map(line => {
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

function requestGeolocation() {
    if (!navigator.geolocation) {
        geoDenied = true;
        showCityModalForCurrentLocation();
        saveToStorage();
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
                error: ''
            });

            saveToStorage();
            updateAllWeather();
        },
        () => {
            geoDenied = true;
            saveToStorage();
            showCityModalForCurrentLocation();
        }
    );
}

function addCurrentLocation(cityName, countryName, lat, lon) {
    const location = {
        id: Date.now(),
        type: 'geo',
        name: `${cityName}, ${countryName}`,
        lat: lat,
        lon: lon,
        weather: null,
        error: ''
    };

    locations.unshift(location);
    saveToStorage();
    updateAllWeather();
    renderLocations();
}

function showCityModalForCurrentLocation() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const content = document.createElement('div');
    content.className = 'modal-content';

    const title = document.createElement('h2');
    title.textContent = 'Select your location';
    content.appendChild(title);

    const cityForm = createCityFormForModal(modal);
    content.appendChild(cityForm);

    modal.appendChild(content);
    document.body.appendChild(modal);
}

function createCityFormForModal(modal) {
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
                addCurrentLocation(city.name, city.country, city.lat, city.lon);
                modal.remove(); 
            });

            list.appendChild(item);
        });
    });
    updateAllWeather();

    return form;
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

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    const title = document.createElement('span');
    title.textContent = location.name;
    cardHeader.appendChild(title);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'card-btns';

    const reFrBtn = document.createElement('button');
    reFrBtn.textContent = '🗘';
    reFrBtn.className = 'city-btn';
    reFrBtn.addEventListener('click', () => refreshCity(location, reFrBtn));
    btnContainer.appendChild(reFrBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'city-btn';
    deleteBtn.addEventListener('click', () => deleteCity(location));
    btnContainer.appendChild(deleteBtn);

    cardHeader.appendChild(btnContainer);
    card.appendChild(cardHeader);

    if (location.error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'weather-error';
        errorDiv.textContent = location.error;
        card.appendChild(errorDiv);
        return card;
    }

    // curr
    if (location.weather?.current) {
        const current = document.createElement('div');
        current.className = 'current-weather';

        const temp = document.createElement('div');
        temp.textContent = `temperature: ${location.weather.current.temperature}°C`;
        current.appendChild(temp);

        card.appendChild(current);
    }

    // forecast
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
                partDiv.append(label, temp);
                partsContainer.appendChild(partDiv);
            });

            dayBlock.append(dayTitle, partsContainer);
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
    input.placeholder = 'Add new city by entering city-name!';

    const list = document.createElement('div');
    list.className = 'suggestions';

    const error = document.createElement('div');
    error.id = 'form-error';
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

function showFormError(message) {
    const errorEl = document.getElementById('form-error');
    if (!errorEl) return;

    errorEl.textContent = message;
}

function clearFormError() {
    const errorEl = document.getElementById('form-error');
    if (!errorEl) return;

    errorEl.textContent = '';
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadCitiesCSV();
    loadPage();
});
