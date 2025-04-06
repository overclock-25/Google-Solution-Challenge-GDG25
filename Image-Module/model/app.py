import os
import io
import uuid
import json
import base64
import numpy as np
import cv2
from PIL import Image
import uvicorn
import gradio as gr
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import google.generativeai as genai
import httpx
import asyncio

# Configure Google Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("Missing GEMINI_API_KEY environment variable")

genai.configure(api_key=API_KEY)

# Initialize Gemini model
LLM_MODEL = "gemini-2.0-flash-lite"
model = genai.GenerativeModel(LLM_MODEL)

# HTML content for the homepage
from html_content import HOME_HTML  # Home page for this api (not really necessary)

def analyze_image(image_data):
    """
    Use Google's Gemini model to analyze the image for plant diseases or pests.
    
    Args:
        image_data: Image as bytes or PIL Image
        
    Returns:
        dict: Analysis results in JSON format
    """
    try:
        # Convert to PIL Image if it's not already
        if not isinstance(image_data, Image.Image):
            img = Image.open(io.BytesIO(image_data))
        else:
            img = image_data
        
        # Prepare prompt for Gemini
        prompt = """
        Analyze this plant image and identify if there are any diseases or pests present.
        If you find any issues, provide the following information in JSON format:
        1. Disease/pest name
        2. Confidence level (0-100)
        3. Brief description
        4. Recommendation for treatment
        5. Bounding box coordinates [x_min, y_min, x_width, y_height] as percentages of image dimensions
        6. If you detect the main object is not plants or pest issues, set valid as false
        7. If the image is blurred, set blurred as true else false
        
        Return a valid JSON with these fields:
        {
            "detected": true/false,
            "valid": true/false,
            "blurred": true/false,
            "obj": "plant"/"pest"/"what it is actually",
            "issues": [
                {
                    "type": "disease" or "pest",
                    "name": "name of disease/pest",
                    "confidence": 0-100,
                    "description": "brief description",
                    "treatment": "treatment recommendation",
                    "bbox": [x_min, y_min, x_width, y_height]
                }
            ]
        }

        Note: Here "obj" attribute means what it is actually like soil, plastic, human or anything it is. 
        If find multiple objects set the value as an array. Don't return "others" directly return the data or info.
        """
        
        # Generate content with Gemini
        response = model.generate_content([prompt, img])
        
        # Extract and parse the JSON response
        response_text = response.text
        
        # Find JSON in the response (sometimes Gemini includes additional text)
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start != -1 and json_end != -1:
            json_str = response_text[json_start:json_end]
            result = json.loads(json_str)
        else:
            # Fallback if no proper JSON is found
            result = {"detected": False, "error": "Could not parse response"}
        
        return result
    
    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        return {"detected": False, "error": str(e)}

