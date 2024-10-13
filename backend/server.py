import asyncio
import json
import websockets
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

async def handle_connection(websocket, path):
    async for message in websocket:
        # Decode the base64 image data
        header, encoded = message.split(',', 1)
        image_bytes = base64.b64decode(encoded)

        # Convert bytes to an image and display it
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        dummy_pose_grades = [0.91, 0.11, 0.33]
        await send_accuracy_grades(websocket, dummy_pose_grades)

        # Display the received frame
        cv2.imshow("Received Frame", img)
        cv2.waitKey(1)

        

# Define the function that sends accuracy grades to the frontend
async def send_accuracy_grades(websocket, data):
    # Convert the data to JSON format
    json_data = json.dumps(data)
    
    # Send the JSON data to the connected client
    await websocket.send(json_data)


async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):  # Change host and port as needed
        print("WebSocket server running on ws://localhost:8765")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
