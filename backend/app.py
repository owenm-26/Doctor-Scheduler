from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import base64
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/upload-frame', methods=['POST'])
def receive_frame():
    print("triggered")
    data = request.get_json()
    image_data = data.get('image')

    if image_data:
        # Process the image data (e.g., save to disk, analyze, etc.)
        # Remove the prefix 'data:image/jpeg;base64,' if it exists
        if image_data.startswith('data:image/jpeg;base64,'):
            image_data = image_data.replace('data:image/jpeg;base64,', '')
        
        # Save the image (optional)
        with open('received_frame.jpg', 'wb') as f:
            f.write(base64.b64decode(image_data))
        
        return jsonify({"message": "Image received successfully"}), 200
    return jsonify({"error": "No image data provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
