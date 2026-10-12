/**
 * =========================================================================
 * CAMPUS CONNECT — CLIENT APPLICATION & ADVANCED NAVIGATION CONTROLLER
 * =========================================================================
 * Institution: CMR College of Engineering & Technology (CMRCET)
 * Features:
 * - Campus Location Search with Instant Result Cards
 * - Reusable `LocationImage` component with strict "Picture Coming Soon" placeholder
 * - Full Turn-by-Turn Route Navigation with Leaflet Interactive Map
 * - Live GPS Movement Tracking with High-Accuracy watchPosition
 * - Real-Time Movement Trace Recording (distinguished from Planned Route)
 * - Off-Route Detection & Dynamic Route Recalculation
 * - GPS Recenter, Pause/Resume, End Navigation with Confirmation
 * - Verified Arrival Detection Modal
 * - Desktop/Reviewer GPS Simulation Controls for Testing
 * - AI Chatbot Location Integration with One-Click Navigation
 * - Admin Suite (Announcements, Location Photo Upload & Removal, Rules)
 * - Global Instant Search (Ctrl+K)
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize application modules
  initNavbar();
  renderAllSections();
  initCampusLocationSearch();
  initCampusLeafletMap();
  initRoutePlanner();
  initLiveNavigationController();
  initGpsSimulator();
  initChatbotUI();
  initSearchModal();
  initAdminSuite();
  initModals();
  initQuickQuestions();
  initKeyboardShortcuts();
});

/* =========================================================================
   1. GLOBAL RENDER ALL SECTIONS
   ========================================================================= */
function renderAllSections() {
  renderLocationDirectory();
  renderAnnouncements();
  renderRulesAndProcedures();
  renderDepartments();
  updateRouteSelectOptions();
  updateFooterInfo();
}

/* =========================================================================
   2. REUSABLE LOCATION IMAGE COMPONENT (STRICT IMPLEMENTATION)
   =========================================================================
   Rule:
   - If image is a valid non-empty string -> render <img> with onerror fallback.
   - If image is null / empty / fails -> render elegant "Picture Coming Soon" component.
   - NEVER use random/stock/internet images!
   ========================================================================= */
function renderPictureComingSoon(locationName) {
  return `
    <div class="location-img-placeholder" role="img" aria-label="Picture Coming Soon for ${escapeHtml(locationName || 'location')}">
      <div class="placeholder-icon-wrap">
        <i class="fa-solid fa-camera"></i>
      </div>
      <div class="placeholder-title">Picture Coming Soon</div>
      <div class="placeholder-sub">CMRCET location photo will be added here.</div>
    </div>
  `;
}

function handleLocationImageError(imgEl) {
  if (imgEl && imgEl.parentElement) {
    const locName = imgEl.getAttribute('data-loc-name') || '';
    imgEl.parentElement.innerHTML = renderPictureComingSoon(locName);
  }
}

function renderLocationImage(imageSrc, locationName) {
  if (imageSrc && typeof imageSrc === 'string' && imageSrc.trim() !== '') {
    return `
      <div class="location-img-container">
        <img 
          src="${escapeHtml(imageSrc)}" 
          alt="${escapeHtml(locationName || 'CMRCET Location')}" 
          data-loc-name="${escapeHtml(locationName || '')}"
          class="location-img" 
          loading="lazy"
          onerror="handleLocationImageError(this);"
        />
      </div>
    `;
  }
  return `
    <div class="location-img-container">
      ${renderPictureComingSoon(locationName)}
    </div>
  `;
}

/* =========================================================================
   3. CAMPUS LOCATION SEARCH & RESULT CARD
   ========================================================================= */
function initCampusLocationSearch() {
  const form = document.getElementById('campus-location-search-form');
  const input = document.getElementById('campus-loc-search-input');
  const resultContainer = document.getElementById('campus-search-result-container');

  if (!form || !input || !resultContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    searchCampusLocation(query);
  });
}

function searchCampusLocation(rawQuery) {
  const resultContainer = document.getElementById('campus-search-result-container');
  if (!resultContainer) return;

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const locations = data.locations || [];

  const cleaned = rawQuery.toLowerCase().replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();

  // Find best match in verified CMRCET locations (Prioritized)
  let matchedLoc = null;

  // 1. Direct ID or exact name match
  for (const loc of locations) {
    if (cleaned === loc.id.toLowerCase() || cleaned === loc.name.toLowerCase()) {
      matchedLoc = loc;
      break;
    }
  }

  // 2. Exact keyword match
  if (!matchedLoc) {
    for (const loc of locations) {
      if (loc.keywords && loc.keywords.some(kw => kw.toLowerCase() === cleaned)) {
        matchedLoc = loc;
        break;
      }
    }
  }

  // 3. Keyword contains or is contained in query
  if (!matchedLoc) {
    for (const loc of locations) {
      if (loc.keywords && loc.keywords.some(kw => cleaned.includes(kw.toLowerCase()) || kw.toLowerCase().includes(cleaned))) {
        matchedLoc = loc;
        break;
      }
    }
  }

  // 4. Name contains or is contained in query
  if (!matchedLoc) {
    for (const loc of locations) {
      if (cleaned.includes(loc.name.toLowerCase()) || loc.name.toLowerCase().includes(cleaned)) {
        matchedLoc = loc;
        break;
      }
    }
  }

  if (matchedLoc) {
    const googleMapsUrl = (matchedLoc.latitude && matchedLoc.longitude)
      ? `https://www.google.com/maps/dir/?api=1&destination=${matchedLoc.latitude},${matchedLoc.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=CMRCET+${encodeURIComponent(matchedLoc.name)}`;

    resultContainer.innerHTML = `
      <div class="location-search-result-card" id="search-result-card-${matchedLoc.id}">
        <div class="search-result-header-row">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="category-badge">${escapeHtml(matchedLoc.category)}</span>
            <span class="location-code">${escapeHtml(matchedLoc.code || '')}</span>
          </div>
          <button class="chat-action-btn" onclick="document.getElementById('campus-search-result-container').innerHTML='';" title="Close Result" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div class="search-result-body">
          <div style="display: grid; grid-template-columns: 240px 1fr; gap: 20px; align-items: center;">
            <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); height: 160px;">
              ${renderLocationImage(matchedLoc.image, matchedLoc.name)}
            </div>
            <div>
              <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 8px;">${escapeHtml(matchedLoc.name)}</h3>
              <div class="location-meta-row" style="margin-bottom: 10px;">
                <span class="location-meta-item"><i class="fa-solid fa-location-dot"></i> CMRCET Campus</span>
                <span class="location-meta-item"><i class="fa-solid fa-building"></i> ${escapeHtml(matchedLoc.building)}, ${escapeHtml(matchedLoc.floor)}</span>
                <span class="location-meta-item"><i class="fa-solid fa-person-walking"></i> ${escapeHtml(matchedLoc.distance)} (${escapeHtml(matchedLoc.walkingTime)})</span>
              </div>
              <p style="font-size: 0.885rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0;">${escapeHtml(matchedLoc.description)}</p>
            </div>
          </div>

          <div class="search-result-actions-row">
            <button class="btn btn-secondary btn-sm" onclick="showRouteForLocation('${matchedLoc.id}')">
              <i class="fa-solid fa-route"></i> View Route
            </button>
            <button class="btn btn-primary btn-sm" onclick="startNavigationToLocation('${matchedLoc.id}')">
              <i class="fa-solid fa-diamond-turn-right"></i> Start Navigation
            </button>
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-map-location-dot"></i> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    `;

    // Also update destination in route planner and pan satellite map
    const destSelect = document.getElementById('route-dest-select');
    if (destSelect) {
      destSelect.value = matchedLoc.id;
      calculateAndRenderRoute();
    }

    // Synchronize selection across reference directory and map marker
    if (typeof selectCampusBuilding === 'function') {
      selectCampusBuilding(matchedLoc.id, true);
    } else if (leafletMap && matchedLoc.latitude && matchedLoc.longitude) {
      leafletMap.flyTo([matchedLoc.latitude, matchedLoc.longitude], 18, { duration: 1.0 });
      if (typeof mapLocationMarkers !== 'undefined' && mapLocationMarkers[matchedLoc.id]) {
        mapLocationMarkers[matchedLoc.id].openPopup();
      }
    }
  } else {
    // STRICT REQUIREMENT: If unknown location searched, display strict message
    resultContainer.innerHTML = `
      <div class="unknown-location-alert">
        <i class="fa-solid fa-circle-exclamation" style="font-size: 1.2rem;"></i>
        <span>Sorry, this location is not available in the Campus Connect information.</span>
      </div>
    `;
  }
}

/* =========================================================================
   4. CAMPUS LOCATIONS DIRECTORY
   ========================================================================= */
let activeLocationCategory = 'All';

