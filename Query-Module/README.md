# FarmAI - Smart Farming Assistant

## Overview

This is a Next.js-powered web application designed to assist farmers with AI-powered insights, analysis, and recommendations. Built with modern technologies and integrated with Google's Gemini API, this application provides personalized farming assistance based on location-specific weather, soil conditions, and image analysis.

## Features

### User Authentication & Farm Management
- Secure user accounts with Firebase authentication
- Add and manage multiple farm locations with precise geolocation
- Personalized dashboard showing farm-specific metrics and alerts

### AI-Powered Crop Analysis
- **Crop Health Analysis**: Upload images to generate detailed health reports
- **Crop Recommendations**: Get personalized suggestions for planting, maintaining, and harvesting crops
- **Visual Query System**: Ask questions about crops with accompanying images

### Data Integration
- **Weather Module**: Real-time and forecasted weather data for farm locations
- **Soil Analysis**: Soil composition and quality metrics based on location
- **Smart Alerts**: Automated notifications for weather events, crop conditions, and optimal farming activities

### Custom Modules
- **Image Handler**: Advanced image processing for enhanced analysis
- **Weather-Soil Module**: Location-based environmental data collection
- **Alert System**: Customizable notification system for timely updates

## Tech Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **shadcn/ui**: High-quality UI components built with Radix UI and Tailwind CSS
- **Redux Toolkit**: Data fetching and state management
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Next.js API Routes**: For backend operations
- **Firebase Admin SDK**: Authentication, database, and storage management
- **Google Gemini API**: Advanced AI for image analysis and natural language processing
- **Weather & Soil API Integration**: External data sources for environmental information

### Infrastructure
- **Vercel**: Deployment and hosting
- **Firebase**: Authentication, Firestore database, and storage

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Firebase account
- Google Cloud Platform account with Gemini API access

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd farmai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
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

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Firebase Setup
1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication, Firestore Database, and Storage
3. Generate a new private key for the Firebase Admin SDK
4. Add the configuration details to your environment variables

### Gemini API Setup
1. Create a project in Google Cloud Platform
2. Enable Gemini API for your project
3. Generate an API key and add it to your environment variables

## Deployment

### Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository
2. Import the project to Vercel
3. Add the environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI capabilities
- Firebase for backend services
- shadcn/ui for beautiful UI components
- Weather and soil data providers