def draw_bounding_boxes(image_data, issues):
    """
    Draw bounding boxes on the image based on the detected issues.
    
    Args:
        image_data: Image as bytes, PIL Image, or numpy array
        issues: List of detected issues with bounding boxes
        
    Returns:
        PIL.Image: Image with bounding boxes drawn
    """
    # Convert to numpy array if it's not already
    if isinstance(image_data, Image.Image):
        image_data = np.array(image_data)
    elif isinstance(image_data, bytes):
        nparr = np.frombuffer(image_data, np.uint8)
        image_data = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # Convert BGR to RGB (OpenCV loads as BGR, but PIL uses RGB)
        image_data = cv2.cvtColor(image_data, cv2.COLOR_BGR2RGB)
    
    h, w = image_data.shape[:2]
    
    for issue in issues:
        if "bbox" in issue:
            bbox = issue["bbox"]
            x_min = int(bbox[0] * w / 100)
            y_min = int(bbox[1] * h / 100)
            x_width = int(bbox[2] * w / 100)
            y_height = int(bbox[3] * h / 100)
            
            # Define color based on type (red for disease, blue for pest)
            # Using RGB format: (255, 0, 0) for red, (0, 0, 255) for blue
            color = (255, 0, 0) if issue["type"] == "disease" else (0, 0, 255)
            
            # Draw rectangle
            cv2.rectangle(image_data, (x_min, y_min), (x_min + x_width, y_min + y_height), color, 2)
            
            # Add label
            label = f"{issue['name']} ({issue['confidence']}%)"
            cv2.putText(image_data, label, (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    # Convert back to PIL Image
    return Image.fromarray(image_data)

def image_to_base64(image_data):
    """
    Convert image data to base64 string for web display.
    
    Args:
        image_data: Image as bytes or PIL Image
        
    Returns:
        str: Base64 encoded image string with data URL prefix
    """
    if isinstance(image_data, Image.Image):
        buffered = io.BytesIO()
        image_data.save(buffered, format="JPEG")
        img_bytes = buffered.getvalue()
    else:
        img_bytes = image_data
        
    base64_encoded = base64.b64encode(img_bytes).decode("utf-8")
    return f"data:image/jpeg;base64,{base64_encoded}"

def process_image_for_gradio(image):
    """
    Process an image for the Gradio interface.
    
    Args:
        image: PIL Image uploaded through Gradio
        
    Returns:
        tuple: (processed_image, result_text)
    """
    if image is None:
        return None, "No image provided"
    
    # Analyze the image
    analysis_result = analyze_image(image)
    
    # Process image with bounding boxes if issues were detected
    if analysis_result.get("detected", False) and "issues" in analysis_result and analysis_result["issues"]:
        processed_image = draw_bounding_boxes(image, analysis_result["issues"])
    else:
        processed_image = image
    
    # Format the results for display
    result_text = json.dumps(analysis_result, indent=2)
    
    return processed_image, result_text

# Create FastAPI app
app = FastAPI(title="Plant Disease Detection")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Gradio interface
iface = gr.Interface(
    fn=process_image_for_gradio,
    inputs=gr.Image(type="pil", label="Upload Plant Image"),
    outputs=[
        gr.Image(label="Processed Image"),
        gr.JSON(label="Analysis Results")
    ],
    title="Plant Disease and Pest Detection",
    description="Upload an image of a plant to detect potential diseases or pests.",
    theme="default"
)

async def ping_self():
    async with httpx.AsyncClient() as client:
        while True:
            try:
                await client.get(os.getenv("BASE_URL")) 
            except:
                pass
            await asyncio.sleep(300)  # Ping every 5 minutes

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(ping_self())

# FastAPI endpoint for home page
@app.get("/", response_class=HTMLResponse)
def home():
    """
    Root endpoint for the API returning the HTML homepage.
    """
    return HOME_HTML

# FastAPI endpoint for Gradio web UI
@app.get("/gradio", response_class=HTMLResponse)
def gradio_redirect():
    """
    Redirect page to the Gradio interface.
    """
    return """
    <html>
        <head>
            <meta http-equiv="refresh" content="0;url=/gradio" />
        </head>
        <body>
            <p>Redirecting to Gradio interface...</p>
        </body>
    </html>
    """

# FastAPI endpoint for direct image upload and analysis
@app.post("/detect")
async def detect_plant_issues(file: UploadFile = File(...)):
    """
    Endpoint to detect plant diseases or pests in an uploaded image.
    
    Args:
        file: Uploaded image file
        
    Returns:
        dict: Analysis results with processed image as base64
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read the image file
    image_data = await file.read()
    
    # Analyze image with Gemini
    analysis_result = analyze_image(image_data)
    
    # Generate response with image if issues detected
    if analysis_result.get("detected", False) and "issues" in analysis_result:
        # Draw bounding boxes on the image
        img = Image.open(io.BytesIO(image_data))
        processed_image = draw_bounding_boxes(img, analysis_result["issues"])
        
        # Convert to base64 for sending in response
        base64_image = image_to_base64(processed_image)
    else:
        # If no issues detected, return the original image
        base64_image = image_to_base64(image_data)
    
    # Add the processed image to the response
    analysis_result["processed_image"] = base64_image
    
    # Generate a unique ID for this analysis
    analysis_result["id"] = str(uuid.uuid4())
    
    return analysis_result

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {
        "status": "Healthy", 
        "model": LLM_MODEL,
        "api_key": bool(API_KEY)
    }

# Mount Gradio app to FastAPI
app.mount("/", gr.routes.App(iface))

def main():
    """Run the server"""
    # app = gr.mount_gradio_app(app, iface, path="/")
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=int(os.environ.get('PORT', 7860))
    )

if __name__ == "__main__":
    main()