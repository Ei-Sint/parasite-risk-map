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
// SET DARK MODE AS DEFAULT
// ========================================

document.body.classList.add('dark-mode');
themeToggle.textContent = '☀️ Light Mode';

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
// Updated map within UK boundaries only
const ukBounds = L.latLngBounds(
    [49.5, -8.5],  // Southwest corner (bottom-left)
    [59.0, 2.0]    // Northeast corner (top-right)
);

const map = L.map('map', {
    center: [54.0, -2.5],
    zoom: 6,
    minZoom: 5,
    maxZoom: 12,
    maxBounds: ukBounds,
    maxBoundsViscosity: 1.0  // Prevents dragging outside bounds
}).setView([54.0, -2.5], 6);

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
// SHOW FARM DETAILS - Updated weather data fetching
// ========================================

async function showFarmDetails(farmId) {
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
    markers[farmId].openPopup();
    
    // Show loading state
    document.getElementById('temperature').textContent = 'Temperature: Loading...';
    document.getElementById('humidity').textContent = 'Humidity: Loading...';
    document.getElementById('rainfall').textContent = 'Rainfall: Loading...';
    document.getElementById('risk-level').textContent = 'Risk Level: Loading...';
    document.getElementById('risk-score').textContent = 'Risk Score: Loading...';
    
    // Fetch weather data
    const weather = await fetchWeather(farm.lat, farm.lng);
    if (weather) {
        // Display weather
        document.getElementById('temperature').textContent = `Temperature: ${weather.temperature}°C`;
        document.getElementById('humidity').textContent = `Humidity: ${weather.humidity}%`;
        document.getElementById('rainfall').textContent = `Rainfall (7 days): ${weather.rainfall}mm`;
        document.getElementById('season').textContent = `Season: ${getCurrentSeason()}`;
        
        // Calculate and display overall risk
        const risk = calculateRisk(weather, getCurrentSeason());
        document.getElementById('risk-level').textContent = `Risk Level: ${risk.level}`;
        document.getElementById('risk-score').textContent = `Risk Score: ${risk.score}/10`;
        
        // Calculate parasite-specific risks
        const parasiteRisks = calculateParasiteRisks(weather, getCurrentSeason());
        
        // Helper to set risk with color
        function setRiskWithColor(elementId, riskLevel) {
            const el = document.getElementById(elementId);
            el.textContent = riskLevel;
            el.className = 'parasite-risk';
            if (riskLevel === 'LOW') el.classList.add('risk-low');
            if (riskLevel === 'MEDIUM') el.classList.add('risk-medium');
            if (riskLevel === 'HIGH') el.classList.add('risk-high');
        }
        
        setRiskWithColor('liver-fluke-risk', parasiteRisks.liverFluke);
        setRiskWithColor('lungworm-risk', parasiteRisks.lungworm);
        setRiskWithColor('gut-worm-risk', parasiteRisks.gutWorm);
        setRiskWithColor('coccidia-risk', parasiteRisks.coccidia);
        
        // Generate and display recommendations
        const recommendations = generateRecommendations(parasiteRisks, weather);
        const recommendationList = document.getElementById('recommendation-list');
        recommendationList.innerHTML = '';
        
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationList.appendChild(li);
        });
        
    } else {
        document.getElementById('temperature').textContent = 'Temperature: Error';
        document.getElementById('humidity').textContent = 'Humidity: Error';
        document.getElementById('rainfall').textContent = 'Rainfall: Error';
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

// ========================================
// RISK CALCULATION - Calculate parasite risk from weather
// ========================================

function calculateRisk(weather, season) {
    let score = 0;
    
    // Temperature factor (parasites thrive in warm conditions)
    if (weather.temperature >= 10) score += 1;
    if (weather.temperature >= 15) score += 1;
    if (weather.temperature >= 20) score += 1;
    
    // Rainfall factor (wet conditions favor parasites)
    if (weather.rainfall >= 5) score += 1;
    if (weather.rainfall >= 15) score += 1;
    if (weather.rainfall >= 30) score += 1;
    
    // Humidity factor
    if (weather.humidity >= 60) score += 1;
    if (weather.humidity >= 75) score += 1;
    
    // Season factor
    if (season === 'Spring' || season === 'Autumn') score += 2;
    if (season === 'Summer') score += 1;
    // Winter adds 0
    
    // Determine risk level (max score = 10)
    let level;
    if (score <= 3) level = 'LOW';
    else if (score <= 6) level = 'MEDIUM';
    else level = 'HIGH';
    
    return { score, level };
}

// ========================================
// PARASITE-SPECIFIC RISK CALCULATION
// ========================================

function calculateParasiteRisks(weather, season) {
    const risks = {};
    
    // Liver Fluke - loves wet conditions
    let flukeScore = 0;
    if (weather.rainfall >= 10) flukeScore += 2;
    if (weather.rainfall >= 25) flukeScore += 2;
    if (weather.humidity >= 70) flukeScore += 1;
    if (season === 'Autumn') flukeScore += 2;
    risks.liverFluke = flukeScore >= 4 ? 'HIGH' : flukeScore >= 2 ? 'MEDIUM' : 'LOW';
    
    // Lungworm - warm and humid
    let lungScore = 0;
    if (weather.temperature >= 15) lungScore += 2;
    if (weather.humidity >= 65) lungScore += 2;
    if (season === 'Summer' || season === 'Autumn') lungScore += 1;
    risks.lungworm = lungScore >= 4 ? 'HIGH' : lungScore >= 2 ? 'MEDIUM' : 'LOW';
    
    // Gut Worms - warm and wet
    let gutScore = 0;
    if (weather.temperature >= 12) gutScore += 1;
    if (weather.temperature >= 18) gutScore += 1;
    if (weather.rainfall >= 10) gutScore += 1;
    if (season === 'Spring' || season === 'Summer') gutScore += 1;
    risks.gutWorm = gutScore >= 3 ? 'HIGH' : gutScore >= 2 ? 'MEDIUM' : 'LOW';
    
    // Coccidia - warm, wet, stress conditions
    let coccidiaScore = 0;
    if (weather.temperature >= 15) coccidiaScore += 1;
    if (weather.rainfall >= 15) coccidiaScore += 1;
    if (weather.humidity >= 70) coccidiaScore += 1;
    if (season === 'Spring') coccidiaScore += 2;
    risks.coccidia = coccidiaScore >= 3 ? 'HIGH' : coccidiaScore >= 2 ? 'MEDIUM' : 'LOW';
    
    return risks;
}

// ========================================
// CUSTOM MARKERS - Colored by risk level
// ========================================

function createColoredIcon(riskLevel) {
    const colors = {
        LOW: '#4caf50',      // Green
        MEDIUM: '#ff9800',   // Orange  
        HIGH: '#f44336'      // Red
    };
    
    const color = colors[riskLevel] || '#2196f3'; // Blue default
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<svg width="25" height="41" viewBox="0 0 25 41">
            <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
            <circle fill="#fff" cx="12.5" cy="12.5" r="5"/>
        </svg>`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
}

const riskIcons = {
    LOW: createColoredIcon('LOW'),
    MEDIUM: createColoredIcon('MEDIUM'),
    HIGH: createColoredIcon('HIGH'),
    DEFAULT: createColoredIcon('DEFAULT')
};

// ========================================
// INITIALIZE ALL FARM MARKERS WITH RISK COLORS
// ========================================

async function initializeFarmMarkers() {
    for (const farm of farms) {
        // Set default icon first
        markers[farm.id].setIcon(riskIcons.DEFAULT);
        
        // Fetch weather for this farm
        const weather = await fetchWeather(farm.lat, farm.lng);
        
        if (weather) {
            const risk = calculateRisk(weather, getCurrentSeason());
            
            // Update marker with risk color
            markers[farm.id].setIcon(riskIcons[risk.level]);
            
            // Store data on farm object
            farm.weather = weather;
            farm.risk = risk;
        }
    }
    
    console.log('All farm markers initialized with risk colors');
}

// ========================================
// INITIALIZE APP
// ========================================

// Load risk data for all farms when page loads
initializeFarmMarkers();

// ========================================
// RECOMMENDATIONS - Generate advice based on risks
// ========================================

function generateRecommendations(parasiteRisks, weather) {
    const recommendations = [];
    
    // Liver Fluke recommendations
    if (parasiteRisks.liverFluke === 'HIGH') {
        recommendations.push('🔴 Treat livestock for liver fluke immediately');
        recommendations.push('🔴 Avoid grazing on wet pastures');
    } else if (parasiteRisks.liverFluke === 'MEDIUM') {
        recommendations.push('🟡 Monitor for liver fluke - consider testing');
    }
    
    // Lungworm recommendations
    if (parasiteRisks.lungworm === 'HIGH') {
        recommendations.push('🔴 Vaccinate cattle for lungworm');
        recommendations.push('🔴 Monitor young stock for coughing');
    } else if (parasiteRisks.lungworm === 'MEDIUM') {
        recommendations.push('🟡 Keep watch for lungworm symptoms');
    }
    
    // Gut Worm recommendations
    if (parasiteRisks.gutWorm === 'HIGH') {
        recommendations.push('🔴 Implement rotational grazing');
        recommendations.push('🔴 Conduct faecal egg counts');
    } else if (parasiteRisks.gutWorm === 'MEDIUM') {
        recommendations.push('🟡 Consider faecal testing for gut worms');
    }
    
    // Coccidia recommendations
    if (parasiteRisks.coccidia === 'HIGH') {
        recommendations.push('🔴 Treat young animals for coccidiosis');
        recommendations.push('🔴 Improve housing hygiene');
    } else if (parasiteRisks.coccidia === 'MEDIUM') {
        recommendations.push('🟡 Monitor young stock for coccidia signs');
    }
    
    // General advice based on weather
    if (weather.rainfall > 20) {
        recommendations.push('💧 High rainfall - check drainage on pastures');
    }
    
    if (weather.humidity > 80) {
        recommendations.push('💨 High humidity - parasite larvae survive longer');
    }
    
    // If all low risk
    if (recommendations.length === 0) {
        recommendations.push('✅ All parasite risks are low');
        recommendations.push('✅ Continue routine monitoring');
    }
    
    return recommendations;
}

// ========================================
// CLOSE DETAIL PANEL
// ========================================

const closePanel = document.getElementById('close-panel');

closePanel.addEventListener('click', function() {
    // Hide the detail panel
    appContainer.classList.remove('detail-open');
    
    // Remove selected highlight from farm list
    const allFarms = farmList.querySelectorAll('li');
    allFarms.forEach(li => li.classList.remove('selected'));
    
    // Reset map view to show all UK
    map.setView([54.0, -2.5], 6);
});

// ========================================
// REGION FILTER
// ========================================

const regionFilter = document.getElementById('region-filter');

regionFilter.addEventListener('change', function() {
    const selectedRegion = this.value;
    
    // Get all farm list items
    const farmItems = farmList.querySelectorAll('li');
    
    farmItems.forEach(item => {
        const farmRegion = item.dataset.region;
        
        if (selectedRegion === 'all' || farmRegion === selectedRegion) {
            // Show this farm
            item.style.display = 'block';
        } else {
            // Hide this farm
            item.style.display = 'none';
        }
    });
    
    // Also filter map markers
    farms.forEach(farm => {
        const marker = markers[farm.id];
        
        if (selectedRegion === 'all' || farm.region === selectedRegion) {
            // Show marker
            marker.addTo(map);
        } else {
            // Hide marker
            map.removeLayer(marker);
        }
    });
});