function renderLocationDirectory() {
  const container = document.getElementById('locations-container');
  if (!container) return;

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const locations = data.locations || [];

  const filtered = activeLocationCategory === 'All'
    ? locations
    : locations.filter(loc => loc.category.toLowerCase() === activeLocationCategory.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-card);">
        <i class="fa-solid fa-map-location-dot" style="font-size: 2rem; margin-bottom: 12px; color: var(--text-muted);"></i>
        <p>No campus locations found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(loc => `
    <div class="location-card" data-id="${loc.id}">
      ${renderLocationImage(loc.image, loc.name)}
      <div class="location-card-body">
        <div class="location-badge-row">
          <span class="category-badge">${escapeHtml(loc.category)}</span>
          <span class="location-code">${escapeHtml(loc.code || '')}</span>
        </div>
        <h4 class="location-title">${escapeHtml(loc.name)}</h4>
        <div class="location-meta-row">
          <span class="location-meta-item">
            <i class="fa-solid fa-building"></i> ${escapeHtml(loc.building)}
          </span>
          <span class="location-meta-item">
            <i class="fa-solid fa-stairs"></i> ${escapeHtml(loc.floor)}
          </span>
          <span class="location-meta-item">
            <i class="fa-solid fa-person-walking"></i> ${escapeHtml(loc.distance)} (${escapeHtml(loc.walkingTime)})
          </span>
        </div>
        <p class="location-desc">${escapeHtml(loc.description)}</p>
        <div class="location-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="openLocationDetailsModal('${loc.id}')">
            <i class="fa-solid fa-circle-info"></i> Details
          </button>
          <button class="btn btn-secondary btn-sm" onclick="showRouteForLocation('${loc.id}')">
            <i class="fa-solid fa-route"></i> Route
          </button>
          <button class="btn btn-primary btn-sm" onclick="startNavigationToLocation('${loc.id}')">
            <i class="fa-solid fa-diamond-turn-right"></i> Navigate
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Category filter chip listener
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-chip')) {
    const parent = e.target.parentElement;
    parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    activeLocationCategory = e.target.getAttribute('data-category') || 'All';
    renderLocationDirectory();
  }
});

/* =========================================================================
   5. LOCATION DETAILS MODAL
   ========================================================================= */
function openLocationDetailsModal(locId) {
  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const loc = data.locations.find(l => l.id === locId);
  if (!loc) return;

  const modalBody = document.getElementById('location-modal-body');
  const modal = document.getElementById('location-modal-backdrop');
  if (!modalBody || !modal) return;

  const googleMapsUrl = (loc.latitude && loc.longitude) 
    ? `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=CMRCET+${encodeURIComponent(loc.name)}`;

  const galleryHtml = (loc.gallery && loc.gallery.length > 1) ? `
    <div class="modal-gallery-bar" style="display: flex; gap: 8px; margin-top: 10px; align-items: center; justify-content: center;">
      ${loc.gallery.map((gImg, idx) => `
        <button type="button" class="btn btn-xs ${gImg === loc.image ? 'btn-primary' : 'btn-secondary'}" 
          onclick="document.getElementById('modal-main-image-slot').innerHTML = renderLocationImage('${escapeHtml(gImg)}', '${escapeHtml(loc.name)}'); this.parentElement.querySelectorAll('button').forEach(b => { b.className = 'btn btn-xs btn-secondary'; }); this.className = 'btn btn-xs btn-primary';"
          style="font-size: 0.75rem;">
          <i class="fa-solid fa-camera"></i> Photo ${idx + 1}${idx === 0 ? ' (Exterior)' : ' (Office)'}
        </button>
      `).join('')}
    </div>
  ` : '';

  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div id="modal-main-image-slot">
        ${renderLocationImage(loc.image, loc.name)}
      </div>
      ${galleryHtml}
    </div>
    <div style="padding: 24px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <span class="category-badge">${escapeHtml(loc.category)}</span>
        <span class="location-code">${escapeHtml(loc.code || '')}</span>
      </div>
      <h2 style="font-size: 1.5rem; margin-bottom: 14px; color: var(--text-primary);">${escapeHtml(loc.name)}</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-transform: uppercase;">Building & Floor</span>
          <strong style="font-size: 0.9rem; color: var(--text-primary);">${escapeHtml(loc.building)}, ${escapeHtml(loc.floor)}</strong>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-transform: uppercase;">Room / Area</span>
          <strong style="font-size: 0.9rem; color: var(--text-primary);">${escapeHtml(loc.roomNumber || 'N/A')}</strong>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-transform: uppercase;">Distance / Walk</span>
          <strong style="font-size: 0.9rem; color: var(--text-primary);">${escapeHtml(loc.distance)} (${escapeHtml(loc.walkingTime)})</strong>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-transform: uppercase;">Working Timings</span>
          <strong style="font-size: 0.9rem; color: var(--text-primary);">${escapeHtml(loc.timings || '9:15 AM – 4:00 PM')}</strong>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--text-primary);"><i class="fa-solid fa-align-left highlight-accent"></i> Description</h4>
        <p style="font-size: 0.925rem; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(loc.description)}</p>
      </div>

      ${loc.routeSteps && loc.routeSteps.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 1rem; margin-bottom: 12px; color: var(--text-primary);"><i class="fa-solid fa-route highlight-accent"></i> Walking Route from Main Gate</h4>
          <ol style="padding-left: 20px; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
            ${loc.routeSteps.map(step => `<li style="margin-bottom: 6px;">${escapeHtml(step)}</li>`).join('')}
          </ol>
        </div>
      ` : ''}

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="showRouteForLocation('${loc.id}'); closeAllModals();" style="flex: 1;">
          <i class="fa-solid fa-route"></i> View Route
        </button>
        <button class="btn btn-primary" onclick="startNavigationToLocation('${loc.id}'); closeAllModals();" style="flex: 1;">
          <i class="fa-solid fa-diamond-turn-right"></i> Start Navigation
        </button>
        <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="flex: 1;">
          <i class="fa-solid fa-map-location-dot"></i> Google Maps
        </a>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

/* =========================================================================
   6. INTERACTIVE SATELLITE CAMPUS MAP & ROUTE PLANNER (REFERENCE DESIGN)
   ========================================================================= */
let leafletMap = null;
let plannedRoutePolyline = null;
let movementTracePolyline = null;
let liveGpsMarker = null;
let activeDestMarker = null;
let currentMapLayer = 'satellite';
let baseTileLayers = {};
let mapLocationMarkers = {};
let satelliteTileErrorCount = 0;
let selectedCampusBuildingId = null;
let campusBoundaryLayer = null;
let referenceEntranceMarkers = [];
let referenceParkingMarker = null;

// Verified CMRCET Kandlakoya Campus Boundary Polygon Coordinates
const cmrcetCampusBoundary = [
  [17.603300, 78.485000],
  [17.604200, 78.485500],
  [17.604600, 78.485800],
  [17.605700, 78.486500],
  [17.606050, 78.487200],
  [17.606180, 78.488400],
  [17.605400, 78.488650],
  [17.604350, 78.488250],
  [17.603650, 78.487400],
  [17.603400, 78.486200],
  [17.603300, 78.485000]
];

// Reference building sequence order (1..16)
const campusBuildingOrder = [
  'block1-admin',        // 1 - Block 1 Administrative Block & Principal's Office
  'block2-cse',          // 2 - Block 2 Computer Science & Engineering (CSE) & IT
  'block3-ece',          // 3 - Block 3 Electronics & Communication (ECE) & EEE
  'block4-mech-civil',   // 4 - Block 4 Mechanical & Civil Engineering
  'library',             // 5 - CMRCET Central Digital Library
  'exam-cell',           // 6 - Examination Branch & Autonomous Cell
  'placement-cell',      // 7 - Training & Placement (T&P) Cell
  'innovation-cell',     // 8 - Centre for Innovation, Incubation & Entrepreneurship (CIIE)
  'auditorium',          // 9 - CMR Central Auditorium & Convention Centre
  'canteen',             // 10 - CMRCET Canteen & Food Court
  'health-centre',       // 11 - CMR Campus Health Centre & Medical Clinic
  'sports-complex',      // 12 - CMRCET Sports Complex & Athletic Grounds
  'boys-hostel',         // 13 - CMR Campus Boys Hostel
  'girls-hostel',        // 14 - CMR Campus Girls Hostel
  'parking',             // 15 - CMRCET Student & Faculty Parking Plaza
  'main-gate'            // 16 - CMRCET Main Entrance Gate
];

// Numbered Blue/Red Circular Marker matching Reference Image
function createReferenceMarkerIcon(num, name, isSelected = false) {
  return L.divIcon({
    className: 'campus-ref-marker-wrap',
    html: `
      <div class="campus-ref-marker ${isSelected ? 'selected' : ''}" title="${escapeHtml(name)}">
        <span>${num}</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
}

// Parking 'P' Square Badge Marker
function createParkingMarkerIcon() {
  return L.divIcon({
    className: 'campus-ref-marker-wrap',
    html: `<div class="campus-ref-parking-badge" title="CMRCET Parking Plaza">P</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14]
  });
}

// Entrance Arrow Marker pointing into campus
function createEntranceArrowIcon(isMain = true) {
  const label = isMain ? 'INGRESSO PRINCIPALE' : 'INGRESSO SECONDARIO';
  return L.divIcon({
    className: 'campus-ref-marker-wrap',
    html: `
      <div class="campus-ref-entrance-arrow" title="${label}">
        <div class="arrow-icon"><i class="fa-solid fa-arrow-down"></i></div>
        <span class="arrow-label">${label}</span>
      </div>
    `,
    iconSize: [80, 36],
    iconAnchor: [40, 28],
    popupAnchor: [0, -28]
  });
}

function getCategoryIconClass(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return 'fa-solid fa-utensils';
  if (cat.includes('academic') || cat.includes('library')) return 'fa-solid fa-book-open';
  if (cat.includes('admin')) return 'fa-solid fa-building-columns';
  if (cat.includes('sports')) return 'fa-solid fa-futbol';
  if (cat.includes('hostel') || cat.includes('residen')) return 'fa-solid fa-bed';
  if (cat.includes('entrance') || cat.includes('gate')) return 'fa-solid fa-door-open';
  if (cat.includes('lab') || cat.includes('tech')) return 'fa-solid fa-laptop-code';
  return 'fa-solid fa-location-dot';
}

function getCategoryPinClass(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return 'cat-food';
  if (cat.includes('sports')) return 'cat-sports';
  if (cat.includes('admin')) return 'cat-admin';
  return '';
}

