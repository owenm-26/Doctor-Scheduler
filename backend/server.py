import asyncio
import json
import cv2
import numpy as np
import base64
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.signaling import TcpSocketSignaling
from aiortc.mediastreams import MediaStreamTrack

class VideoStreamTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self):
        super().__init__()
        self.frame_count = 0

    async def recv(self):
        self.frame_count += 1
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(frame, f"Frame {self.frame_count}", (50, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        return frame

async def run_client(pc, signaling):
    await signaling.connect()

    @pc.on("datachannel")
    def on_datachannel(channel):
        @channel.on("message")
        def on_message(message):
            # Decode base64 image
            img_data = base64.b64decode(message.split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Process the image (e.g., display or save it)
            cv2.imshow("Received Frame", img)
            cv2.waitKey(1)

    # Create an offer
    await pc.setLocalDescription(await pc.createOffer())

    # Send the offer
    await signaling.send(pc.localDescription)

    # Wait for the answer
    answer = await signaling.receive()

    # Apply the answer
    await pc.setRemoteDescription(answer)

    await asyncio.sleep(3600)  # Keep the connection alive for an hour

async def main():
    signaling = TcpSocketSignaling("localhost", 8080)
    pc = RTCPeerConnection()

    # Add our video stream
    pc.addTrack(VideoStreamTrack())

    await run_client(pc, signaling)

if __name__ == "__main__":
    asyncio.run(main())