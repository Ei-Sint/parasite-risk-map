// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================

// Get the toggle button element
const themeToggle = document.getElementById('theme-toggle');

// Add click event listener
themeToggle.addEventListener('click', function() {
    // Toggle the dark-mode class on body
    document.body.classList.toggle('dark-mode');
    
    // Update button text based on current mode
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

// ========================================
// FARM DATA - All farm information
// ========================================

const farms = [
   {
    id: 1,                        // Number - unique identifier
    name: "Highfield Farm",       // String - farm name (in quotes)
    location: "North Yorkshire",  // String - county
    region: "north",              // String - matches dropdown value
    lat: 54.23,                   // Number - latitude (no quotes)
    lng: -1.54                    // Number - longitude (no quotes)
    },                            // Comma after each object (except last)

    {
        id: 2,
        name: "Meadowbrook Estate",
        location: "Lancashire",
        region: "north",
        lat: 53.87,
        lng: -2.65
    },
    {
        id: 3,
        name: "Riverside Pastures",
        location: "Cumbria",
        region: "north",
        lat: 54.57,
        lng: -2.95
    },
    {
        id: 4,
        name: "Green Acres",
        location: "Cheshire",
        region: "north",
        lat: 53.21,
        lng: -2.43
    },
    {
        id: 5,
        name: "Hilltop Farm",
        location: "Derbyshire",
        region: "north",
        lat: 53.35,
        lng: -1.78
    },
    {
        id: 6,
        name: "Oakwood Farm",
        location: "Shropshire",
        region: "wales",
        lat: 52.65,
        lng: -2.75
    },
    {
        id: 7,
        name: "Valley View",
        location: "Herefordshire",
        region: "wales",
        lat: 52.12,
        lng: -2.82
    },
    {
        id: 8,
        name: "Sunny Meadows",
        location: "Gloucestershire",
        region: "south",
        lat: 51.85,
        lng: -2.15
    },
    {
        id: 9,
        name: "Willow Creek",
        location: "Somerset",
        region: "south",
        lat: 51.15,
        lng: -2.85
    },
    {
        id: 10,
        name: "Stonegate Farm",
        location: "Devon",
        region: "south",
        lat: 50.82,
        lng: -3.45
    },
    {
        id: 11,
        name: "Pennine View",
        location: "West Yorkshire",
        region: "north",
        lat: 53.78,
        lng: -1.85
    },
    {
        id: 12,
        name: "Lakeside Farm",
        location: "Lake District",
        region: "north",
        lat: 54.45,
        lng: -3.05
    },
    {
        id: 13,
        name: "Border Farm",
        location: "Scottish Borders",
        region: "scotland",
        lat: 55.65,
        lng: -2.45
    },
    {
        id: 14,
        name: "Welsh Hills Farm",
        location: "Powys",
        region: "wales",
        lat: 52.35,
        lng: -3.45
    },
    {
        id: 15,
        name: "Coastal Pastures",
        location: "Pembrokeshire",
        region: "wales",
        lat: 51.85,
        lng: -4.95
    }
];

// ========================================
// MAP INITIALIZATION - Leaflet.js
// ========================================

// Create map centered on UK
const map = L.map('map').setView([54.0, -2.5], 6);

// Add map tiles (the actual map images)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO'
}).addTo(map);

// ========================================
// MAP MARKERS - Add farm locations to map
// ========================================

// Store markers so we can reference them later
const markers = {};

// Loop through each farm and create a marker
farms.forEach(farm => {
    // Create marker at farm coordinates
    const marker = L.marker([farm.lat, farm.lng]).addTo(map);
    
    // Add popup with farm name
    marker.bindPopup(`<strong>${farm.name}</strong><br>${farm.location}`);
    
    // Store marker reference
    markers[farm.id] = marker;
    
    // When marker is clicked, show farm details
    marker.on('click', function() {
        showFarmDetails(farm.id);
    });
});


// ========================================
// DOM ELEMENTS - Get references to HTML elements
// ========================================

const farmList = document.getElementById('farm-list');
const detailPanel = document.querySelector('.detail-panel');
const appContainer = document.querySelector('.app-container');

// Detail panel elements
const farmNameEl = document.getElementById('farm-name');
const farmLocationEl = document.getElementById('farm-location');

// ========================================
// SHOW FARM DETAILS - Updated with weather
// ========================================

async function showFarmDetails(farmId) {
    // Find the farm in our data array
    const farm = farms.find(f => f.id === farmId);
    
    if (!farm) return;
    
    // Show the detail panel
    appContainer.classList.add('detail-open');
    
    // Update farm list highlighting
    const allFarms = farmList.querySelectorAll('li');
    allFarms.forEach(li => li.classList.remove('selected'));
    
    const selectedLi = farmList.querySelector(`li[data-id="${farmId}"]`);
    if (selectedLi) selectedLi.classList.add('selected');
    
    // Fill in the farm details
    farmNameEl.textContent = farm.name;
    farmLocationEl.textContent = farm.location;
    
    // Center map on selected farm
    map.setView([farm.lat, farm.lng], 10);
    
    // Open the marker popup
    markers[farmId].openPopup();
    
    // Fetch and display weather data
    const weather = await fetchWeather(farm.lat, farm.lng);
    
    if (weather) {
        document.getElementById('temperature').textContent = `Temperature: ${weather.temperature}°C`;
        document.getElementById('humidity').textContent = `Humidity: ${weather.humidity}%`;
        document.getElementById('rainfall').textContent = `Rainfall (7 days): ${weather.rainfall}mm`;
        
        // Get current season
        const season = getCurrentSeason();
        document.getElementById('season').textContent = `Season: ${season}`;
    }
    
    console.log('Selected farm:', farm);
    console.log('Weather data:', weather);
}

// ========================================
// FARM LIST CLICK - Uses the function above
// ========================================

farmList.addEventListener('click', function(event) {
    const clickedItem = event.target.closest('li');
    if (!clickedItem) return;
    
    const farmId = parseInt(clickedItem.dataset.id);
    showFarmDetails(farmId);
});

// ========================================
// WEATHER API - Fetch real weather data
// ========================================

async function fetchWeather(lat, lng) {
    // Build the API URL with coordinates
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=Europe/London`;
    
    try {
        // Fetch data from API
        const response = await fetch(url);
        const data = await response.json();
        
        // Extract the values we need
        const weather = {
            temperature: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            rainfall: data.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + b, 0).toFixed(1)
        };
        
        return weather;
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

// ========================================
// WEATHER API - Fetch real weather data
// ========================================

async function fetchWeather(lat, lng) {
    // Build the API URL with coordinates
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=Europe/London`;
    
    try {
        // Fetch data from API
        const response = await fetch(url);
        const data = await response.json();
        
        // Extract the values we need
        const weather = {
            temperature: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            rainfall: data.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + b, 0).toFixed(1)
        };
        
        return weather;
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

// ========================================
// HELPER - Get current season
// ========================================

function getCurrentSeason() {
    const month = new Date().getMonth(); // 0-11
    
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
}