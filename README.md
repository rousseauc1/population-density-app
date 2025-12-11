# Population Density Map - Interactive World Visualization

A modern React web application that visualizes global population density data on an interactive world map with heat colors. Connect to MongoDB to manage and display country statistics with an intuitive, visually appealing interface.

## 🌍 Features

- **Interactive World Map**: Pan, zoom, and explore the world map with smooth animations
- **Heat Color Visualization**: Dynamic color scaling based on selected metrics
- **Multiple Metrics**: Toggle between population density, life expectancy, total population, and land area
- **Country Details**: Click on countries to view detailed statistics
- **Top Rankings**: Real-time top 10 country rankings based on selected metric
- **Responsive Design**: Beautiful dark-themed UI with Tailwind CSS
- **Dark Mode**: Eye-friendly dark theme optimized for data visualization
- **MongoDB Integration**: Backend API for managing country data

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Leaflet** - Map library
- **React-Leaflet** - React wrapper for Leaflet
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd population-density-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your MongoDB URI
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/population_density
PORT=5000
```

4. **Start MongoDB** (if running locally)
```bash
# On Windows with MongoDB installed
mongod
```

5. **Install backend dependencies**
```bash
# If backend has separate package.json
cd server && npm install && cd ..
```

6. **Run the application**

**Development mode** (both frontend and backend):
```bash
# Terminal 1 - Start Vite dev server (Frontend on port 5173)
npm run dev

# Terminal 2 - Start Express server (Backend on port 5000)
npm run server
```

**Build for production**:
```bash
npm run build
npm run preview
```

## 📊 Data Collections & Schema

All data lives in MongoDB and is keyed by ISO country codes (`cca3`).

### Countries (`country_stats_2025`)
Core population + geography data.
```javascript
{
  country: String,  // "India"
  cca2: String,     // "IN"
  cca3: String,     // "IND" (primary key)
  pop2025: Number,
  pop2050: Number,
  area: Number,      // total area
  landAreaKm: Number, // land area in km²
  density: Number,   // people per km²
  growthRate: Number, // decimal (e.g., 0.0089)
  worldPercentage: Number, // share of world population
  rank: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Economic Indicators (`economic_indicators`)
Economic & development metrics (most recent year per country is used in analytics).
```javascript
{
  countryCode: String, // cca3
  year: Number,
  gdpPerCapita: Number,
  gdpTotal: Number,
  urbanizationRate: Number,
  lifeExpectancy: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Regions (`regions`)
Grouping of countries for aggregates.
```javascript
{
  name: String,              // e.g., "Asia"
  type: String,              // "continent" | "subregion" | "economic_zone"
  countries: [String],       // array of cca3 codes
  totalPopulation2025: Number,
  totalPopulation2050: Number,
  averageDensity: Number,
  averageGrowthRate: Number,
  totalArea: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 API Endpoints

### Countries
- `GET /api/countries` — all countries
- `GET /api/countries/:cca3` — one country by ISO3
- `POST /api/countries` — create (use schema above)
- `PUT /api/countries/:cca3` — update
- `DELETE /api/countries/:cca3` — delete
- `GET /api/countries/stats/summary` — aggregate snapshot

### Analytics (aggregation pipelines)
- `GET /api/analytics/high-growth-with-economics`
- `GET /api/analytics/regional-analysis`
- `GET /api/analytics/overcrowding-analysis`
- `GET /api/analytics/projection-by-development`
- `GET /api/analytics/economic-population-correlation`
- `GET /api/analytics/regional-comparison`

## 🎨 Color Scale Guide

The heat map uses a dynamic color scale:
- **Blue** (#001f3f) - Low values
- **Green** (#00d084) - Medium-low values
- **Yellow** (#ffdc00) - Medium-high values
- **Red** (#e74c3c) - High values

Colors are normalized based on the min/max values of the selected metric across all countries.

## 🗺️ Map Controls

- **+/- Buttons**: Zoom in and out
- **⟲ Button**: Reset to world view
- **Mouse Wheel**: Zoom with scroll
- **Click & Drag**: Pan around the map
- **Hover**: Preview country information
- **Click Country**: Select and view details in sidebar

## 📱 UI Components

### MapComponent
- Interactive Leaflet map with GeoJSON features
- Dynamic styling based on selected metric
- Popup information on click
- Custom zoom controls

### Sidebar
- Selected country details
- Top 10 rankings list
- Real-time statistics
- Responsive layout

### Controls
- Metric selection dropdown
- Visual feedback for current metric
- Help text and instructions

## 🔄 Data Flow

1. Backend exposes country + analytics endpoints (see above)
2. Frontend fetches countries and renders heat-map markers by selected metric
3. Sidebar/top lists update on selection; analytics panel calls aggregation endpoints

## 📥 Data Management

- Import/refresh countries: use your data import (CSV or manual); ensure `cca3` codes align with map markers.
- Add a missing country quickly: `POST /api/countries` with the country schema.
- Economic data: import via `server/scripts/importCSV.js` (configure paths/mappings).
- Update region aggregates: `npm run update-region-stats` (from `server/`).
- Verify collections: `node server/scripts/verifyData.js`.

## 🐛 Troubleshooting

- Missing map points: ensure the country exists in `country_stats_2025` and has a centroid in `MapComponent.jsx` (centroid map). The basemap tile layer supplies boundaries; markers come from countries data.
- Region stats zeroed: run `npm run update-region-stats` (from `server/`).
- Mongo connection issues: confirm `MONGODB_URI` in `.env` and that MongoDB is running.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify database credentials

### Port Conflicts
- Frontend: Runs on port 5173 (configurable in vite.config.js)
- Backend: Runs on port 5000 (configurable in .env)

### CORS Issues
- Ensure CORS is enabled in server/index.js
- Verify proxy configuration in vite.config.js

### Map Not Loading
- Check browser console for errors
- Verify Leaflet CSS is imported
- Ensure GeoJSON data is properly formatted

## 📚 Resources

- [React Documentation](https://react.dev)
- [Leaflet Documentation](https://leafletjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Happy mapping! 🌍✨**