function createCampusMarkerIcon(category, name) {
  const iconClass = getCategoryIconClass(category);
  const pinClass = getCategoryPinClass(category);
  return L.divIcon({
    className: 'custom-campus-pin-wrap',
    html: `
      <div class="campus-map-marker-pin ${pinClass}" title="${escapeHtml(name)}">
        <i class="${iconClass}"></i>
        <span class="marker-pulse"></span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

function showMapFallback(message) {
  const banner = document.getElementById('map-fallback-banner');
  const msgEl = document.getElementById('map-fallback-msg');
  if (banner && msgEl) {
    msgEl.textContent = message || 'Satellite map is temporarily unavailable.';
    banner.style.display = 'flex';
  }
}

function switchMapLayer(layerKey, isFallback = false) {
  if (!leafletMap || !baseTileLayers[layerKey]) return;

  Object.keys(baseTileLayers).forEach(k => {
    const layer = baseTileLayers[k];
    if (leafletMap.hasLayer(layer)) {
      leafletMap.removeLayer(layer);
    }
  });

  baseTileLayers[layerKey].addTo(leafletMap);
  currentMapLayer = layerKey;

  if (campusBoundaryLayer) campusBoundaryLayer.bringToFront();
  if (plannedRoutePolyline) plannedRoutePolyline.bringToFront();
  if (movementTracePolyline) movementTracePolyline.bringToFront();
  if (liveGpsMarker) liveGpsMarker.bringToFront();

  document.querySelectorAll('.map-layer-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layer === layerKey);
  });

  if (!isFallback) {
    const names = { satellite: 'Satellite', hybrid: 'Hybrid', map: 'Street Map' };
    showToast(`Switched to ${names[layerKey] || layerKey} view`, 'info');
  }
}

function selectCampusBuilding(locId, shouldFly = true) {
  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const locations = data.locations || [];
  const loc = locations.find(l => l.id === locId);
  if (!loc) return;

  if (selectedCampusBuildingId && selectedCampusBuildingId !== locId) {
    const prevLoc = locations.find(l => l.id === selectedCampusBuildingId);
    if (prevLoc && mapLocationMarkers[prevLoc.id]) {
      mapLocationMarkers[prevLoc.id].setIcon(
        createReferenceMarkerIcon(prevLoc.refNum, prevLoc.name, false)
      );
      mapLocationMarkers[prevLoc.id].setZIndexOffset(100);
    }
    const prevDirItem = document.getElementById(`ref-dir-item-${selectedCampusBuildingId}`);
    if (prevDirItem) prevDirItem.classList.remove('selected');
  }

  selectedCampusBuildingId = locId;

  if (mapLocationMarkers[loc.id]) {
    mapLocationMarkers[loc.id].setIcon(
      createReferenceMarkerIcon(loc.refNum, loc.name, true)
    );
    mapLocationMarkers[loc.id].setZIndexOffset(1000);
  }

  const dirItem = document.getElementById(`ref-dir-item-${loc.id}`);
  if (dirItem) {
    dirItem.classList.add('selected');
    dirItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const destSelect = document.getElementById('route-dest-select');
  if (destSelect && destSelect.value !== locId) {
    destSelect.value = locId;
  }

  if (shouldFly && leafletMap && loc.latitude && loc.longitude) {
    leafletMap.flyTo([loc.latitude, loc.longitude], 18, {
      duration: 0.8,
      easeLinearity: 0.25
    });
    setTimeout(() => {
      if (mapLocationMarkers[loc.id]) {
        mapLocationMarkers[loc.id].openPopup();
      }
    }, 850);
  } else if (mapLocationMarkers[loc.id]) {
    mapLocationMarkers[loc.id].openPopup();
  }
}

function renderCampusReferenceDirectory(orderedLocations) {
  const listEl = document.getElementById('ref-directory-list');
  if (!listEl) return;

  listEl.innerHTML = orderedLocations.map(loc => `
    <div class="ref-dir-item ${loc.id === selectedCampusBuildingId ? 'selected' : ''}" data-id="${loc.id}" id="ref-dir-item-${loc.id}" onclick="selectCampusBuilding('${loc.id}', true)">
      <div class="ref-dir-number">${loc.refNum}</div>
      <div class="ref-dir-info">
        <div class="ref-dir-name">${escapeHtml(loc.name)}</div>
        <div class="ref-dir-meta">
          <span><i class="fa-solid fa-building"></i> ${escapeHtml(loc.building)}</span>
          <span>&bull;</span>
          <span>${escapeHtml(loc.category)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function initCampusLeafletMap() {
  const mapDiv = document.getElementById('campus-map-view');
  if (!mapDiv || typeof L === 'undefined') return;

  try {
    const cmrcetCenter = [17.6046671, 78.4865205];
    
    leafletMap = L.map('campus-map-view', {
      zoomControl: true,
      attributionControl: true,
      center: cmrcetCenter,
      zoom: 17
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      maxNativeZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; CMRCET Aerial Imagery'
    });

    const hybridLayer = L.layerGroup([
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        maxNativeZoom: 19
      }),
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        maxNativeZoom: 19,
        attribution: 'Labels &copy; Esri'
      })
    ]);

    const standardMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    satelliteLayer.on('tileerror', function() {
      satelliteTileErrorCount++;
      if (satelliteTileErrorCount >= 4 && currentMapLayer === 'satellite') {
        showMapFallback('Satellite map is temporarily unavailable. Loaded fallback map.');
        switchMapLayer('map', true);
      }
    });

    baseTileLayers = {
      satellite: satelliteLayer,
      hybrid: hybridLayer,
      map: standardMapLayer
    };

    satelliteLayer.addTo(leafletMap);
    currentMapLayer = 'satellite';

    // Render verified Campus Boundary Polygon with glowing high-contrast outline
    campusBoundaryLayer = L.polygon(cmrcetCampusBoundary, {
      color: '#38bdf8',
      weight: 3.5,
      dashArray: '8, 6',
      fillColor: '#0284c7',
      fillOpacity: 0.08,
      lineJoin: 'round'
    }).addTo(leafletMap);

    // Number and organize campus locations matching reference design
    const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
    const locations = (data.locations || []).slice();

    const orderedLocations = [];
    campusBuildingOrder.forEach((id, index) => {
      const loc = locations.find(l => l.id === id);
      if (loc) {
        loc.refNum = index + 1;
        orderedLocations.push(loc);
      }
    });
    // Add any remaining locations not explicitly ordered
    locations.forEach(loc => {
      if (!orderedLocations.some(l => l.id === loc.id)) {
        loc.refNum = orderedLocations.length + 1;
        orderedLocations.push(loc);
      }
    });

    mapLocationMarkers = {};

    orderedLocations.forEach(loc => {
      if (loc.latitude && loc.longitude) {
        const isDefaultSelected = (loc.id === 'block1-admin');
        const markerIcon = createReferenceMarkerIcon(loc.refNum, loc.name, isDefaultSelected);
        const marker = L.marker([loc.latitude, loc.longitude], {
          icon: markerIcon,
          zIndexOffset: isDefaultSelected ? 1000 : 100
        }).addTo(leafletMap);

        const shortDesc = (loc.description && loc.description.length > 105) 
          ? loc.description.substring(0, 105) + '...' 
          : (loc.description || '');

        const hasPopupImg = loc.image && typeof loc.image === 'string' && loc.image.trim() !== '';
        marker.bindPopup(`
          <div class="campus-popup-card">
            ${hasPopupImg ? `
              <div class="popup-thumb-wrap" style="height: 105px; overflow: hidden; border-radius: 6px 6px 0 0; margin: -14px -16px 10px -16px; background: #000;">
                <img src="${escapeHtml(loc.image)}" alt="${escapeHtml(loc.name)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none';">
              </div>
            ` : ''}
            <div class="popup-header">
              <span class="popup-badge">${escapeHtml(loc.category || 'Location')}</span>
              <span class="popup-code">#${loc.refNum} &bull; ${escapeHtml(loc.code || '')}</span>
            </div>
            <h4 class="popup-title">${escapeHtml(loc.name)}</h4>
            <div class="popup-meta">
              <span><i class="fa-solid fa-building"></i> ${escapeHtml(loc.building)} | ${escapeHtml(loc.floor)}</span>
            </div>
            <p class="popup-desc">${escapeHtml(shortDesc)}</p>
            <div class="popup-actions">
              <button class="btn btn-secondary btn-xs popup-route-btn" onclick="showRouteForLocation('${loc.id}')">
                <i class="fa-solid fa-route"></i> Route
              </button>
              <button class="btn btn-primary btn-xs popup-nav-btn" onclick="startNavigationToLocation('${loc.id}')">
                <i class="fa-solid fa-diamond-turn-right"></i> Navigate
              </button>
            </div>
          </div>
        `, {
          className: 'campus-leaflet-popup',
          maxWidth: 280,
          minWidth: 240
        });

        marker.on('click', () => {
          selectCampusBuilding(loc.id, false);
        });

        mapLocationMarkers[loc.id] = marker;
      }
    });

    // Render verified Entrance Arrow Markers (Gate 1 & Secondary Gate)
    const mainEntranceMarker = L.marker([17.604250, 78.485900], {
      icon: createEntranceArrowIcon(true),
      zIndexOffset: 50
    }).addTo(leafletMap);
    mainEntranceMarker.bindPopup('<strong>Main Entrance (Gate 1)</strong><br>Medchal Highway, Kandlakoya');

    const secondaryEntranceMarker = L.marker([17.605850, 78.488300], {
      icon: createEntranceArrowIcon(false),
      zIndexOffset: 50
    }).addTo(leafletMap);
    secondaryEntranceMarker.bindPopup('<strong>Secondary Entrance</strong><br>East Campus / Residential Zone Gate');

    // Render verified Parking Marker ('P' Blue Square Symbol)
    referenceParkingMarker = L.marker([17.604150, 78.485700], {
      icon: createParkingMarkerIcon(),
      zIndexOffset: 60
    }).addTo(leafletMap);
    referenceParkingMarker.bindPopup('<strong>CMRCET Parking Plaza (PARCHEGGIO)</strong><br>Two-wheeler and four-wheeler parking bays');

    // Populate Right-Side Reference Campus Directory
    renderCampusReferenceDirectory(orderedLocations);
    selectedCampusBuildingId = 'block1-admin';

    // Directory Search Filter Listener
    const dirSearchInput = document.getElementById('ref-directory-search-input');
    if (dirSearchInput) {
      dirSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.ref-dir-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'flex' : 'none';
        });
      });
    }

    // Directory Collapse/Expand Toggle Listener
    const collapseBtn = document.getElementById('ref-toggle-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        const dir = document.getElementById('campus-reference-directory');
        if (dir) {
          dir.classList.toggle('collapsed');
          setTimeout(() => {
            if (leafletMap) leafletMap.invalidateSize();
          }, 320);
        }
      });
    }

    // Map layer toggle buttons
    document.querySelectorAll('.map-layer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetLayer = e.currentTarget.dataset.layer;
        if (targetLayer && baseTileLayers[targetLayer]) {
          switchMapLayer(targetLayer);
        }
      });
    });

    // Fallback close button handler
    const fallbackCloseBtn = document.getElementById('map-fallback-close-btn');
    if (fallbackCloseBtn) {
      fallbackCloseBtn.addEventListener('click', () => {
        const banner = document.getElementById('map-fallback-banner');
        if (banner) banner.style.display = 'none';
      });
    }

    // Locate Me button with robust error handling and HTTPS check
    const locateBtn = document.getElementById('btn-gps-locate-me');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        if (!('geolocation' in navigator)) {
          showToast('Geolocation is not supported by your browser.', 'error');
          return;
        }
        const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!isSecure) {
          showToast('Note: Browser GPS requires HTTPS or localhost.', 'warning');
        }
        showToast('Getting your GPS position...', 'info');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy || 20;

            updateLiveGpsMarker(userLat, userLng, accuracy);
            leafletMap.flyTo([userLat, userLng], 18, { duration: 1.0 });
            showToast(`Current location detected (±${Math.round(accuracy)}m)`, 'success');
          },
          (err) => {
            let msg = 'Could not obtain location.';
            if (err.code === 1) {
              msg = 'Location permission was denied. Allow location access in browser settings.';
            } else if (err.code === 2) {
              msg = 'Location unavailable. Ensure GPS is enabled on your device.';
            } else if (err.code === 3) {
              msg = 'Location request timed out. Please try again.';
            }
            showToast(msg, 'error');
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      });
    }
  } catch (e) {
    console.warn("Leaflet map initialization error:", e);
    showMapFallback('Satellite map is temporarily unavailable.');
  }
}

function updateRouteSelectOptions() {
  const originSelect = document.getElementById('route-origin-select');
  const destSelect = document.getElementById('route-dest-select');
  if (!originSelect || !destSelect) return;

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const locations = data.locations || [];

  const currentOrigin = originSelect.value || 'main-gate';
  const currentDest = destSelect.value || 'library';

  const originOptions = [
    `<option value="current-gps">🟢 Current Location (Live GPS)</option>`,
    ...locations.map(loc => `<option value="${loc.id}">${escapeHtml(loc.name)}</option>`)
  ].join('');

  const destOptions = locations.map(loc => `
    <option value="${loc.id}">${escapeHtml(loc.name)}</option>
  `).join('');

  originSelect.innerHTML = originOptions;
  destSelect.innerHTML = destOptions;

  originSelect.value = currentOrigin;
  destSelect.value = currentDest;
}

function initRoutePlanner() {
  const originSelect = document.getElementById('route-origin-select');
  const destSelect = document.getElementById('route-dest-select');
  const swapBtn = document.getElementById('route-swap-btn');
  const viewBtn = document.getElementById('route-view-btn');
  const startNavBtn = document.getElementById('route-start-nav-btn');

  if (originSelect && destSelect) {
    originSelect.addEventListener('change', calculateAndRenderRoute);
    destSelect.addEventListener('change', calculateAndRenderRoute);
  }

  if (swapBtn && originSelect && destSelect) {
    swapBtn.addEventListener('click', () => {
      if (originSelect.value === 'current-gps') {
        showToast('Cannot swap Live GPS as a static destination.', 'info');
        return;
      }
      const temp = originSelect.value;
      originSelect.value = destSelect.value;
      destSelect.value = temp;
      calculateAndRenderRoute();
    });
  }

  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      const destId = destSelect.value;
      showRouteForLocation(destId);
    });
  }

  if (startNavBtn) {
    startNavBtn.addEventListener('click', () => {
      const destId = destSelect.value;
      startNavigationToLocation(destId);
    });
  }

  // Initial calculation
  calculateAndRenderRoute();
}

