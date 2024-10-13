// components/VideoStream.tsx

import { useEffect, useRef, useState } from 'react';

const VideoStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wsData, setWsData] = useState<any>(null); // State to store WebSocket data
  const [isConnected, setIsConnected] = useState<boolean>(false); // Connection status
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket
    wsRef.current = new WebSocket('ws://localhost:8765');

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      sendFrame(); // Start sending frames once connected
    };

    wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    wsRef.current.onmessage = (event) => {
      console.log(event.data);
      setWsData(event.data); // Store the received data in state
    };

    // Access user media
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    };

    getUserMedia();

    // Cleanup function to close WebSocket connection
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendFrame = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Set canvas dimensions to match the video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a Blob (JPEG image) and send it through WebSocket
      canvas.toBlob((blob) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          if (blob) {
            wsRef.current.send(blob);
          }
        }
      }, 'image/jpeg', 0.8);
    }
  }

  requestAnimationFrame(sendFrame);
};


  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {/* Render the WebSocket data and connection status for debugging */}
      <div>
        <h3>WebSocket Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</h3>
        <h4>Received Data:</h4>
        <pre>{JSON.stringify(wsData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default VideoStream;
