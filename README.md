# GreenTip: AI-Powered Smart Farming Assistant 🌱

GreenTip is a comprehensive farming assistant platform that leverages artificial intelligence to provide personalized insights, analysis, and recommendations to farmers. By combining real-time environmental data with advanced image analysis and predictive algorithms, GreenTip helps farmers make informed decisions to optimize crop yield and health.

<img src = "./logo.png" height = 138 width = 246/>

## System Overview

GreenTip consists of four integrated modules that work together to deliver a complete farming assistance solution:

1. **Plant Disease & Pest Detection** - AI-powered image analysis to identify plant health issues
2. **Agro-Weather API** - Environmental data collection and analysis system
3. **Weather Alert Engine** - Automated notification system for critical weather events
4. **Smart Farming Assistant** - Main web application integrating all systems with user management

### Architecture Diagram

```
┌───────────────────────┐      ┌──────────────────────┐
│                       │      │                      │
│  Plant Disease &      │◄────►│  Smart Farming       │
│  Pest Detection       │      │  Assistant           │
│                       │      │  (Frontend)          │
└───────────────────────┘      └──────────┬───────────┘
                                          │
                                          │
                         ┌────────────────┼────────────────┐
                         │                │                │
                         ▼                ▼                ▼
            ┌────────────────────┐ ┌─────────────────┐ ┌───────────────┐
            │                    │ │                 │ │               │
            │  Agro-Weather API  │ │ Weather Alert   │ │  Firebase     │
            │                    │◄►│ Engine         │◄►│  Services     │
            │                    │ │                 │ │               │
            └────────────────────┘ └─────────────────┘ └───────────────┘
```

## Key Features

### 🌿 Plant Health Monitoring
- Upload plant images for instant disease and pest detection
- AI-powered analysis with detailed issue identification
- Visual indicators with bounding boxes highlighting affected areas
- Treatment recommendations and preventive measures

### 🌦️ Environmental Intelligence
- Real-time and forecasted weather data for farm locations
- Soil composition and quality metrics
- Advanced regression models to predict optimal growing conditions
- CO2 concentration, sunlight exposure, and urban proximity data

### ⚠️ Smart Alert System
- Automated weather alerts and notifications
- District-specific alert grouping
- User preference-based notification system
- Multi-device delivery through Firebase Cloud Messaging

### 👨‍🌾 Farm Management
- User authentication and secure account management
- Multiple farm location management with geolocation
- Personalized dashboards with farm-specific metrics
- Crop recommendation based on soil and weather conditions

## Technologies Used

### Frontend
- **Next.js** - React framework for server-rendered applications
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Redux Toolkit** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **Next.js API Routes** - JavaScript backend services
- **Firebase Admin SDK** - Authentication, database, and storage
- **Google Gemini API** - Advanced AI for image analysis

### Data & AI
- **Google Gemini 2.0** - Vision model for plant analysis
- **Regression Models** - For environmental predictions
- **OpenCV** - Computer vision for image processing
- **Weather & Soil APIs** - External data sources

### Deployment
- **Vercel** - Frontend and JS backend hosting
- **Render** - Python backend hosting
- **Hugging Face Spaces** - Model deployment
- **Firebase** - Authentication, database, storage, and messaging

## Module Details

### 1. Plant Disease & Pest Detection

This module utilizes Google's Gemini AI to analyze plant images and detect diseases and pests:

- **Image Upload:** Users can upload images directly from their devices
- **AI Analysis:** Leverages Google's Gemini 2.0 model
- **Issue Detection:** Identifies diseases and pests with confidence levels
- **Visual Feedback:** Displays bounding boxes around affected areas
- **Treatment Recommendations:** Provides actionable advice for plant care

### 2. Agro-Weather API

This service provides critical environmental data that helps in prompt refinement and alert monitoring:

- **Weather Data:** Near real-time weather information for specific locations
- **Soil Data:** Comprehensive soil metrics including N, P, K, pH, and moisture levels
- **Regression Predictions:** AI models to predict missing environmental factors
- **Crop Suggestions:** Intelligent recommendations based on environmental conditions