function showRouteForLocation(destLocId) {
  const destSelect = document.getElementById('route-dest-select');
  if (destSelect) {
    destSelect.value = destLocId;
    if (typeof selectCampusBuilding === 'function') {
      selectCampusBuilding(destLocId, true);
    }
    calculateAndRenderRoute();
    drawRouteOnMap();

    const routeSection = document.getElementById('navigation');
    if (routeSection) {
      routeSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}


async function calculateAndRenderRoute() {
  const originSelect = document.getElementById('route-origin-select');
  const destSelect = document.getElementById('route-dest-select');
  const distEl = document.getElementById('route-distance-val');
  const timeEl = document.getElementById('route-time-val');
  const stepsList = document.getElementById('route-steps-list');
  const stepCountBadge = document.getElementById('route-step-count');
  const extBtn = document.getElementById('route-external-directions-btn');

  if (!originSelect || !destSelect) return;

  const data =
    (typeof collegeData !== 'undefined' && collegeData)
      ? collegeData
      : defaultCollegeData;

  const isGpsOrigin = originSelect.value === 'current-gps';
  const origin = isGpsOrigin
    ? null
    : data.locations.find(l => l.id === originSelect.value);

  const dest = data.locations.find(l => l.id === destSelect.value);

  if (!dest) {
    if (stepsList) stepsList.textContent = 'Please select a destination.';
    return;
  }

  // Require real coordinates; do not invent a route.
  const hasCoordinates = location =>
    location &&
    Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude)) &&
    location.latitude !== '' &&
    location.longitude !== '' &&
    Number(location.latitude) >= -90 &&
    Number(location.latitude) <= 90 &&
    Number(location.longitude) >= -180 &&
    Number(location.longitude) <= 180;

  // Update the external Google Maps link.
  if (extBtn) {
    if (hasCoordinates(dest)) {
      const destination =
        `${dest.latitude},${dest.longitude}`;

      const originQuery =
        !isGpsOrigin && hasCoordinates(origin)
          ? `&origin=${origin.latitude},${origin.longitude}`
          : '';

      extBtn.href =
        'https://www.google.com/maps/dir/?api=1' +
        `&destination=${encodeURIComponent(destination)}` +
        originQuery +
        '&travelmode=walking';

      extBtn.target = '_blank';
      extBtn.rel = 'noopener noreferrer';
    } else {
      extBtn.href =
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(`CMRCET ${dest.name}`);
      extBtn.target = '_blank';
      extBtn.rel = 'noopener noreferrer';
    }
  }

  // Handle selecting the same origin and destination.
  if (!isGpsOrigin && origin && origin.id === dest.id) {
    if (distEl) distEl.textContent = '0 m';
    if (timeEl) timeEl.textContent = '0 min';
    if (stepCountBadge) stepCountBadge.textContent = '1 step';

    if (stepsList) {
      stepsList.innerHTML = `
        <li class="route-step-item">
          <span class="route-step-num">1</span>
          <span>You are already at
            <strong>${escapeHtml(dest.name)}</strong>
            (${escapeHtml(dest.building || '')}).
          </span>
        </li>`;
    }
    return;
  }

  let startLat;
  let startLon;

  if (isGpsOrigin) {
    if (!navigator.geolocation) {
      showRouteError('Your browser does not support GPS.');
      return;
    }

    if (stepsList) {
      stepsList.textContent = 'Getting your current location…';
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });

      startLat = position.coords.latitude;
      startLon = position.coords.longitude;
    } catch (error) {
      showRouteError(
        error.code === 1
          ? 'Location permission was denied. Allow location access or choose a campus starting point.'
          : 'Could not get your location. Check GPS permissions and try again.'
      );
      return;
    }
  } else {
    if (!hasCoordinates(origin)) {
      showRouteError(
        'The selected starting point has no valid coordinates. Choose another starting point.'
      );
      return;
    }

    startLat = Number(origin.latitude);
    startLon = Number(origin.longitude);
  }

  if (!hasCoordinates(dest)) {
    showRouteError(
      'This destination has no valid coordinates, so a walking route cannot be calculated.'
    );
    return;
  }

  const endLat = Number(dest.latitude);
  const endLon = Number(dest.longitude);

  if (distEl) distEl.textContent = 'Calculating…';
  if (timeEl) timeEl.textContent = 'Calculating…';
  if (stepCountBadge) stepCountBadge.textContent = '…';
  if (stepsList) {
    stepsList.innerHTML = `
      <li class="route-step-item">
        <span>Finding a walking route…</span>
      </li>`;
  }

  try {
    const coordinates =
      `${startLon},${startLat};${endLon},${endLat}`;

    const url =
      'https://routing.openstreetmap.de/routed-foot/route/v1/driving/' +
      coordinates +
      '?overview=full&geometries=geojson&steps=true';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Routing service returned ${response.status}`);
    }

    const result = await response.json();

    if (
      result.code !== 'Ok' ||
      !result.routes ||
      !result.routes.length
    ) {
      throw new Error('No walking route was found.');
    }

    const route = result.routes[0];
    const distance = Number(route.distance);
    const duration = Number(route.duration);

    if (!Number.isFinite(distance) || !Number.isFinite(duration)) {
      throw new Error('The routing service returned invalid measurements.');
    }

    if (distEl) {
      distEl.textContent =
        distance < 1000
          ? `${Math.round(distance)} m`
          : `${(distance / 1000).toFixed(2)} km`;
    }

    if (timeEl) {
      const minutes = Math.max(1, Math.round(duration / 60));
      timeEl.textContent = `~${minutes} min`;
    }

    // Render actual route geometry if Leaflet and the route map exist.
    const map = leafletMap || window.routeMap || window.map;
    const L = window.L;

    if (
      map &&
      L &&
      route.geometry &&
      Array.isArray(route.geometry.coordinates)
    ) {
      if (window.currentRouteLayer && map.hasLayer(window.currentRouteLayer)) {
        map.removeLayer(window.currentRouteLayer);
        window.currentRouteLayer = null;
      }
      if (plannedRoutePolyline && map.hasLayer(plannedRoutePolyline)) {
        map.removeLayer(plannedRoutePolyline);
        plannedRoutePolyline = null;
      }

      const latLngs = route.geometry.coordinates.map(
        point => [point[1], point[0]]
      );

      window.currentRouteLayer = L.polyline(latLngs, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.92,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      map.fitBounds(window.currentRouteLayer.getBounds(), {
        padding: [35, 35],
        maxZoom: 19
      });
    }

    // Use actual route instructions supplied by the routing service.
    const instructions = [];

    for (const leg of (route.legs || [])) {
      for (const step of (leg.steps || [])) {
        const instruction = step.maneuver &&
          step.maneuver.instruction;

        if (instruction) {
          instructions.push(instruction);
        } else if (step.name) {
          instructions.push(`Continue along ${step.name}`);
        }
      }
    }

    if (!instructions.length) {
      instructions.push(
        'Follow the displayed route to your selected destination.'
      );
    }

    instructions.push(`Arrive at ${dest.name}.`);

    if (stepCountBadge) {
      stepCountBadge.textContent =
        `${instructions.length} steps`;
    }

    if (stepsList) {
      stepsList.innerHTML = instructions.map((instruction, index) => `
        <li class="route-step-item">
          <span class="route-step-num">${index + 1}</span>
          <span>${escapeHtml(instruction)}</span>
        </li>
      `).join('');
    }
  } catch (error) {
    console.error('Walking route calculation failed:', error);
    showRouteError(
      'A walking route could not be calculated. Check your internet connection and destination coordinates, or use Google Maps for directions.'
    );
  }

  function showRouteError(message) {
    if (distEl) distEl.textContent = 'Unavailable';
    if (timeEl) timeEl.textContent = 'Unavailable';
    if (stepCountBadge) stepCountBadge.textContent = '0 steps';

    if (stepsList) {
      const item = document.createElement('li');
      item.className = 'route-step-item';
      item.textContent = message;
      stepsList.replaceChildren(item);
    }
  }
}

async function drawRouteOnMap() {
  if (!leafletMap) return;

  const data = (typeof collegeData !== 'undefined' && collegeData)
    ? collegeData
    : defaultCollegeData;

  const originSelect = document.getElementById('route-origin-select');
  const destSelect = document.getElementById('route-dest-select');

  const isGpsOrigin =
    originSelect && originSelect.value === 'current-gps';

  const dest = data.locations.find(
    l => l.id === (destSelect ? destSelect.value : 'library')
  );

  if (!dest || !dest.latitude || !dest.longitude) {
    alert('Please select a destination with valid map coordinates.');
    return;
  }

  // Remove previous routes to avoid duplicate layers
  if (plannedRoutePolyline && leafletMap.hasLayer(plannedRoutePolyline)) {
    leafletMap.removeLayer(plannedRoutePolyline);
    plannedRoutePolyline = null;
  }
  if (window.currentRouteLayer && leafletMap.hasLayer(window.currentRouteLayer)) {
    leafletMap.removeLayer(window.currentRouteLayer);
    window.currentRouteLayer = null;
  }

  // Use the selected campus location, or request the user's live location.
  let startCoord;

  if (!isGpsOrigin && originSelect) {
    const origin = data.locations.find(
      l => l.id === originSelect.value
    );

    if (!origin || !origin.latitude || !origin.longitude) {
      alert('The selected starting location has no valid coordinates.');
      return;
    }

    startCoord = [Number(origin.latitude), Number(origin.longitude)];
  } else {
    if (!navigator.geolocation) {
      alert('Live location is not supported by this browser.');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 5000
          }
        );
      });

      startCoord = [
        position.coords.latitude,
        position.coords.longitude
      ];
    } catch (error) {
      alert('Unable to get your location. Allow location access or select a campus starting point.');
      return;
    }
  }

  const destCoord = [
    Number(dest.latitude),
    Number(dest.longitude)
  ];

  // OSRM-compatible walking route service uses longitude,latitude order.
  const routeUrl =
    'https://routing.openstreetmap.de/routed-foot/route/v1/driving/' +
    `${startCoord[1]},${startCoord[0]};${destCoord[1]},${destCoord[0]}` +
    '?overview=full&geometries=geojson&steps=true';

  try {
    const response = await fetch(routeUrl);

    if (!response.ok) {
      throw new Error('Routing service unavailable');
    }

    const result = await response.json();

    if (
      result.code !== 'Ok' ||
      !result.routes ||
      !result.routes.length
    ) {
      throw new Error('No walking route found');
    }

    const route = result.routes[0];

    // Draw the actual route geometry on your existing Leaflet map.
    plannedRoutePolyline = L.geoJSON(
      {
        type: 'Feature',
        properties: {},
        geometry: route.geometry
      },
      {
        style: {
          color: '#2563eb',
          weight: 7,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }
      }
    ).addTo(leafletMap);

    // Frame the route with comfortable padding.
    leafletMap.fitBounds(plannedRoutePolyline.getBounds(), {
      padding: [45, 45],
      maxZoom: 19
    });

    // Update distance and estimated walking time when these elements exist.
    const distanceElement = document.getElementById('route-distance-val');
    const timeElement = document.getElementById('route-time-val');

    const distanceMetres = route.distance;
    const walkingMinutes = Math.max(
      1,
      Math.round(route.duration / 60)
    );

    if (distanceElement) {
      distanceElement.textContent =
        distanceMetres >= 1000
          ? `${(distanceMetres / 1000).toFixed(2)} km`
          : `${Math.round(distanceMetres)} m`;
    }

    if (timeElement) {
      timeElement.textContent = `~${walkingMinutes} min`;
    }

    // Build directions from the routing service's returned steps.
    const stepsList = document.getElementById('route-steps-list');

    if (stepsList) {
      stepsList.replaceChildren();

      const legs = route.legs || [];
      const steps = legs.flatMap(leg => leg.steps || []);

      steps.forEach((step, index) => {
        const item = document.createElement('li');
        item.className = 'route-step-item';

        const instruction = [
          step.maneuver && step.maneuver.type
            ? step.maneuver.type.replace(/_/g, ' ')
            : '',
          step.maneuver && step.maneuver.modifier
            ? step.maneuver.modifier
            : '',
          step.name ? `onto ${step.name}` : ''
        ].filter(Boolean).join(' ');

        item.textContent =
          `${index + 1}. ${instruction || 'Continue along the route'}`;

        stepsList.appendChild(item);
      });
    }

    // Keep the selected destination popup visible.
    if (
      typeof mapLocationMarkers !== 'undefined' &&
      mapLocationMarkers[dest.id]
    ) {
      mapLocationMarkers[dest.id].openPopup();
    }
  } catch (error) {
    console.error('Walking route error:', error);

    alert(
      'A walking route could not be loaded. Check your internet connection or try again later.'
    );
  }
}
/* =========================================================================
   7. ADVANCED LIVE GPS NAVIGATION SYSTEM
   ========================================================================= */
let isNavigating = false;
let isNavPaused = false;
let navWatchId = null;
let navCurrentDestination = null;
let navCurrentGpsCoord = null;
let navMovementTraceCoords = [];
let navSimulatedIndex = 0;
let navPlannedPathCoordinates = [];

function initLiveNavigationController() {
  const recenterBtn = document.getElementById('nav-btn-recenter');
  const pauseResumeBtn = document.getElementById('nav-btn-pause-resume');
  const endNavBtn = document.getElementById('nav-btn-end');
  const confirmEndBtn = document.getElementById('nav-confirm-end-btn');
  const confirmCancelBtn = document.getElementById('nav-confirm-cancel-btn');
  const arrivalCloseBtn = document.getElementById('nav-arrival-close-btn');

  if (recenterBtn) {
    recenterBtn.addEventListener('click', recenterMapOnCurrentLocation);
  }

  if (pauseResumeBtn) {
    pauseResumeBtn.addEventListener('click', togglePauseNavigation);
  }

  if (endNavBtn) {
    endNavBtn.addEventListener('click', promptEndNavigation);
  }

  if (confirmEndBtn) {
    confirmEndBtn.addEventListener('click', () => {
      document.getElementById('nav-end-confirm-modal').style.display = 'none';
      stopNavigation();
    });
  }

  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
      document.getElementById('nav-end-confirm-modal').style.display = 'none';
    });
  }

  if (arrivalCloseBtn) {
    arrivalCloseBtn.addEventListener('click', () => {
      document.getElementById('nav-arrival-modal').style.display = 'none';
      stopNavigation();
    });
  }
}

async function drawRouteOnMap() {
  if (!leafletMap) return;

  const data = (typeof collegeData !== 'undefined' && collegeData)
    ? collegeData
    : defaultCollegeData;

  const originSelect = document.getElementById('route-origin-select');
  const destSelect = document.getElementById('route-dest-select');

  const isGpsOrigin =
    originSelect && originSelect.value === 'current-gps';

  const dest = data.locations.find(
    l => l.id === (destSelect ? destSelect.value : 'library')
  );

  if (!dest || !dest.latitude || !dest.longitude) {
    alert('Please select a destination with valid map coordinates.');
    return;
  }

  // Remove the previous route.
  if (plannedRoutePolyline) {
    leafletMap.removeLayer(plannedRoutePolyline);
    plannedRoutePolyline = null;
  }

  // Use the selected campus location, or request the user's live location.
  let startCoord;

  if (!isGpsOrigin && originSelect) {
    const origin = data.locations.find(
      l => l.id === originSelect.value
    );

    if (!origin || !origin.latitude || !origin.longitude) {
      alert('The selected starting location has no valid coordinates.');
      return;
    }

    startCoord = [Number(origin.latitude), Number(origin.longitude)];
  } else {
    if (!navigator.geolocation) {
      alert('Live location is not supported by this browser.');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 5000
          }
        );
      });

      startCoord = [
        position.coords.latitude,
        position.coords.longitude
      ];
    } catch (error) {
      alert('Unable to get your location. Allow location access or select a campus starting point.');
      return;
    }
  }

  const destCoord = [
    Number(dest.latitude),
    Number(dest.longitude)
  ];

  // OSRM-compatible walking route service uses longitude,latitude order.
  const routeUrl =
    'https://routing.openstreetmap.de/routed-foot/route/v1/driving/' +
    `${startCoord[1]},${startCoord[0]};${destCoord[1]},${destCoord[0]}` +
    '?overview=full&geometries=geojson&steps=true';

  try {
    const response = await fetch(routeUrl);

    if (!response.ok) {
      throw new Error('Routing service unavailable');
    }

    const result = await response.json();

    if (
      result.code !== 'Ok' ||
      !result.routes ||
      !result.routes.length
    ) {
      throw new Error('No walking route found');
    }

    const route = result.routes[0];

    // Draw the actual route geometry on your existing Leaflet map.
    plannedRoutePolyline = L.geoJSON(
      {
        type: 'Feature',
        properties: {},
        geometry: route.geometry
      },
      {
        style: {
          color: '#2563eb',
          weight: 7,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }
      }
    ).addTo(leafletMap);

    // Frame the route with comfortable padding.
    leafletMap.fitBounds(plannedRoutePolyline.getBounds(), {
      padding: [45, 45],
      maxZoom: 19
    });

    // Update distance and estimated walking time when these elements exist.
    const distanceElement = document.getElementById('route-distance-val');
    const timeElement = document.getElementById('route-time-val');

    const distanceMetres = route.distance;
    const walkingMinutes = Math.max(
      1,
      Math.round(route.duration / 60)
    );

    if (distanceElement) {
      distanceElement.textContent =
        distanceMetres >= 1000
          ? `${(distanceMetres / 1000).toFixed(2)} km`
          : `${Math.round(distanceMetres)} m`;
    }

    if (timeElement) {
      timeElement.textContent = `~${walkingMinutes} min`;
    }

    // Build directions from the routing service's returned steps.
    const stepsList = document.getElementById('route-steps-list');

    if (stepsList) {
      stepsList.replaceChildren();

      const legs = route.legs || [];
      const steps = legs.flatMap(leg => leg.steps || []);

      steps.forEach((step, index) => {
        const item = document.createElement('li');
        item.className = 'route-step-item';

        const instruction = [
          step.maneuver && step.maneuver.type
            ? step.maneuver.type.replace(/_/g, ' ')
            : '',
          step.maneuver && step.maneuver.modifier
            ? step.maneuver.modifier
            : '',
          step.name ? `onto ${step.name}` : ''
        ].filter(Boolean).join(' ');

        item.textContent =
          `${index + 1}. ${instruction || 'Continue along the route'}`;

        stepsList.appendChild(item);
      });
    }

    // Keep the selected destination popup visible.
    if (
      typeof mapLocationMarkers !== 'undefined' &&
      mapLocationMarkers[dest.id]
    ) {
      mapLocationMarkers[dest.id].openPopup();
    }
  } catch (error) {
    console.error('Walking route error:', error);

    alert(
      'A walking route could not be loaded. Check your internet connection or try again later.'
    );
  }
}

function handleGpsPositionUpdate(position) {
  if (!isNavigating || isNavPaused) return;

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  navCurrentGpsCoord = [lat, lng];

  // Update live marker on map
 updateLiveGpsMarker(lat, lng, position.coords.accuracy);

  // Append to movement trace (actual path travelled)
  navMovementTraceCoords.push([lat, lng]);
  if (movementTracePolyline) {
    movementTracePolyline.setLatLngs(navMovementTraceCoords);
  }

  // Calculate distance remaining to destination
  if (navCurrentDestination && navCurrentDestination.latitude && navCurrentDestination.longitude) {
    const destLat = navCurrentDestination.latitude;
    const destLng = navCurrentDestination.longitude;
    const distMeters = Math.round(calculateHaversineDistance(lat, lng, destLat, destLng));
    const etaMins = Math.max(1, Math.round(distMeters / 80)); // ~80m per minute walk

    // Update HUD counters
    const liveDistEl = document.getElementById('nav-live-dist');
    const liveEtaEl = document.getElementById('nav-live-eta');
    if (liveDistEl) liveDistEl.textContent = `${distMeters} m`;
    if (liveEtaEl) liveEtaEl.textContent = `~${etaMins} min`;

    // Update turn instruction banner
    updateTurnInstruction(distMeters);

    // Check Off-Route condition (> 45 meters cross-track distance)
    checkOffRouteCondition(lat, lng);

    // Check Arrival Detection (within 18 meters radius)
    if (distMeters <= 18) {
      triggerArrivalDetection();
    }
  }
}

function updateLiveGpsMarker(lat, lng, accuracy = 0) {
  if (!leafletMap) return;

  // Create the location marker once and update it afterward.
  if (!liveGpsMarker) {
    const gpsIcon = L.divIcon({
      className: 'gps-custom-icon',
      html: `
        <div class="gps-location-wrap">
          <div class="gps-location-pulse"></div>
          <div class="gps-location-dot">
            <div class="gps-location-center"></div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    liveGpsMarker = L.marker([lat, lng], {
      icon: gpsIcon,
      zIndexOffset: 1000,
      interactive: false
    }).addTo(leafletMap);
  } else {
    liveGpsMarker.setLatLng([lat, lng]);
  }

  // Display the reported GPS accuracy radius when available.
  if (Number.isFinite(accuracy) && accuracy > 0) {
    if (!window.gpsAccuracyCircle) {
      window.gpsAccuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#3b82f6',
        weight: 1,
        opacity: 0.35,
        fillColor: '#60a5fa',
        fillOpacity: 0.12,
        interactive: false
      }).addTo(leafletMap);
    } else {
      window.gpsAccuracyCircle.setLatLng([lat, lng]);
      window.gpsAccuracyCircle.setRadius(accuracy);
    }
  }
}


