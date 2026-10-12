# Campus Connect — CMRCET College Information & Advanced Campus Navigation

A centralized, responsive college information platform and intelligent AI chatbot with **Advanced Campus Navigation** built for **CMR College of Engineering & Technology (CMRCET)** (UGC Autonomous, NAAC A+ Grade, Kandlakoya, Hyderabad).

---

## 🚀 What's New: Advanced Campus Location Search & Live GPS Navigation

The system now includes an end-to-end campus location search and live GPS walking navigation system:

```
SEARCH LOCATION
      ↓
LOCATION SEARCH RESULT CARD (Name, Photo / Picture Coming Soon, Floor, Distance, ETA)
      ↓
[ VIEW ROUTE ]
      ↓
[ START NAVIGATION ]
      ↓
LIVE GPS TRACKING & BEACON
      ↓
LIVE MOVEMENT TRACE (traversed breadcrumb path)
      ↓
TURN-BY-TURN INSTRUCTIONS & DYNAMIC HUD
      ↓
OFF-ROUTE DETECTION (>45m) & AUTOMATIC RECALCULATION
      ↓
ARRIVAL DETECTION (≤18m radius) & CELEBRATION MODAL
      ↓
[ END NAVIGATION ]
```

---

## 🌟 Core Features

### 1. Campus Location Search
- Instant natural language location queries (e.g. `"CMRCET canteen"`, `"canteen"`, `"Where is the library?"`, `"administrative block"`, `"examination cell"`, `"parking area"`).
- Displays a dedicated **Location Search Result Card** with:
  - Location Name
  - Location Image (Real photo or strict `"Picture Coming Soon"` placeholder)
  - 📍 CMRCET Campus, Building & Floor
  - 🚶 Distance & ⏱ Estimated Walking Time
  - Verified Description
  - `[ VIEW ROUTE ]`, `[ START NAVIGATION ]`, and `[ OPEN IN GOOGLE MAPS ]` buttons.
- For unrecorded locations (e.g. `"Where is XYZ Building?"`), responds strictly:
  > *"Sorry, this location is not available in the Campus Connect information."*

### 2. Live GPS Navigation & Map HUD
- **Real GPS Tracking**: Uses `navigator.geolocation.watchPosition` with high accuracy mode.
- **Movement Trace**: Real-time breadcrumb polyline (Emerald Green) visually distinguished from the planned route (Indigo Glowing).
- **HUD Turn Banner & Metrics**: Dynamic turn instructions, remaining distance, and ETA updating continuously as the student walks.
- **Off-Route Detection**: Detects when the student wanders >45 meters off route, displays *"You are off route. Recalculating..."*, and dynamically re-routes to the destination.
- **Arrival Detection**: Triggers celebratory arrival modal (*"🎉 You have arrived!"*) when within 18 meters of destination.
- **Navigation Controls**:
  - `[ RECENTER ]`: Centers map smoothly on user's current GPS position.
  - `[ PAUSE / RESUME ]`: Temporarily suspends GPS position/trace processing while keeping route and state intact.
  - `[ END NAVIGATION ]`: Prompts confirmation modal before safely stopping GPS tracking and restoring normal map mode.
- **GPS Simulation / Tester Toolbar**: Allows developers/testers on desktop to test step-forward movement, off-route recalculation, and arrival detection with 1-click controls!

### 3. Strict Image Handling
- **No Stock/Internet Images**: Every location defaults strictly to `image: null`.
- **Reusable `LocationImage` Component**:
  - Displays real uploaded photo if available.
  - Otherwise displays the dark-themed placeholder:
    ```
    ┌─────────────────────────────────┐
    │               📷                │
    │       Picture Coming Soon       │
    │  CMRCET location photo will     │
    │  be added here.                 │
    └─────────────────────────────────┘
    ```
- **Admin Photo Upload / Remove**: Upload genuine photo files (DataURL) or photo URLs, or remove photos back to placeholder.