### 3. Weather Alert Engine

This backend module ensures farmers receive timely notifications about critical weather events:

- **Alert Aggregation:** Fetches and processes weather alerts from multiple sources
- **District Grouping:** Organizes alerts by district for targeted delivery
- **User Preferences:** Respects notification settings to prevent alert fatigue
- **Multi-device Delivery:** Uses Firebase Cloud Messaging for reliable notification delivery
- **Automated Scheduling:** Runs three times daily to ensure timely updates

### 4. Smart Farming Assistant

The main web application that integrates all modules and provides the user interface:

- **User Authentication:** Secure account management with Firebase
- **Farm Management:** Add and track multiple farm locations
- **Dashboard:** Personalized view with farm-specific metrics and alerts
- **Visual Query System:** Ask questions about crops with accompanying images
- **Data Integration:** Unified interface for all environmental and plant health data

## Firebase Database Structure

This project uses Firebase Firestore as its database. Below is the structure of our collections and their fields.

### Collections Overview

The database consists of 4 main collections:
- Users
- Farms
- Districts
- Notifications

### Users Collection

| Field | Type | Description |
|-------|------|-------------|
| createdAt | Timestamp | When the user account was created |
| email | String | User's email address |
| name | String | User's name |
| fcmTokens | Array | List of Firebase Cloud Messaging tokens for notifications |
| farms | Array | References to farms owned by this user |

### Farms Collection

| Field | Type | Description |
|-------|------|-------------|
| createdAt | Timestamp | When the farm was created |
| name | String | Name of the farm |
| notification | Boolean | Whether notifications are enabled for this farm |
| waterSource | Number | Identifier for the water source type |
| userId | String | Document ID of the farm owner in the users collection |
| userRef | Reference | Reference to the farm owner in the users collection |
| location | GeoPoint | Geographic coordinates of the farm |
| districtRef | Reference | Reference to the district in the districts collection |
| interactions | Array | List of objects containing interaction data. Each object has `date` and `type` fields |

### Districts Collection

| Field | Type | Description |
|-------|------|-------------|
| code | String | District code identifier |
| name | String | District name |
| state | String | State the district belongs to |
| alerts | Subdocument | Contains alert information for the district |

### Notifications Collection

| Field | Type | Description |
|-------|------|-------------|
| lastUpdated | Timestamp | When notifications were last updated |
| payload | Object | Object containing alerts for different districts |


## Getting Started

### Prerequisites
- Node.js 18.x or later
- Python 3.8+
- Firebase account
- Google Cloud Platform account with Gemini API access
- Weather API key

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd greentip
```

2. Set up environment variables:
```
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_admin_private_key
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_weather_api_key
```

3. Install dependencies and start the development servers:

#### Frontend and JS Backends
```bash
cd frontend
npm install
npm run dev
```

#### Plant Disease Detection Backend
```bash
cd plant-disease-backend
python -m venv venv
source venv/bin/activate  # On Linux/macOS
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Agro-Weather API Backend
```bash
cd weather-module
python -m venv venv
source venv/bin/activate  # On Linux/macOS
pip install -r requirements.txt
uvicorn app:app --reload
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## API Endpoints

### Plant Disease Detection
- `POST /detect` - Upload and analyze plant images
- `GET /health` - Health check endpoint

### Agro-Weather API
- `POST /getAuthToken` - Get authentication token
- `POST /alerts` - Get district-specific weather alerts
- `POST /getData` - Get comprehensive weather and soil data
- `GET /getInfo` - Get API information

### Weather Alert Engine
- Automated background process, no direct API endpoints

## Deployment

### Frontend & JS Backend
Deploy to Vercel:
```bash
vercel --prod
```

### Python Backends
Deploy to Render or Hugging Face Spaces according to their respective documentation.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to improve GreenTip.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Google Gemini API for AI capabilities
- Firebase for backend services
- shadcn/ui for UI components
- Weather and soil data providers
- Kaggle for Smart Farming Dataset 2024
