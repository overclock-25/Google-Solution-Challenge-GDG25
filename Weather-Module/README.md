# Agro-Weather API
This API service is been developed as a part of Project "GreenTip". This service provide the application with various data which helps in prompt refinement and alert monitering.


## Features

-   **Weather Data:** The API provide near real time weather data of the location.
-   **Soil Data:** The API provide near real time soil data of the location.
-   **Regressional Predictions:** The data collect is further used to make predictions of the data that required for analysis but are not available.

## Technologies Used

-   **Backend:**
    -   FastAPI (Modern, fast web framework for building APIs with Python)
    -   NextJs (Modern, fast framework for building web applications with React)
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
├─ app/
│  ├─ api/
│  │  └─ ready/
│  │     └─ route.js
│  ├─ health/
│  │  └─ page.jsx
│  ├─ ready/
│  │  └─ page.jsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.js
│  └─ page.js
├─ utils/
│  ├─ helpers/
│  │  └─ ready
│  ├─ alerts.js
│  ├─ models.ja
│  ├─ reveseGeo.js
│  ├─ soil.js
│  └─ weaher.js
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
└─ README.md
```

## Models

-   A regression models are used in making predictions on the imfomations not available

-   The dataset used is the Smart Farming Dataset 2024 [https://www.kaggle.com/datasets/datasetengineer/smart-farming-data-2024-sf24]

-   Litreature Reference [https://www.agriculturejournal.org/volume11number3/crop-selection-and-yield-prediction-using-machine-learning-approach/]

## API Endpoints

### `/` (GET)

-   **Description:** Root endpoint.
-   **Response:** A welcome message.

### `/detect` (POST)

-   **Description:** Analyzes an uploaded image for plant diseases or pests.
-   **Request:**
    -   `file`: An image file.
-   **Response:** A JSON object with the analysis results:
    ```json
    {
        "detected": true/false,
        "issues": [
            {
                "type": "disease" or "pest",
                "name": "name of disease/pest",
                "confidence": 0-100,
                "description": "brief description",
                "treatment": "treatment recommendation",
                "bbox": [x_min, y_min, x_width, y_height]
            }
        ],
        "processed_image": "data:image/jpeg;base64,...", // Base64 encoded image with bounding boxes
        "id": "unique-analysis-id"
    }
    ```

### `/health` (GET)

-   **Description:** Health check endpoint.
-   **Response:**
    ```json
    {
        "status": "healthy",
        "model": "gemini-2.0-flash-lite"
    }
    ```

## Deployment

### NextJS 

-   The JS backend that act as an interface is deployed at Vercel

### FastAPI 

-   The Python backend that act to run the regressional models is deployed at Hugging Face Spaces

## License

MIT
