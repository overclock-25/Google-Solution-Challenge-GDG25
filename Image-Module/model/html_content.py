HOME_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plant Disease Detection System</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        header {
            background-color: #2e7d32;
            color: white;
            text-align: center;
            padding: 2rem 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 2rem;
            margin-bottom: 2rem;
        }
        h1 {
            margin-top: 0;
            font-size: 2.5rem;
        }
        h2 {
            color: #2e7d32;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 0.5rem;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .feature-item {
            background-color: #f5f5f5;
            border-left: 4px solid #2e7d32;
            padding: 1.5rem;
            border-radius: 4px;
        }
        .cta-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-block;
            padding: 0.8rem 1.5rem;
            background-color: #2e7d32;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #1b5e20;
        }
        .btn-secondary {
            background-color: #f5f5f5;
            color: #2e7d32;
            border: 1px solid #2e7d32;
        }
        .btn-secondary:hover {
            background-color: #e8f5e9;
        }
        footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 1rem 0;
            margin-top: 2rem;
        }
        code {
            background-color: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
        }
        .api-example {
            background-color: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <header>
        <h1>Plant Disease Detection System</h1>
        <p>Identify plant diseases and pests with AI-powered analysis</p>
    </header>

    <div class="container">
        <div class="card">
            <h2>Welcome to Our Plant Health Analysis Tool</h2>
            <p>
                Our system uses Google's Gemini AI to analyze images of plants and identify potential diseases or pests.
                Simply upload a photo, and our system will provide detailed analysis and treatment recommendations.
            </p>
            
            <div class="cta-buttons">
                <a href="https://plant-health-detection.vercel.app/" class="btn">Launch Web Interface</a>
                <a href="#api-docs" class="btn btn-secondary">API Documentation</a>
            </div>
        </div>

        <div class="card">
            <h2>Features</h2>
            <div class="feature-grid">
                <div class="feature-item">
                    <h3>Disease Detection</h3>
                    <p>Identify common plant diseases with confidence scores and detailed descriptions</p>
                </div>
                <div class="feature-item">
                    <h3>Pest Identification</h3>
                    <p>Detect harmful pests that might be affecting your plants</p>
                </div>
                <div class="feature-item">
                    <h3>Treatment Recommendations</h3>
                    <p>Get actionable advice on how to treat identified issues</p>
                </div>
                <div class="feature-item">
                    <h3>Visual Analysis</h3>
                    <p>View highlighted areas showing exactly where problems were detected</p>
                </div>
            </div>
        </div>

        <div class="card" id="api-docs">
            <h2>API Documentation</h2>
            <p>
                Our system provides a REST API for integration with your applications.
            </p>
            
            <h3>Endpoints</h3>
            <ul>
                <li><code>GET /</code> - This homepage</li>
                <li><code>GET /health</code> - API health check</li>
                <li><code>POST /detect</code> - Analyze plant image</li>
                <li><code>GET /gradio</code> - Web interface</li>
            </ul>
            
            <h3>Example: Detect Plant Issues</h3>
            <p>Send a POST request to <code>/detect</code> with an image file:</p>
            
            <div class="api-example">
                <pre>curl -X POST -F "file=@plant.jpg" http://localhost:8000/detect</pre>
            </div>
            
            <h3>Response Format</h3>
            <div class="api-example">
<pre>{
  "detected": true,
  "valid": true,
  "blurred": false,
  "obj": "plant",
  "issues": [
    {
      "type": "disease",
      "name": "Powdery Mildew",
      "confidence": 92,
      "description": "Fungal infection appearing as white powdery spots",
      "treatment": "Apply fungicide and improve air circulation",
      "bbox": [10, 20, 30, 40]
    }
  ],
  "processed_image": "data:image/jpeg;base64,..."
}</pre>
            </div>
        </div>
    </div>

    <footer>
        <p>Plant Disease Detection System &copy; 2025</p>
    </footer>
</body>
</html>
"""