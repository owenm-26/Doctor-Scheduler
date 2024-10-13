import { useEffect, useRef } from 'react';

const VideoStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket
    wsRef.current = new WebSocket('ws://localhost:8765');

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
      sendFrame();
    };

    wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
    wsRef.current.onclose = () => console.log('WebSocket connection closed');

    wsRef.current.onmessage = (event) => {
      console.log(event.data);
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
    const ctx = canvas?.getContext('2d');

    if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob((blob) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          if (blob) {
            wsRef.current.send(blob);
          }
        }
      }, 'image/jpeg', 0.8);
    }

    requestAnimationFrame(sendFrame);
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default VideoStream;
