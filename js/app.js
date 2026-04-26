// ========================================
// THEME TOGGLE ^^ LIGHT AND DARK MODE
// ========================================

const themeToggle = document.getElementById('theme-toggle');

// Map tile URLs
const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const lightTiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

// This will store the current tile layer (set after map is created)
let currentTileLayer = null;

// Theme toggle click handler
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Only switch tiles if map exists
    if (typeof map !== 'undefined' && currentTileLayer) {
        map.removeLayer(currentTileLayer);
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️ Light Mode';
            currentTileLayer = L.tileLayer(darkTiles, {
                attribution: '© OpenStreetMap contributors © CARTO'
            }).addTo(map);
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
            currentTileLayer = L.tileLayer(lightTiles, {
                attribution: '© OpenStreetMap contributors © CARTO'
            }).addTo(map);
        }
    } else {
        // Map not ready yet, just toggle text
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️ Light Mode';
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
        }
    }
}

themeToggle.addEventListener('click', toggleTheme);

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
// Add initial tile layer and store reference
currentTileLayer = L.tileLayer(darkTiles, {
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
    marker.bindTooltip(farm.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -35]
    });
    markers[farm.id] = marker;
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
// HELPER - Build Parasite Cards (Sorted by Risk)
// ========================================

function buildParasiteCards(parasiteRisks) {
    const container = document.getElementById('parasite-cards-container');
    container.innerHTML = '';
    
    const parasiteData = [
        { name: 'Liver Fluke', key: 'liverFluke', risk: parasiteRisks.liverFluke, affects: 'Sheep & Cattle' },
        { name: 'Lungworm', key: 'lungworm', risk: parasiteRisks.lungworm, affects: 'Cattle (Dictyocaulus viviparus)' },
        { name: 'Gut Worms', key: 'gutWorm', risk: parasiteRisks.gutWorm, affects: 'Sheep & Cattle' },
        { name: 'Coccidia', key: 'coccidia', risk: parasiteRisks.coccidia, affects: 'Young livestock' }
    ];
    
    const riskOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
    parasiteData.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
    
    parasiteData.forEach(parasite => {
        const action = getParasiteAction(parasite.key, parasite.risk);
        
        const card = document.createElement('div');
        card.className = `parasite-card risk-${parasite.risk.toLowerCase()}`;
        card.innerHTML = `
            <div class="parasite-header">
                <span class="parasite-name">${parasite.name}</span>
                <span class="parasite-risk risk-${parasite.risk.toLowerCase()}">${parasite.risk}</span>
            </div>
            <p class="parasite-affects">Affects: ${parasite.affects}</p>
            <div class="parasite-action">
                <span class="action-label">✓ RECOMMENDED ACTION:</span>
                <p>${action}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ========================================
// SHOW FARM DETAILS - Professional Panel Styling (hopefully this one is final)
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
    
    // Fill in farm header
    farmNameEl.textContent = farm.name;
    farmLocationEl.textContent = farm.location;
    
    // Center map on selected farm
    map.setView([farm.lat, farm.lng], 10);
    markers[farmId].openPopup();
    
    // Show loading state
    document.getElementById('risk-level-display').textContent = 'Loading...';
    document.getElementById('temperature').textContent = '--°C';
    document.getElementById('humidity').textContent = '--%';
    document.getElementById('rainfall').textContent = '--mm';
    
    // Fetch weather data
    const weather = await fetchWeather(farm.lat, farm.lng);
    
    if (weather) {
        const season = getCurrentSeason();
        
        // Calculate risks
        const risk = calculateRisk(weather, season);
        const parasiteRisks = calculateParasiteRisks(weather, season);
        
        // Update Overall Risk Card
        const riskCard = document.getElementById('overall-risk-card');
        riskCard.className = 'overall-risk-card risk-' + risk.level.toLowerCase();
        document.getElementById('risk-level-display').textContent = risk.level;
        document.getElementById('risk-score').textContent = risk.score;
        
        // Generate risk description
        const riskDesc = generateRiskDescription(weather, season, risk.level);
        document.getElementById('risk-description').textContent = riskDesc;
        
        // Build parasite cards (sorted by risk)
        buildParasiteCards(parasiteRisks);

        // Update Score Breakdown
        updateScoreBreakdown(weather, season);
        
        // Update Weather Display
        document.getElementById('temperature').textContent = weather.temperature + '°C';
        document.getElementById('humidity').textContent = weather.humidity + '%';
        document.getElementById('rainfall').textContent = weather.rainfall + 'mm';
        document.getElementById('season').textContent = season;
        
        // Update Timeline Chart
        // Small delay to let the panel render
        setTimeout(() => {
            updateTimelineChart(farm);
        }, 100);
        
    } else {
        document.getElementById('risk-level-display').textContent = 'ERROR';
        document.getElementById('risk-description').textContent = 'Could not fetch weather data.';
    }
}

// ========================================
// HELPER - Generate Risk Description
// ========================================

function generateRiskDescription(weather, season, riskLevel) {
    let desc = `Risk is ${riskLevel} due to `;
    let factors = [];
    
    if (weather.humidity >= 70) factors.push(`elevated humidity (${weather.humidity}%)`);
    if (weather.temperature >= 15) factors.push(`warm temperatures (${weather.temperature}°C)`);
    if (weather.rainfall >= 10) factors.push(`recent rainfall (${weather.rainfall}mm)`);
    if (season === 'Spring') factors.push('spring season (peak larval activity)');
    if (season === 'Autumn') factors.push('autumn season (fluke risk elevated)');
    
    if (factors.length === 0) {
        return `Current conditions show ${riskLevel.toLowerCase()} parasite risk. Continue routine monitoring.`;
    }
    
    desc += factors.join(' and ') + '. These conditions favour parasite survival on pasture.';
    return desc;
}

// ========================================
// HELPER - Update Parasite Card
// ========================================

function updateParasiteCard(parasiteId, riskLevel, affects, action) {
    const card = document.getElementById(parasiteId + '-risk').closest('.parasite-card');
    const riskBadge = document.getElementById(parasiteId + '-risk');
    const actionDiv = document.getElementById(parasiteId + '-action');
    
    // Update card border color
    card.className = 'parasite-card risk-' + riskLevel.toLowerCase();
    
    // Update risk badge
    riskBadge.textContent = riskLevel;
    riskBadge.className = 'parasite-risk risk-' + riskLevel.toLowerCase();
    
    // Update action text
    actionDiv.querySelector('p').textContent = action;
}

// ========================================
// HELPER - Get Parasite Action Text
// ========================================

function getParasiteAction(parasite, riskLevel) {
    const actions = {
        liverFluke: {
            HIGH: 'Treat livestock for liver fluke immediately. Avoid grazing on wet pastures.',
            MEDIUM: 'Monitor for liver fluke. Consider faecal testing.',
            LOW: 'Continue routine monitoring.'
        },
        lungworm: {
            HIGH: 'Vaccinate cattle for lungworm. Monitor for coughing or labored breathing.',
            MEDIUM: 'Monitor for coughing or labored breathing. Rotate pastures.',
            LOW: 'Continue routine monitoring.'
        },
        gutWorm: {
            HIGH: 'Implement rotational grazing. Conduct faecal egg counts.',
            MEDIUM: 'Monitor for weight loss, diarrhea, or poor coat condition. Consider faecal testing.',
            LOW: 'Continue routine monitoring.'
        },
        coccidia: {
            HIGH: 'Treat young animals for coccidiosis. Improve housing hygiene.',
            MEDIUM: 'Monitor young stock for signs of coccidiosis.',
            LOW: 'Continue routine monitoring.'
        }
    };
    
    return actions[parasite][riskLevel];
}

// ========================================
// HELPER - Update Score Breakdown
// ========================================

function updateScoreBreakdown(weather, season) {
    // Temperature score (0-3)
    let tempScore = 0;
    if (weather.temperature >= 10) tempScore++;
    if (weather.temperature >= 15) tempScore++;
    if (weather.temperature >= 20) tempScore++;
    
    // Rainfall score (0-3)
    let rainScore = 0;
    if (weather.rainfall >= 5) rainScore++;
    if (weather.rainfall >= 15) rainScore++;
    if (weather.rainfall >= 30) rainScore++;
    
    // Humidity score (0-2)
    let humidityScore = 0;
    if (weather.humidity >= 60) humidityScore++;
    if (weather.humidity >= 75) humidityScore++;
    
    // Season score (0-2)
    let seasonScore = 0;
    if (season === 'Spring' || season === 'Autumn') seasonScore = 2;
    else if (season === 'Summer') seasonScore = 1;
    
    // Update bars
    document.getElementById('temp-score').style.width = (tempScore / 3 * 100) + '%';
    document.getElementById('temp-score-text').textContent = tempScore + '/3';
    
    document.getElementById('rain-score').style.width = (rainScore / 3 * 100) + '%';
    document.getElementById('rain-score-text').textContent = rainScore + '/3';
    
    document.getElementById('humidity-score').style.width = (humidityScore / 2 * 100) + '%';
    document.getElementById('humidity-score-text').textContent = humidityScore + '/2';
    
    document.getElementById('season-score').style.width = (seasonScore / 2 * 100) + '%';
    document.getElementById('season-score-text').textContent = seasonScore + '/2';
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
    console.log('Starting to load farm data...');
    
    for (const farm of farms) {
        markers[farm.id].setIcon(riskIcons.DEFAULT);
        
        const weather = await fetchWeather(farm.lat, farm.lng);
        
        if (weather) {
            const risk = calculateRisk(weather, getCurrentSeason());
            
            // Update marker with risk color
            markers[farm.id].setIcon(riskIcons[risk.level]);
            
            // Store data on farm object
            farm.weather = weather;
            farm.risk = risk;
            
            // ADD RISK BADGE TO FARM LIST
            const farmItem = farmList.querySelector(`li[data-id="${farm.id}"]`);
            if (farmItem) {
                // Remove existing badge if any
                const existingBadge = farmItem.querySelector('.risk-badge');
                if (existingBadge) existingBadge.remove();
                
                // Create new badge
                const badge = document.createElement('span');
                badge.className = `risk-badge risk-${risk.level.toLowerCase()}`;
                badge.textContent = risk.level;
                farmItem.appendChild(badge);
            }
            
            console.log(`Loaded: ${farm.name} - ${risk.level}`);
        }
    }
    
    console.log('All farm markers initialized with risk colors and badges!');
}

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


// ========================================
// TIMELINE CHART - 7 Day Risk History
// ========================================

let riskChart = null;

async function updateTimelineChart(farm) {
    const canvas = document.getElementById('risk-chart');
    
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${farm.lat}&longitude=${farm.lng}&daily=temperature_2m_max,precipitation_sum,relative_humidity_2m_max&timezone=Europe/London&past_days=7`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const dates = data.daily.time.slice(0, 7);
        const riskScores = [];
        
        for (let i = 0; i < 7; i++) {
            const dayWeather = {
                temperature: data.daily.temperature_2m_max[i],
                humidity: data.daily.relative_humidity_2m_max[i],
                rainfall: data.daily.precipitation_sum[i]
            };
            
            const risk = calculateRisk(dayWeather, getCurrentSeason());
            riskScores.push(risk.score);
        }
        
        const labels = dates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
        });
        
        if (riskChart) {
            riskChart.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        riskChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Risk Score',
                    data: riskScores,
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: riskScores.map(score => {
                        if (score <= 3) return '#4caf50';
                        if (score <= 6) return '#ff9800';
                        return '#f44336';
                    }),
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                            y: {
                                beginAtZero: true,
                                max: 10,
                                ticks: {
                                stepSize: 2
                                    }
                                }
                         },
                plugins: {
                    legend: {
                        display: false
                            }
                        }
}        });
        
        console.log('Chart created successfully!');
        
    } catch (error) {
        console.error('Timeline fetch error:', error);
    }
}


// ========================================
// INITIALIZE APP - Recalling it, MUST BE AT THE END
// ========================================
 
initializeFarmMarkers();

// ========================================
// ASSUMPTIONS & LIMITATIONS MODAL
// ========================================

const assumptionsBtn = document.getElementById('assumptions-btn');
const assumptionsModal = document.getElementById('assumptions-modal');
const closeModal = document.getElementById('close-modal');

if (assumptionsBtn && assumptionsModal && closeModal) {
    // Open modal
    assumptionsBtn.addEventListener('click', function() {
        assumptionsModal.classList.add('active');
    });

    // Close modal with X button
    closeModal.addEventListener('click', function() {
        assumptionsModal.classList.remove('active');
    });

    // Close modal by clicking outside
    assumptionsModal.addEventListener('click', function(e) {
        if (e.target === assumptionsModal) {
            assumptionsModal.classList.remove('active');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && assumptionsModal.classList.contains('active')) {
            assumptionsModal.classList.remove('active');
        }
    });
} else {
    console.error('Modal elements not found!');
}