### 4. Campus Connect AI Chatbot
- Grounded strictly in the CMRCET knowledge base.
- Returns actionable location buttons directly inside chat messages (`[ View Details ]`, `[ View Route ]`, `[ Start Navigation ]`).
- Anti-hallucination guardrail for unknown questions: *"Sorry, this information is not available in Campus Connect."*

### 5. Administration Portal
- **Login**: Username `admin` | Password `cmrcet@2026` (includes 1-click demo fill button).
- Manage Announcements, Campus Location Photos, Rules, and Procedures in real-time with `localStorage` persistence.

---

## 🛠 File Changes Summary

1. [`index.html`](file:///c:/Users/SURYA%20TEJA/OneDrive/Desktop/New%20folder123/index.html):
   - Added dedicated Campus Location Search form and dynamic result card container.
   - Added Live Navigation Top Instruction HUD and Bottom Control HUD over Leaflet map.
   - Added Off-Route Warning alert banner.
   - Added Arrival Celebration Modal and End Navigation Confirmation Modal.
   - Added GPS Simulation testing toolbar.
   - Updated Quick Questions with location queries.

2. [`style.css`](file:///c:/Users/SURYA%20TEJA/OneDrive/Desktop/New%20folder123/style.css):
   - Added styles for Location Search form and Location Search Result Card.
   - Added HUD overlays, turn icons, metric counters, pulse radar beacon, and simulator toolbar.

3. [`college-data.js`](file:///c:/Users/SURYA%20TEJA/OneDrive/Desktop/New%20folder123/college-data.js):
   - Added verified parking plaza location with coordinates.
   - Ensured all locations have `image: null` defaults and authentic coordinates.

4. [`chatbot.js`](file:///c:/Users/SURYA%20TEJA/OneDrive/Desktop/New%20folder123/chatbot.js):
   - Integrated actionable buttons (`[ View Details ]`, `[ View Route ]`, `[ Start Navigation ]`) inside chat responses.
   - Added unknown location query guardrail: *"Sorry, this location is not available in the Campus Connect information."*

5. [`script.js`](file:///c:/Users/SURYA%20TEJA/OneDrive/Desktop/New%20folder123/script.js):
   - Added `searchCampusLocation()` for natural language query matching.
   - Added `startNavigationToLocation()`, `handleGpsPositionUpdate()`, `checkOffRouteCondition()`, `triggerArrivalDetection()`.
   - Added live movement tracing, recentering, pause/resume, confirmation prompts, and testing simulator.

---

## 🧪 How to Test

1. **Search Location**:
   - In the Campus Navigation section, type `"canteen"` or `"Where is the library?"` $\rightarrow$ Search Result Card appears with photo/placeholder, details, and actions.
2. **View Route**:
   - Click `[ VIEW ROUTE ]` $\rightarrow$ Map draws the planned route line and updates turn-by-turn directions.
3. **Start Live Navigation**:
   - Click `[ START NAVIGATION ]` $\rightarrow$ Live HUD activates, GPS tracking starts, and live beacon pulses on map.
4. **Desktop Testing via Simulation Controls**:
   - Click `[ Step Forward ]` to simulate walking along route.
   - Click `[ Test Off-Route ]` to test off-route warning and automatic route recalculation.
   - Click `[ Test Arrival ]` to test arrival detection modal (*"🎉 You have arrived!"*).
5. **Recenter, Pause, Resume & End**:
   - Click `[ Recenter ]` to focus map on GPS marker.
   - Click `[ Pause ]` and `[ Resume ]` to test state freezing.
   - Click `[ End ]` $\rightarrow$ Confirmation dialog appears. Confirming safely resets map mode.
6. **Chatbot Navigation**:
   - Open chatbot and ask *"Where is the examination cell?"* $\rightarrow$ Answer includes `[ View Details ]`, `[ View Route ]`, and `[ Start Navigation ]` buttons.
