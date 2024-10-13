import { useEffect, useRef, useState } from 'react';

const VideoStreamPT: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wsData, setWsData] = useState<any>(null); // State to store WebSocket data
  const [isConnected, setIsConnected] = useState<boolean>(false); // Connection status
  const [frameCount, setFrameCount] = useState<number>(0); // Count of frames sent
  const wsRef = useRef<WebSocket | null>(null);

  // State for recording
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  // Throttle time in milliseconds
  const throttleTime = 100; // Send frames every 100 ms (10 FPS)
  const lastSentTimeRef = useRef<number>(0);

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

          // Initialize MediaRecorder
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setRecordedChunks((prev) => [...prev, event.data]);
            }
          };
          recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'recording.webm';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]); // Reset recorded chunks
          };
          setMediaRecorder(recorder);
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

        // Check if enough time has passed to send the frame
        const currentTime = Date.now();
        if (currentTime - lastSentTimeRef.current >= throttleTime) {
          lastSentTimeRef.current = currentTime;

          // Convert the canvas content to a Blob (JPEG image) and send it through WebSocket
          canvas.toBlob((blob) => {
            if (blob && wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(blob);
              setFrameCount((prevCount) => prevCount + 1); // Increment frame count
            }
          }, 'image/jpeg', 0.8);
        }
      }
    }

    requestAnimationFrame(sendFrame); // Schedule next frame
  };

  const renderWsData = (data: any) => {
    if (typeof data === 'object' && data !== null) {
      return (
        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-lg font-bold border border-gray-400 px-2 py-1">Key</th>
              <th className="text-lg font-bold border border-gray-400 px-2 py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key} className="even:bg-gray-50">
                <td className="text-lg border border-gray-400 px-2 py-1">{key}</td>
                <td className="text-lg border border-gray-400 px-2 py-1">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return <p>No data received.</p>;
  };

  const handleRecordToggle = () => {
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.stop();
        setIsRecording(false);
      } else {
        setRecordedChunks([]); // Clear previous recordings
        mediaRecorder.start();
        setIsRecording(true);
      }
    }
  };

  return (
    <div className="flex flex-row justify-center items-center gap-6 w-full">
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button
        onClick={handleRecordToggle}
        className={`mt-4 px-4 py-2 text-white font-semibold rounded ${
          isRecording ? 'bg-red-600' : 'bg-green-600'
        }`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className="flex flex-col gap-2 w-full h-full max-w-lg">
        <h2 className="text-4xl">Received Data:</h2>
        <div className="overflow-auto max-h-96">
          {wsData ? renderWsData(JSON.parse(wsData)) : <p>No data received yet.</p>}
        </div>
        <h4 className="text-2xl">Frames Sent: {frameCount}</h4>
        <h4 className="text-2xl">Last Sent Timestamp: {new Date(lastSentTimeRef.current).toLocaleTimeString()}</h4>
      </div>
    </div>
  );
};

export default VideoStreamPT;
