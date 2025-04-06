# Plant Disease & Pest Detection App

This application is a web-based tool that utilizes the power of Google's Gemini AI model to detect diseases and pests in plant images. Users can upload an image of a plant, and the application will analyze it, providing insights into potential issues and suggesting treatments.

## Features

-   **Image Upload:** Users can upload images of plants directly from their devices.
-   **AI-Powered Analysis:** Leverages Google's Gemini AI model to analyze plant images for diseases and pests.
-   **Issue Detection:** Identifies potential diseases or pests present in the plant.
-   **Detailed Results:** Provides detailed information about detected issues, including:
    -   Issue name (e.g., "Late Blight," "Aphids")
    -   Type (disease or pest)
    -   Confidence level (percentage)
    -   Description of the issue
    -   Treatment recommendations
-   **Bounding Box Visualization:** If issues are detected, the application draws bounding boxes around the affected areas in the image.
-   **Processed Image Display:** Shows the original image alongside the processed image with bounding boxes.
-   **User-Friendly Interface:** Clean and intuitive design for easy navigation.
-   **Real-time Feedback:** Displays loading indicators and error messages to keep users informed.
- **Health Check:** The backend has a health check endpoint to verify the API is running.

## Technologies Used

-   **Frontend:**
    -   [Next.js](https://nextjs.org/) (React framework)
    -   [React](https://react.dev/) (JavaScript library for building user interfaces)
    -   [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
    -   `next/image` (For optimized image handling)
-   **Backend:**
    -   FastAPI (Modern, fast web framework for building APIs with Python)
    -   Google Gemini API (AI model for image analysis)
    -   Pillow (PIL) (Python Imaging Library for image processing)
    -   OpenCV (cv2) (Computer vision library for image manipulation)
    -   Uvicorn (ASGI server for running FastAPI)
    -   python-dotenv (For managing environment variables)
- **Deployment:**
    - Render (Backend)
    - Vercel (Frontend)

## File Tree

```
Image-Module/
├─ app/
│  ├─ api/
│  │  ├─ check/
│  │  │  └─ route.js
│  │  ├─ detect/
│  │  │  └─ route.js
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
├─ model/
│  ├─ app.py
│  ├─ html_content.py
│  ├─ model.ipynb
│  └─ requirements.txt
├─ public/
│  └─ service-worker.js
├─ .gitignore
├─ eslint.config.mjs
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
└─ README.md
```

## Getting Started

### Prerequisites

-   **Node.js** (version 18 or later recommended) and **npm** (or **yarn**, **pnpm**, **bun**) for the frontend.
-   **Python 3.8+** for the backend.
-   **Google Gemini API Key:** You'll need a Google Gemini API key to use the backend. Set it as an environment variable named `GEMINI_API_KEY`.

### Frontend Setup (Next.js)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd GreenTip/Image-Module
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install, pnpm install, bun install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev # or yarn dev, pnpm dev, bun dev
    ```
4.  Open http://localhost:3000 in your browser.

### Backend Setup (FastAPI)

1.  **Navigate to the backend directory:**
    ```bash
    cd model
    ```
2.  **Create a virtual environment (recommended):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *Note:* You will need to create a `requirements.txt` file in the `Gemini-Model` directory. Add the following to it:
    ```
    fastapi
    uvicorn
    python-dotenv
    Pillow
    opencv-python
    google-generativeai
    ```
4.  **Set the `GEMINI_API_KEY` environment variable:**
    -   **Linux/macOS:**
        ```bash
        export GEMINI_API_KEY="your_api_key_here"
        ```
    -   **Windows:**
        ```bash
        set GEMINI_API_KEY="your_api_key_here"
        ```
    -   Alternatively, create a `.env` file in the `Gemini-Model` directory and add:
        ```
        GEMINI_API_KEY=your_api_key_here
        ```
5.  **Run the FastAPI application:**
    ```bash
    uvicorn main:app --reload
    ```
6. The backend will run on `http://127.0.0.1:8000`.

### Connecting Frontend and Backend

-   Ensure that the frontend is configured to send requests to the correct backend URL. In `app/page.js`, the `fetch` URL should point to your backend:
    ```javascript
    const response = await fetch("https://plant-health-detection.vertcel.app/detect", { // Or http://127.0.0.1:8000/detect if running locally
        method: "POST",
        body: formData,
    });
    ```
    - If you are running locally, change the url to `http://127.0.0.1:8000/detect`

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

### Frontend (Next.js)

-   The easiest way to deploy the Next.js frontend is using Vercel.
-   Connect your repository to Vercel and follow the deployment instructions.

### Backend (FastAPI)

-   The backend can be deployed on various platforms like Render, Heroku, or any other service that supports Python applications.
-   Make sure to set the `GEMINI_API_KEY` environment variable in your deployment environment.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

MIT