function updateTurnInstruction(remainingDistance) {
  const currentStepEl = document.getElementById('nav-hud-current-step');
  const nextStepEl = document.getElementById('nav-hud-next-step');
  const turnIconEl = document.getElementById('nav-hud-turn-icon');

  if (!currentStepEl || !nextStepEl || !turnIconEl || !navCurrentDestination) return;

  if (remainingDistance > 180) {
    currentStepEl.textContent = `Walk straight along the main campus boulevard (${remainingDistance} m)`;
    nextStepEl.textContent = `Next: Turn towards ${escapeHtml(navCurrentDestination.building)}`;
    turnIconEl.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
  } else if (remainingDistance > 50) {
    currentStepEl.textContent = `Turn towards ${escapeHtml(navCurrentDestination.building)} (${remainingDistance} m)`;
    nextStepEl.textContent = `Next: Arrive at ${escapeHtml(navCurrentDestination.floor)}`;
    turnIconEl.innerHTML = `<i class="fa-solid fa-arrow-turn-right"></i>`;
  } else {
    currentStepEl.textContent = `Approaching ${escapeHtml(navCurrentDestination.name)} (${remainingDistance} m)`;
    nextStepEl.textContent = `Destination is directly ahead`;
    turnIconEl.innerHTML = `<i class="fa-solid fa-flag-checkered"></i>`;
  }
}

