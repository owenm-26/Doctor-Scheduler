import asyncio
import websockets
import cv2
import numpy as np
import json

from pose_api import get_excercise_scores


async def handle_client(websocket, path):
    try:
        async for message in websocket:
            # Convert the received blob to a numpy array
            nparr = np.frombuffer(message, np.uint8)

            # Decode the image
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            exercise_scores = get_excercise_scores(frame)

            # print(exercise_scores)
            # print(f"Received frame with shape: {frame.shape}")

            await websocket.send(json.dumps(exercise_scores))

    except websockets.exceptions.ConnectionClosedError:
        print("Client disconnected")


async def main():
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("WebSocket server started")
    await server.wait_closed()


if __name__ == "__main__":
    asyncio.run(main())
