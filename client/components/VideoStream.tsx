import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const VideoStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [wsData, setWsData] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [frameCount, setFrameCount] = useState<number>(0);
    const wsRef = useRef<WebSocket | null>(null);
    
    // Throttle time in milliseconds
    const throttleTime = 1000; // Send frames every 1000 ms (1 second)
    const lastSentTimeRef = useRef<number>(0);

    // State to manage chart data
    const [chartData, setChartData] = useState<{
        labels: string[];
        datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; fill: boolean; yAxisID: string; }[];
    }>({
        labels: [],
        datasets: [
            {
                label: 'Squats',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                yAxisID: 'y1', // Link to the first Y-axis
            },
        ],
    });

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
            console.log('WebSocket message received:', event.data); // Log received data
        
            // Parse the incoming JSON data
            try {
                const receivedData = JSON.parse(event.data); // Parse the JSON string
                console.log('Parsed data:', receivedData);
        
                // For squats, use the received value but ensure it stays between 0 and 10
                let squats = Math.min(Math.max(receivedData.squats_up || 0, 0), 10); // Clamp value between 0 and 10

                setWsData({ squats }); // Store the received data

                // Get current time for the label
                const newTimestamp = new Date().toLocaleTimeString();
                
                // Update chart data
                setChartData((prevChartData) => {
                    const updatedLabels = [...prevChartData.labels, newTimestamp];
                    const updatedSquatsData = [...prevChartData.datasets[0].data, squats];

                    // Limit the number of data points to avoid overcrowding the chart
                    if (updatedLabels.length > 20) {
                        updatedLabels.shift(); // Remove the oldest label
                        updatedSquatsData.shift(); // Remove the oldest data point for squats
                    }

                    return {
                        labels: updatedLabels,
                        datasets: [
                            {
                                ...prevChartData.datasets[0],
                                data: updatedSquatsData,
                            },
                        ],
                    };
                });
        
            } catch (error) {
                console.error('Error parsing WebSocket data:', error);
            }
        };

        // Access user media for video
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
    }, []); // No dependencies to ensure the WebSocket opens only once

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
                if (currentTime - lastSentTimeRef.current > throttleTime) {
                    lastSentTimeRef.current = currentTime;

                    // Convert the canvas content to a Blob (JPEG image) and send it through WebSocket
                    canvas.toBlob((blob) => {
                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                            if (blob) {
                                wsRef.current.send(blob);
                                setFrameCount((prevCount) => prevCount + 1); // Increment frame count
                            }
                        }
                    }, 'image/jpeg', 0.8);
                }
            }
        }

        requestAnimationFrame(sendFrame);
    };

    return (
        <div className="flex flex-row justify-center items-center gap-4 w-full">
            <video ref={videoRef} width="640" height="480" autoPlay></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <div className="flex flex-col gap-2 w-full h-full max-w-lg">
                <h2 className="text-4xl">Received Data:</h2>
                <div className="overflow-auto max-h-96">
                    {wsData ? (
                        <div>
                            <p>Squats: {wsData.squats}</p>
                        </div>
                    ) : (
                        <p>No data received yet.</p>
                    )}
                </div>
                <h4 className="text-2xl">Frames Sent: {frameCount}</h4>
                <h4 className="text-2xl">Last Sent Timestamp: {new Date(lastSentTimeRef.current).toLocaleTimeString()}</h4>
                <Line 
                    data={chartData} 
                    options={{
                        responsive: true,
                        plugins: { legend: { display: true } },
                        scales: {
                            y1: {
                                type: 'linear',
                                position: 'left',
                                min: 0, 
                                max: 10, // Set maximum value to 10
                                title: {
                                    display: true,
                                    text: 'Squats',
                                },
                            },
                        },
                    }} 
                />
            </div>
        </div>
    );
};

export default VideoStream;