// Off-Route Detection & Recalculation
let lastOffRouteCheck = 0;

function checkOffRouteCondition(currentLat, currentLng) {
  if (
    !navPlannedPathCoordinates ||
    navPlannedPathCoordinates.length < 2 ||
    !navCurrentDestination
  ) {
    return;
  }

  const now = Date.now();
  if (now - lastOffRouteCheck < 10000) return;

  let minDistance = Infinity;

  for (const point of navPlannedPathCoordinates) {
    const distance = calculateHaversineDistance(
      currentLat,
      currentLng,
      point[0],
      point[1]
    );

    minDistance = Math.min(minDistance, distance);
  }

  if (minDistance > 45) {
    lastOffRouteCheck = now;

    const banner = document.getElementById('nav-offroute-banner');

    if (banner) {
      banner.style.display = 'flex';
    }

    showToast(
      'You may be away from the planned route. Check the map.',
      'info'
    );
  }
}


// Arrival Detection
function triggerArrivalDetection() {
  if (!isNavigating) return;
  const modal = document.getElementById('nav-arrival-modal');
  const destNameEl = document.getElementById('nav-arrival-dest-name');
  if (destNameEl && navCurrentDestination) {
    destNameEl.textContent = navCurrentDestination.name;
  }
  if (modal) {
    modal.style.display = 'flex';
  }
  showToast(`🎉 You have arrived at ${navCurrentDestination ? navCurrentDestination.name : 'your destination'}!`, 'success');
}

// Recenter Map
function recenterMapOnCurrentLocation() {
  if (navCurrentGpsCoord && leafletMap) {
    leafletMap.panTo(navCurrentGpsCoord, { animate: true });
    showToast('Map centered on current GPS position.');
  } else {
    showToast('Waiting for current GPS location...', 'info');
  }
}

// Pause / Resume Navigation
function togglePauseNavigation() {
  isNavPaused = !isNavPaused;
  const btn = document.getElementById('nav-btn-pause-resume');
  if (btn) {
    if (isNavPaused) {
      btn.innerHTML = `<i class="fa-solid fa-play"></i> Resume`;
      showToast('Navigation paused.');
    } else {
      btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
      showToast('Navigation resumed.', 'success');
    }
  }
}

// Prompt End Navigation
function promptEndNavigation() {
  const modal = document.getElementById('nav-end-confirm-modal');
  if (modal) modal.style.display = 'flex';
}

