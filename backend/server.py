import asyncio
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

        # Display the received frame
        cv2.imshow("Received Frame", img)
        cv2.waitKey(1)

async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):  # Change host and port as needed
        print("WebSocket server running on ws://localhost:8765")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
