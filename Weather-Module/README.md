# Agro-Weather API

This API service is been developed as a part of Project "GreenTip". This service provide the application with various data which helps in prompt refinement and alert monitering.

## Features

- **Weather Data:** The API provide near real time weather data of the location.
- **Soil Data:** The API provide near real time soil data of the location.
- **Regressional Predictions:** The data collect is further used to make predictions of the data that required for analysis but are not available.

## Technologies Used

- **Backend:**
  - FastAPI (Modern, fast web framework for building APIs with Python)
  - NextJs (Modern, fast framework for building web applications with React)
- **Deployment:**
  - Hugging Face Spaces (Python Backend)
  - Vercel (JS Interface)

## File Tree

```
Weather-Module/
├─ Auth/
│  ├─ createToken.js
│  └─ validateToken.js
├─ Model/
│  ├─ app.py
│  ├─ Crop_recommendationV2.csv
│  ├─ model.ipynb
│  └─ requirements.txt
├─ src/app/
│  ├─ api/
|  │  ├─ alerts/
|  │  │  └─ route.js
|  │  ├─ getAuthToken/
|  │  │  └─ route.js
|  │  ├─ getData/
|  │  │  └─ route.js
│  │  └─ getInfo/
│  │     └─ route.js
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.js
│  └─ page.js
├─ utils/
│  ├─ helpers/
|  │  ├─ co2.js
|  │  ├─ openMeteo.js
|  │  ├─ openWeather.js
|  │  ├─ soilGridProperties.js
|  │  ├─ soilMoisture.js
|  │  ├─ soilType.js
|  │  ├─ sunExp.js
│  │  └─ urbanApprox.js
│  ├─ alerts.js
│  ├─ models.js
│  ├─ soil.js
│  └─ weather.js
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
└─ README.md
```

## Models

- A regression models are used in making predictions on the imfomations not available

- The dataset used is the Smart Farming Dataset 2024 [https://www.kaggle.com/datasets/datasetengineer/smart-farming-data-2024-sf24]

- Litreature Reference [https://www.agriculturejournal.org/volume11number3/crop-selection-and-yield-prediction-using-machine-learning-approach/]

## API Endpoints

### `/getInfo` (GET)

- **Description:** Get Operational information about the API.
- **Response:** A welcome message.

### `/getAuthToken` (POST)

- **Description:** Provide Authorization Token.
- **Request:**
  - `payload`:
  ```json
  {
      "id": "unique-identification-number" (curently assigned to each team member)
  }
  ```
- **Response:** A JSON object with token:
  ```json
  {
      "Token": <Authorization-token>,
      "Active": <Current status of the token>
  }
  ```

### `/alerts` (POST)

- **Description:** Provide alerts of districts.
- **Request:**
  - `payload`:
  ```json
  {
    "dist": "District Name, State Name"
  }
  ```
- **Response:** A JSON object with token:

  ```json
  {
      "Place": "District Name, State Name",
      "alerts": [
          {
            "headline":"",
            "severity":"",
            "urgency":"",
            "areas":"",
            "category":"",
            "certainty":"",
            "event":"",
            "note":"",
            "effective":"",
            "expires":"",
            "desc":"",
            "instruction":"",
          },{
              ...
          }
      ]
  }
  ```

### `/getData` (POST)

- **Description:** Provide Authorization Token.
- **Request:**
  - `payload`:
  ```json
  {
        "lat" : latitide,
        "lon" : longitude,
        "date" : "DD/MM/YYYY",
        "growth_stage" : "growth stage represented by number",
        "water_source_type" : "water source type represented by number",
        "uid" : "unique id of the field"
  }
  ```
- **Response:** A JSON object with token:
  ```json
  {
    "soil": {
        "N": "nitrogen-content",
        "P": "Phosphorous-content",
        "K": "Potassium-content",
        "ph": "PH of soil",
        "soil_moisture": "Soil moisture",
        "soil_type": "Type of soil",
        "organic_matter": "Content of organic matter",
        "growth_stage": "growth stage represented by number",
        "water_source_type": "water source type represented by number",
        "crop_suggestion": "Crop suggestion from regression models"
    },
    "weather": {
        "carbonDioxideConcentration": "CO2 concentartion in the area",
        "descriptionOfSky": "Description of the weather",
        "temperature": "Aggregate Temperature of the area",
        "humidity": "Aggregate Humidity of the area",
        "sunlightExposure": "Estimated aggregated sunlight received by the area of the month",
        "rainfall": "Estimated aggregated rainfall of the month",
        "windSpeed_10m_above_grd_level": "Wind speed 10 m above ground",
        "max_precipitation_probability": "list of max precipitation probability of coming 15 days",
        "urbanApprox": "Approximated distance from nearest urban Area"
    }
  }
  ```

## Deployment

### NextJS

- The JS backend that act as an interface is deployed at Vercel

### FastAPI

- The Python backend that act to run the regressional models is deployed at Hugging Face Spaces

## Looking Ahead

- This module is aim to further evolve to give precise real time data by intregration IoT modules

## License

MIT