function startNavigationToLocation(destLocId) {
    const data =
        (typeof collegeData !== "undefined" && collegeData)
            ? collegeData
            : defaultCollegeData;

    const dest = data.locations.find(
        location => String(location.id) === String(destLocId)
    );

    if (!dest) {
        showToast("Invalid destination selected.", "error");
        return;
    }

    // Stop any previous GPS tracking session.
    if (
        typeof navWatchId !== "undefined" &&
        navWatchId !== null &&
        "geolocation" in navigator
    ) {
        navigator.geolocation.clearWatch(navWatchId);
        navWatchId = null;
    }

    // Initialize navigation state.
    navCurrentDestination = dest;
    isNavigating = true;
    isNavPaused = false;
    navMovementTraceCoords = [];
    navSimulatedIndex = 0;

    const navSection = document.getElementById("navigation");
    if (navSection) {
        navSection.scrollIntoView({ behavior: "smooth" });
    }

    const mapTitle = document.getElementById("map-status-title");
    if (mapTitle) {
        mapTitle.innerHTML =
            `<span style="color: var(--color-success);">
                <i class="fa-solid fa-satellite-dish"></i> LIVE NAV:
            </span> ${escapeHtml(dest.name)}`;
    }

    const topHud = document.getElementById("nav-hud-top-bar");
    const bottomHud = document.getElementById("nav-hud-bottom-bar");

    if (topHud) topHud.style.display = "flex";
    if (bottomHud) bottomHud.style.display = "flex";

    // Campus main gate starting coordinate.
    const startCoord = [17.604200, 78.483900];

    const destLat = Number(dest.latitude);
    const destLng = Number(dest.longitude);

    const destinationCoord = [
        Number.isFinite(destLat) && destLat !== 0
            ? destLat
            : 17.604800,
        Number.isFinite(destLng) && destLng !== 0
            ? destLng
            : 78.484900
    ];

    // Create a simple preview path to the destination.
    const mid1 = [
        startCoord[0] + (destinationCoord[0] - startCoord[0]) * 0.4,
        startCoord[1] + (destinationCoord[1] - startCoord[1]) * 0.2
    ];

    const mid2 = [
        startCoord[0] + (destinationCoord[0] - startCoord[0]) * 0.7,
        startCoord[1] + (destinationCoord[1] - startCoord[1]) * 0.8
    ];

    navPlannedPathCoordinates = [
        startCoord,
        mid1,
        mid2,
        destinationCoord
    ];

    // Draw the route on the Leaflet map.
    if (typeof leafletMap !== "undefined" && leafletMap && typeof L !== "undefined") {
        if (plannedRoutePolyline) {
            leafletMap.removeLayer(plannedRoutePolyline);
        }

        plannedRoutePolyline = L.polyline(
            navPlannedPathCoordinates,
            {
                color: "#6366f1",
                weight: 6,
                opacity: 0.9,
                lineJoin: "round"
            }
        ).addTo(leafletMap);

        if (movementTracePolyline) {
            leafletMap.removeLayer(movementTracePolyline);
        }

        movementTracePolyline = L.polyline([], {
            color: "#22c55e",
            weight: 5,
            opacity: 0.95
        }).addTo(leafletMap);

        leafletMap.fitBounds(
            plannedRoutePolyline.getBounds(),
            { padding: [30, 30] }
        );
    }

    // Start live GPS tracking when available.
    if (
        "geolocation" in navigator &&
        typeof navigator.geolocation.watchPosition === "function"
    ) {
        navWatchId = navigator.geolocation.watchPosition(
            handleGpsPositionUpdate,
            function (error) {
                console.warn("GPS watchPosition error:", error);

                showToast(
                    "GPS is unavailable. Starting campus test mode.",
                    "info"
                );

                handleGpsPositionUpdate({
                    coords: {
                        latitude: startCoord[0],
                        longitude: startCoord[1],
                        accuracy: 5
                    }
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showToast(
            "Geolocation is not supported. Starting campus test mode.",
            "info"
        );

        handleGpsPositionUpdate({
            coords: {
                latitude: startCoord[0],
                longitude: startCoord[1],
                accuracy: 5
            }
        });
    }

    showToast(
        `Navigation started to ${dest.name}!`,
        "success"
    );
}


// Stop & Clear Navigation
function stopNavigation() {
  isNavigating = false;
  isNavPaused = false;

  if (navWatchId !== null && 'geolocation' in navigator) {
    navigator.geolocation.clearWatch(navWatchId);
    navWatchId = null;
  }

  // Hide HUD bars
  const topHud = document.getElementById('nav-hud-top-bar');
  const bottomHud = document.getElementById('nav-hud-bottom-bar');
  const offrouteBanner = document.getElementById('nav-offroute-banner');
  if (topHud) topHud.style.display = 'none';
  if (bottomHud) bottomHud.style.display = 'none';
  if (offrouteBanner) offrouteBanner.style.display = 'none';

  // Reset map title
  const mapTitle = document.getElementById('map-status-title');
  if (mapTitle) mapTitle.textContent = 'CMRCET Satellite Campus Map';

  // Clean layers
  if (leafletMap) {
    if (movementTracePolyline) {
      leafletMap.removeLayer(movementTracePolyline);
      movementTracePolyline = null;
    }
    if (liveGpsMarker) {
      leafletMap.removeLayer(liveGpsMarker);
      liveGpsMarker = null;
    }
  }

  showToast('Navigation ended.');
}

/* =========================================================================
   8. GPS SIMULATION CONTROLS (FOR TESTING / REVIEW ON DESKTOP)
   ========================================================================= */
function initGpsSimulator() {
  const stepBtn = document.getElementById('btn-sim-step');
  const offrouteBtn = document.getElementById('btn-sim-offroute');
  const arriveBtn = document.getElementById('btn-sim-arrive');

  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      if (!isNavigating) {
        // Start navigation to library by default if not running
        startNavigationToLocation('library');
      }
      if (navPlannedPathCoordinates.length > 0) {
        navSimulatedIndex = (navSimulatedIndex + 1) % 6;
        const start = navPlannedPathCoordinates[0];
        const end = navPlannedPathCoordinates[navPlannedPathCoordinates.length - 1];
        const fraction = (navSimulatedIndex + 1) / 6;

        const simLat = start[0] + (end[0] - start[0]) * fraction;
        const simLng = start[1] + (end[1] - start[1]) * fraction;

        handleGpsPositionUpdate({
          coords: { latitude: simLat, longitude: simLng, accuracy: 5 }
        });
        showToast(`Simulated step: ${Math.round(fraction * 100)}% along route.`);
      }
    });
  }

  if (offrouteBtn) {
    offrouteBtn.addEventListener('click', () => {
      if (!isNavigating) startNavigationToLocation('library');
      // Shift coordinate by 60 meters to trigger off-route
      if (navCurrentGpsCoord) {
        const offLat = navCurrentGpsCoord[0] + 0.0006;
        const offLng = navCurrentGpsCoord[1] + 0.0006;
        handleGpsPositionUpdate({
          coords: { latitude: offLat, longitude: offLng, accuracy: 5 }
        });
      }
    });
  }

  if (arriveBtn) {
    arriveBtn.addEventListener('click', () => {
      if (!isNavigating) startNavigationToLocation('library');
      if (navCurrentDestination && navCurrentDestination.latitude && navCurrentDestination.longitude) {
        handleGpsPositionUpdate({
          coords: {
            latitude: navCurrentDestination.latitude + 0.00002,
            longitude: navCurrentDestination.longitude + 0.00002,
            accuracy: 5
          }
        });
      }
    });
  }
}

// Distance Calculation Helper (Haversine Formula in meters)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* =========================================================================
   9. ANNOUNCEMENTS RENDERING
   ========================================================================= */
function renderAnnouncements() {
  const container = document.getElementById('announcements-container');
  if (!container) return;

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const announcements = data.announcements || [];

  if (announcements.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-card);">
        <p>No announcements available currently.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = announcements.map(ann => {
    const priorityClass = ann.priority === 'Urgent' 
      ? 'priority-urgent' 
      : (ann.priority === 'High' ? 'priority-high' : 'priority-normal');

    return `
      <div class="announcement-card">
        <div class="announcement-card-header">
          <span class="category-badge">${escapeHtml(ann.category)}</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${ann.isNew ? '<span class="badge-new"><i class="fa-solid fa-sparkles"></i> NEW</span>' : ''}
            <span class="priority-tag ${priorityClass}">${escapeHtml(ann.priority || 'Normal')}</span>
          </div>
        </div>
        <h4 class="announcement-title">${escapeHtml(ann.title)}</h4>
        <p class="announcement-desc">${escapeHtml(ann.description)}</p>
        <div class="announcement-footer">
          <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(ann.date)} (${escapeHtml(ann.time || '')})</span>
          <span><i class="fa-solid fa-shield-check"></i> ${escapeHtml(ann.author || 'CMRCET Authority')}</span>
        </div>
      </div>
    `;
  }).join('');
}

/* =========================================================================
   10. RULES & PROCEDURES RENDERING
   ========================================================================= */
function renderRulesAndProcedures() {
  const rulesContainer = document.getElementById('rules-container');
  const procContainer = document.getElementById('procedures-container');

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;

  if (rulesContainer && data.rules) {
    rulesContainer.innerHTML = data.rules.map(rule => `
      <div class="rule-card">
        <div class="rule-header">
          <div class="rule-icon-box">
            <i class="${escapeHtml(rule.icon || 'fa-solid fa-gavel')}"></i>
          </div>
          <div>
            <span class="category-badge" style="font-size: 0.7rem;">${escapeHtml(rule.category)}</span>
            <h4 class="rule-title">${escapeHtml(rule.title)}</h4>
          </div>
        </div>
        <p class="rule-summary">${escapeHtml(rule.summary)}</p>
        <ul class="rule-details-list">
          ${rule.details.map(d => `
            <li class="rule-detail-item">
              <i class="fa-solid fa-circle-check"></i>
              <span>${escapeHtml(d)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  if (procContainer && data.procedures) {
    procContainer.innerHTML = data.procedures.map(proc => `
      <div class="rule-card">
        <div class="rule-header">
          <div class="rule-icon-box">
            <i class="${escapeHtml(proc.icon || 'fa-solid fa-list-check')}"></i>
          </div>
          <div>
            <span class="category-badge" style="font-size: 0.7rem;">${escapeHtml(proc.category)}</span>
            <h4 class="rule-title">${escapeHtml(proc.title)}</h4>
          </div>
        </div>
        <p class="rule-summary">${escapeHtml(proc.summary)}</p>
        <ol style="padding-left: 18px; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5;">
          ${proc.steps.map(s => `<li style="margin-bottom: 6px;">${escapeHtml(s)}</li>`).join('')}
        </ol>
      </div>
    `).join('');
  }
}

/* =========================================================================
   11. DEPARTMENTS RENDERING
   ========================================================================= */
function renderDepartments() {
  const container = document.getElementById('departments-container');
  if (!container) return;

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const departments = data.departments || [];

  container.innerHTML = departments.map(dept => `
    <div class="location-card">
      <div class="location-card-body">
        <div class="location-badge-row">
          <span class="category-badge">${escapeHtml(dept.code)}</span>
          <span class="location-code">${escapeHtml(dept.intake)}</span>
        </div>
        <h4 class="location-title">${escapeHtml(dept.name)}</h4>
        <div class="location-meta-row">
          <span class="location-meta-item">
            <i class="fa-solid fa-user-tie"></i> HOD: ${escapeHtml(dept.hod)}
          </span>
          <span class="location-meta-item">
            <i class="fa-solid fa-map-pin"></i> ${escapeHtml(dept.location)}
          </span>
        </div>
        <p class="location-desc">${escapeHtml(dept.description)}</p>
        <div class="location-card-actions">
          <a href="mailto:${escapeHtml(dept.email)}" class="btn btn-secondary btn-sm" style="flex: 1;">
            <i class="fa-solid fa-envelope"></i> Contact Dept
          </a>
          <button class="btn btn-outline btn-sm" onclick="askChatbotQuestion('Tell me about the ${dept.code} department'); openChatbotWindow();">
            <i class="fa-solid fa-sparkles"></i> Ask AI
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateFooterInfo() {
  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const addr = document.getElementById('footer-address');
  const phone = document.getElementById('footer-phone');
  const email = document.getElementById('footer-email');

  if (addr) addr.textContent = data.college.address;
  if (phone) phone.textContent = data.college.contact;
  if (email) email.textContent = data.college.email;
}

/* =========================================================================
   12. CHATBOT UI CONTROLLER
   ========================================================================= */
function initChatbotUI() {
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const clearBtn = document.getElementById('chat-clear-btn');
  const ttsBtn = document.getElementById('chat-tts-btn');
  const ttsIcon = document.getElementById('chat-tts-icon');
  const micBtn = document.getElementById('chat-mic-btn');
  const navAskAiBtn = document.getElementById('nav-ask-ai-btn');
  const heroAskAiBtn = document.getElementById('hero-ask-ai-btn');
  const ctaAskAiBtn = document.getElementById('cta-ask-ai-btn');

  function toggleChat() {
    if (chatWindow) {
      chatWindow.classList.toggle('open');
      if (chatWindow.classList.contains('open') && chatInput) {
        chatInput.focus();
      }
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));
  if (navAskAiBtn) navAskAiBtn.addEventListener('click', () => { chatWindow.classList.add('open'); chatInput.focus(); });
  if (heroAskAiBtn) heroAskAiBtn.addEventListener('click', () => { chatWindow.classList.add('open'); chatInput.focus(); });
  if (ctaAskAiBtn) ctaAskAiBtn.addEventListener('click', () => { chatWindow.classList.add('open'); chatInput.focus(); });

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      appendChatMessage(text, 'user');
      chatInput.value = '';

      showChatTypingIndicator();
      try {
        const response = await campusChatbot.processQueryAsync(text);
        hideChatTypingIndicator();
        appendChatMessage(response.reply, 'bot');
        campusChatbot.speak(response.reply);
      } catch (err) {
        hideChatTypingIndicator();
        appendChatMessage("AI service is temporarily unavailable. Please try again.", 'bot');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const messagesContainer = document.getElementById('chat-messages');
      if (messagesContainer) {
        campusChatbot.history = [];
        campusChatbot.lastMentionedLocationId = null;
        messagesContainer.innerHTML = `
          <div class="chat-msg bot">
            <div class="msg-bubble">
              Conversation cleared! How can I assist you with <strong>CMRCET</strong> today?
            </div>
            <span class="msg-time">Just now</span>
          </div>
        `;
      }
    });
  }

  if (ttsBtn && ttsIcon) {
    ttsBtn.addEventListener('click', () => {
      campusChatbot.ttsEnabled = !campusChatbot.ttsEnabled;
      localStorage.setItem('cmrcet_tts_enabled', campusChatbot.ttsEnabled);
      if (campusChatbot.ttsEnabled) {
        ttsIcon.className = 'fa-solid fa-volume-high';
        showToast('Voice output enabled');
      } else {
        ttsIcon.className = 'fa-solid fa-volume-xmark';
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        showToast('Voice output muted');
      }
    });
  }

  if (micBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    micBtn.addEventListener('click', () => {
      try {
        recognition.start();
        micBtn.style.color = '#ef4444';
        showToast('Listening... Please speak your question');
      } catch (e) {
        recognition.stop();
        micBtn.style.color = '';
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (chatInput) {
        chatInput.value = transcript;
        chatForm.dispatchEvent(new Event('submit'));
      }
      micBtn.style.color = '';
    };

    recognition.onerror = () => { micBtn.style.color = ''; };
    recognition.onend = () => { micBtn.style.color = ''; };
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-chip')) {
      const query = e.target.getAttribute('data-query') || e.target.textContent;
      askChatbotQuestion(query);
    }
  });
}

function openChatbotWindow() {
  const chatWindow = document.getElementById('chatbot-window');
  if (chatWindow) chatWindow.classList.add('open');
}

function showChatTypingIndicator() {
  const container = document.getElementById('chat-messages');
  if (!container || document.getElementById('chat-typing-bubble')) return;

  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot';
  typingDiv.id = 'chat-typing-bubble';
  typingDiv.innerHTML = `
    <div class="msg-bubble chat-typing-indicator" title="Gemini AI thinking...">
      <div class="chat-typing-dot"></div>
      <div class="chat-typing-dot"></div>
      <div class="chat-typing-dot"></div>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

function hideChatTypingIndicator() {
  const typingBubble = document.getElementById('chat-typing-bubble');
  if (typingBubble) {
    typingBubble.remove();
  }
}

async function askChatbotQuestion(queryText) {
  openChatbotWindow();
  appendChatMessage(queryText, 'user');
  showChatTypingIndicator();
  try {
    const response = await campusChatbot.processQueryAsync(queryText);
    hideChatTypingIndicator();
    appendChatMessage(response.reply, 'bot');
    campusChatbot.speak(response.reply);
  } catch (err) {
    hideChatTypingIndicator();
    appendChatMessage("AI service is temporarily unavailable. Please try again.", 'bot');
  }
}

function appendChatMessage(htmlContent, sender = 'bot') {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.innerHTML = `
    <div class="msg-bubble">${htmlContent}</div>
    <span class="msg-time">Just now</span>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function initQuickQuestions() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.question-chip-btn');
    if (card) {
      const question = card.getAttribute('data-question') || card.querySelector('.question-chip-text').textContent;
      // If it's a location question, also trigger the search box
      if (question.toLowerCase().startsWith('where is')) {
        const searchInput = document.getElementById('campus-loc-search-input');
        if (searchInput) {
          searchInput.value = question;
          searchCampusLocation(question);
        }
      }
      askChatbotQuestion(question);
    }
  });
}

/* =========================================================================
   13. ADMIN SUITE (LIVE UPDATES, PHOTO UPLOAD/REMOVE & KNOWLEDGE BASE)
   ========================================================================= */
let isAdminLoggedIn = false;

function initAdminSuite() {
  const adminModal = document.getElementById('admin-modal-backdrop');
  const adminOpenBtn = document.getElementById('nav-admin-btn');
  const adminCloseBtn = document.getElementById('admin-modal-close');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminAuthView = document.getElementById('admin-auth-view');
  const adminDashboardView = document.getElementById('admin-dashboard-view');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  const demoFillBtn = document.getElementById('admin-demo-fill-btn');

  if (adminOpenBtn && adminModal) {
    adminOpenBtn.addEventListener('click', () => {
      adminModal.classList.add('open');
      if (isAdminLoggedIn) {
        showAdminDashboard();
      } else {
        if (adminAuthView) adminAuthView.style.display = 'block';
        if (adminDashboardView) adminDashboardView.style.display = 'none';
      }
    });
  }

  if (adminCloseBtn && adminModal) {
    adminCloseBtn.addEventListener('click', () => adminModal.classList.remove('open'));
  }

  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      const u = document.getElementById('admin-user');
      const p = document.getElementById('admin-pass');
      if (u) u.value = 'admin';
      if (p) p.value = 'cmrcet@2026';
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('admin-user').value.trim();
      const p = document.getElementById('admin-pass').value.trim();

      if ((u === 'admin' && p === 'cmrcet@2026') || (u === 'admin' && p === 'admin')) {
        isAdminLoggedIn = true;
        showToast('Admin logged in successfully', 'success');
        showAdminDashboard();
      } else {
        showToast('Invalid credentials! (Demo: admin / cmrcet@2026)', 'error');
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      isAdminLoggedIn = false;
      showToast('Admin logged out');
      if (adminAuthView) adminAuthView.style.display = 'block';
      if (adminDashboardView) adminDashboardView.style.display = 'none';
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('admin-tab-btn')) {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));

      e.target.classList.add('active');
      const targetPane = document.getElementById(e.target.getAttribute('data-tab'));
      if (targetPane) targetPane.classList.add('active');
    }
  });

  initAdminAnnouncementsHandler();
  initAdminLocationsHandler();
}

function showAdminDashboard() {
  const authView = document.getElementById('admin-auth-view');
  const dashView = document.getElementById('admin-dashboard-view');
  if (authView) authView.style.display = 'none';
  if (dashView) dashView.style.display = 'block';

  renderAdminAnnouncementsList();
  renderAdminLocationsList();
}

function initAdminAnnouncementsHandler() {
  const form = document.getElementById('admin-add-announcement-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('admin-ann-title').value.trim();
    const category = document.getElementById('admin-ann-category').value;
    const priority = document.getElementById('admin-ann-priority').value;
    const desc = document.getElementById('admin-ann-desc').value.trim();

    if (!title || !desc) return;

    const newAnn = {
      id: 'ann-' + Date.now(),
      title: title,
      category: category,
      priority: priority,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNew: true,
      description: desc,
      author: 'Admin Portal (CMRCET)'
    };

    collegeData.announcements.unshift(newAnn);
    saveCollegeData();
    renderAllSections();
    renderAdminAnnouncementsList();
    form.reset();
    showToast('New announcement published immediately!', 'success');
  });
}

function renderAdminAnnouncementsList() {
  const container = document.getElementById('admin-announcements-list');
  if (!container) return;

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const announcements = data.announcements || [];

  container.innerHTML = announcements.map(ann => `
    <div class="admin-item-row">
      <div style="flex: 1;">
        <strong style="color: var(--text-primary); font-size: 0.9rem;">${escapeHtml(ann.title)}</strong>
        <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 2px;">
          [${ann.category}] • Priority: ${ann.priority} • ${ann.date}
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteAnnouncement('${ann.id}')">
        <i class="fa-solid fa-trash-can"></i> Delete
      </button>
    </div>
  `).join('');
}

function deleteAnnouncement(annId) {
  collegeData.announcements = collegeData.announcements.filter(a => a.id !== annId);
  saveCollegeData();
  renderAllSections();
  renderAdminAnnouncementsList();
  showToast('Announcement deleted');
}

function initAdminLocationsHandler() {
  const uploadForm = document.getElementById('admin-location-photo-form');
  const locSelect = document.getElementById('admin-loc-select');
  const photoInput = document.getElementById('admin-loc-photo-file');
  const urlInput = document.getElementById('admin-loc-photo-url');

  if (locSelect) {
    const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
    locSelect.innerHTML = data.locations.map(loc => `
      <option value="${loc.id}">${escapeHtml(loc.name)}</option>
    `).join('');
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const locId = locSelect.value;
      const targetLoc = collegeData.locations.find(l => l.id === locId);
      if (!targetLoc) return;

      if (photoInput && photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        const reader = new FileReader();
        reader.onload = (re) => {
          targetLoc.image = re.target.result;
          saveCollegeData();
          renderAllSections();
          renderAdminLocationsList();
          uploadForm.reset();
          showToast(`Actual photo uploaded for ${targetLoc.name}!`, 'success');
        };
        reader.readAsDataURL(file);
      } else if (urlInput && urlInput.value.trim()) {
        targetLoc.image = urlInput.value.trim();
        saveCollegeData();
        renderAllSections();
        renderAdminLocationsList();
        uploadForm.reset();
        showToast(`Photo URL saved for ${targetLoc.name}!`, 'success');
      } else {
        showToast('Please select an image file or enter a valid URL', 'error');
      }
    });
  }
}

function renderAdminLocationsList() {
  const container = document.getElementById('admin-locations-list');
  if (!container) return;

  const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
  const locations = data.locations || [];

  container.innerHTML = locations.map(loc => {
    const hasImage = loc.image && typeof loc.image === 'string' && loc.image.trim() !== '';
    return `
      <div class="admin-item-row">
        <div class="admin-photo-preview-thumb">
          ${hasImage 
            ? `<img src="${escapeHtml(loc.image)}" alt="Photo">` 
            : `<i class="fa-solid fa-camera" style="color: var(--text-muted); font-size: 0.8rem;"></i>`}
        </div>
        <div style="flex: 1;">
          <strong style="color: var(--text-primary); font-size: 0.9rem;">${escapeHtml(loc.name)}</strong>
          <div style="font-size: 0.775rem; color: var(--text-muted);">
            Status: ${hasImage 
              ? '<span style="color: var(--color-success); font-weight: 600;">Actual Photo Uploaded</span>' 
              : '<span style="color: var(--text-muted);">Picture Coming Soon (No Photo)</span>'}
          </div>
        </div>
        <div>
          ${hasImage ? `
            <button class="btn btn-secondary btn-sm" onclick="removeLocationImage('${loc.id}')" title="Remove image & reset to Picture Coming Soon">
              <i class="fa-solid fa-image-slash"></i> Remove Photo
            </button>
          ` : `
            <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Placeholder Active</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function removeLocationImage(locId) {
  const loc = collegeData.locations.find(l => l.id === locId);
  if (loc) {
    loc.image = null;
    saveCollegeData();
    renderAllSections();
    renderAdminLocationsList();
    showToast(`Photo removed for ${loc.name}. Reverted to 'Picture Coming Soon'.`);
  }
}

function resetCollegeDataToDefault() {
  if (confirm("Reset all CMRCET data, announcements, and locations to initial state?")) {
    collegeData = JSON.parse(JSON.stringify(defaultCollegeData));
    saveCollegeData();
    renderAllSections();
    renderAdminAnnouncementsList();
    renderAdminLocationsList();
    showToast('Data reset to default CMRCET database', 'success');
  }
}

/* =========================================================================
   14. GLOBAL SEARCH MODAL
   ========================================================================= */
function initSearchModal() {
  const triggerBtn = document.getElementById('search-trigger-btn');
  const modal = document.getElementById('search-modal-backdrop');
  const closeBtn = document.getElementById('search-modal-close');
  const searchInput = document.getElementById('search-main-input');
  const resultsContainer = document.getElementById('search-results-list');

  function openSearch() {
    if (modal && searchInput) {
      modal.classList.add('open');
      searchInput.focus();
    }
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openSearch);
  if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  if (searchInput && resultsContainer) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        resultsContainer.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            Type anything to search the CMRCET database...
          </div>
        `;
        return;
      }

      const data = (typeof collegeData !== 'undefined' && collegeData) ? collegeData : defaultCollegeData;
      const matches = [];

      // Search Locations
      data.locations.forEach(loc => {
        if (loc.name.toLowerCase().includes(q) || loc.building.toLowerCase().includes(q) || loc.description.toLowerCase().includes(q)) {
          matches.push({
            type: 'Campus Location',
            title: loc.name,
            subtitle: `${loc.building}, ${loc.floor}`,
            action: () => {
              openLocationDetailsModal(loc.id);
              modal.classList.remove('open');
            }
          });
        }
      });

      // Search Rules
      data.rules.forEach(rule => {
        if (rule.title.toLowerCase().includes(q) || rule.summary.toLowerCase().includes(q)) {
          matches.push({
            type: 'College Rule',
            title: rule.title,
            subtitle: rule.summary,
            action: () => {
              const el = document.getElementById('rules');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              modal.classList.remove('open');
            }
          });
        }
      });

      // Search Procedures
      data.procedures.forEach(proc => {
        if (proc.title.toLowerCase().includes(q) || proc.summary.toLowerCase().includes(q)) {
          matches.push({
            type: 'Procedure',
            title: proc.title,
            subtitle: proc.summary,
            action: () => {
              const el = document.getElementById('procedures');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              modal.classList.remove('open');
            }
          });
        }
      });

      // Search Announcements
      data.announcements.forEach(ann => {
        if (ann.title.toLowerCase().includes(q) || ann.description.toLowerCase().includes(q)) {
          matches.push({
            type: 'Announcement',
            title: ann.title,
            subtitle: `${ann.category} — ${ann.date}`,
            action: () => {
              const el = document.getElementById('announcements');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              modal.classList.remove('open');
            }
          });
        }
      });

      if (matches.length === 0) {
        resultsContainer.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            No college information found for "${escapeHtml(q)}".
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = matches.slice(0, 8).map((m, idx) => `
        <div class="search-result-item" onclick="window.searchResultsActions[${idx}]()">
          <div>
            <span class="category-badge" style="font-size: 0.65rem; padding: 2px 6px;">${escapeHtml(m.type)}</span>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary); margin-top: 4px;">${escapeHtml(m.title)}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(m.subtitle)}</div>
          </div>
          <i class="fa-solid fa-arrow-right" style="color: var(--text-muted); font-size: 0.85rem;"></i>
        </div>
      `).join('');

      window.searchResultsActions = matches.map(m => m.action);
    });
  }
}

/* =========================================================================
   15. NAVBAR, MODALS & KEYBOARD SHORTCUTS
   ========================================================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('open');
    });
  });
}

function initModals() {
  const locModal = document.getElementById('location-modal-backdrop');
  const locClose = document.getElementById('location-modal-close');

  if (locClose && locModal) {
    locClose.addEventListener('click', () => locModal.classList.remove('open'));
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('location-modal-backdrop') || 
        e.target.classList.contains('admin-modal-backdrop') || 
        e.target.classList.contains('search-modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });
}

function closeAllModals() {
  document.querySelectorAll('.location-modal-backdrop, .admin-modal-backdrop, .search-modal-backdrop').forEach(m => m.classList.remove('open'));
}

function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchModal = document.getElementById('search-modal-backdrop');
      const searchInput = document.getElementById('search-main-input');
      if (searchModal && searchInput) {
        searchModal.classList.add('open');
        searchInput.focus();
      }
    }
    if (e.key === 'Escape') {
      closeAllModals();
      const chatWin = document.getElementById('chatbot-window');
      if (chatWin) chatWin.classList.remove('open');
      const arrivalModal = document.getElementById('nav-arrival-modal');
      if (arrivalModal) arrivalModal.style.display = 'none';
      const confirmModal = document.getElementById('nav-end-confirm-modal');
      if (confirmModal) confirmModal.style.display = 'none';
    }
  });
}

/* =========================================================================
   16. TOAST NOTIFICATIONS & UTILS
   ========================================================================= */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  toast.innerHTML = `
    <i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info'}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}
