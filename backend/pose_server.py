import asyncio
import websockets
import cv2
import numpy as np
import base64
import struct

def analyze_image(nparr):
    # Convert the numpy array to an image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Example analysis: Calculate the average color of the image
    # This will return an array of 3 elements (B, G, R)
    avg_color = np.mean(img, axis=(0, 1))
    
    # Example: Create a histogram for each color channel
    # This will give us 256 * 3 = 768 elements
    hist = []
    for i in range(3):
        channel_hist = cv2.calcHist([img], [i], None, [256], [0, 256])
        hist.extend(channel_hist.flatten())
    
    # Combine the results (3 + 768 = 771 elements)
    result = np.concatenate((avg_color, hist))
    
    return result.astype(np.float32)  # Ensure all data is float32

async def handle_connection(websocket, path):
    print("New client connected")
    async for message in websocket:
        # Decode the base64 image data
        header, encoded = message.split(',', 1)
        image_bytes = base64.b64decode(encoded)
        # Convert bytes to a numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        
        # Analyze the image
        analysis_result = analyze_image(nparr)
        
        # Print the received data to the console
        print("Received and analyzed image data:")
        print(f"Analysis result length: {len(analysis_result)}")
        print(f"First 10 elements of analysis result: {analysis_result[:10]}")
        
        # Convert the numpy array to bytes and send it back to the client
        binary_data = analysis_result.tobytes()
        await websocket.send(binary_data)
    
    print("Client disconnected")

async def main():
    server = await websockets.serve(handle_connection, "localhost", 8765)  # Change host and port as needed
    print("WebSocket server running on ws://localhost:8765")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())