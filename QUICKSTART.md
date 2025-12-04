# 🚀 Quick Start Guide - Population Density Map

## Prerequisites
- Node.js (v14+) - [Download](https://nodejs.org/)
- MongoDB (local or Atlas cloud) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- Git
- Visual Studio Code (recommended)

## 📋 Installation Steps

### 1. Clone & Setup
```bash
cd c:\VSCode\population-density-app
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your database URL:
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/population_density
PORT=5000
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Seed Sample Data (Optional)
```bash
# Make sure MongoDB is running, then:
cd server
npm run seed
cd ..
```

### 5. Start the Application

**Terminal 1 - Frontend (Vite Dev Server)**
```bash
npm run dev
# Opens on http://localhost:5173
```

**Terminal 2 - Backend (Express Server)**
```bash
npm run server
# Runs on http://localhost:5000
```

### 6. Open in Browser
Navigate to `http://localhost:5173`

## 🗺️ Features to Try

1. **Explore the Map**: Hover over countries to see details
2. **Select a Country**: Click any country to see it in the sidebar
3. **Change Metrics**: Use the dropdown to switch between:
   - Population Density
   - Life Expectancy
   - Total Population
   - Land Area
4. **Zoom Controls**: Use +/- buttons or scroll wheel
5. **View Rankings**: Check top 10 countries in the sidebar

## 📊 Sample Data Included

The seed file includes data for 15 major countries:
- United States, China, India, Brazil, Russia
- Japan, Germany, UK, France, Australia
- Canada, Mexico, South Africa, Egypt, Nigeria

## 🔧 Troubleshooting

### "Cannot GET /api/countries"
- Ensure backend is running on port 5000
- Check that MongoDB connection is successful
- Look for error messages in backend terminal

### MongoDB Connection Failed
```bash
# Windows: Start MongoDB
mongod

# Or use MongoDB Atlas (cloud):
# Update MONGODB_URI in .env with your connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/population_density
```

### Port Already in Use
- Frontend: Change in `vite.config.js` (port 5173)
- Backend: Change in `.env` (PORT 5000)

### Module Not Found Error
```bash
# Reinstall dependencies
npm install
cd server && npm install && cd ..
```

## 📁 Project Structure
```
population-density-app/
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── utils/            # Utilities (colors, geo data)
│   └── App.jsx          # Main app
├── server/               # Express backend
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Sample data
│   └── package.json     # Backend dependencies
├── package.json         # Frontend dependencies
└── README_FULL.md      # Full documentation
```

## 💻 Development Tips

- **Hot Reload**: Frontend automatically reloads on save
- **Backend Monitoring**: Use `npm run server` for auto-restart on changes
- **MongoDB Compass**: Visualize your database with [MongoDB Compass](https://www.mongodb.com/products/compass)
- **DevTools**: Use browser DevTools (F12) to inspect map and check console

## 🌐 Deployment

### Deploy to Vercel (Frontend)
```bash
npm run build
# Connect GitHub repo to Vercel
```

### Deploy to Heroku (Backend)
```bash
# Add Procfile to server/
# Push to Heroku with MongoDB connection string
```

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Check backend terminal for errors
3. Verify MongoDB is running
4. Ensure ports 5173 and 5000 are available
5. Review README_FULL.md for detailed documentation

---

**Happy mapping! 🌍✨**
