"use client";

import { useEffect, useRef, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { PoseGrade } from "@/app/interfaces";

const Camera: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const [grades, setGrades] = useState<{ [key: string]: { accuracy: number } }>(
    {}
  );
  const lastReceivedTimeRef = useRef<number>(0);
  const throttleTime = 10; // Throttle updates to every 2 seconds

  // Draw keypoints on the canvas
  const drawKeypoints = (
    pose: poseDetection.Pose | undefined,
    ctx: CanvasRenderingContext2D
  ) => {
    if (pose?.keypoints) {
      pose.keypoints.forEach((keypoint) => {
        if (keypoint.score && keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      });
    }
  };

  // Draw skeleton connections on the canvas
  const drawSkeleton = (
    pose: poseDetection.Pose | undefined,
    ctx: CanvasRenderingContext2D
  ) => {
    const connections: [string, string][] = [
      ["nose", "left_eye"],
      ["nose", "right_eye"],
      ["left_eye", "left_ear"],
      ["right_eye", "right_ear"],
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["right_shoulder", "right_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["right_hip", "right_knee"],
      ["left_knee", "left_ankle"],
      ["right_knee", "right_ankle"],
    ];

    if (pose?.keypoints) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      connections.forEach(([start, end]) => {
        const startPoint = pose.keypoints.find((kp) => kp.name === start);
        const endPoint = pose.keypoints.find((kp) => kp.name === end);
        if (
          startPoint &&
          endPoint &&
          startPoint.score! > 0.3 &&
          endPoint.score! > 0.3
        ) {
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          ctx.stroke();
        }
      });
    }
  };

  // Initialize TensorFlow backend
  const initBackend = async () => {
    await tf.setBackend("webgl");
    await tf.ready();
  };

  // Setup camera stream
  const setupCamera = async (): Promise<HTMLVideoElement> => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = videoRef.current!;
    video.srcObject = stream;
    return new Promise((resolve) => {
      video.onloadedmetadata = () => resolve(video);
    });
  };

  // Load the MoveNet Pose Detection model
  const loadModel = async () => {
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    return await poseDetection.createDetector(model, detectorConfig);
  };

  // Detect pose in the video
  const detectPose = async (detector: poseDetection.PoseDetector) => {
    const video = videoRef.current!;
    const poses = await detector.estimatePoses(video);
    return poses[0];
  };

  // Function to send the current video frame to the WebSocket server
  const sendVideoFrame = () => {
    if (!canvasRef.current || !websocketRef.current) return;

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/jpeg", 0.5); // Capture image from canvas

    // Check if the WebSocket connection is open before sending
    if (websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(imageData); // Send image data to the WebSocket server
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  // Main rendering loop
  const renderLoop = async (detector: poseDetection.PoseDetector) => {
    const canvas = canvasRef.current!;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !videoRef.current) return; // Early return if ctx or video is null
    const video = videoRef.current!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const pose = await detectPose(detector);
    drawSkeleton(pose, ctx);
    drawKeypoints(pose, ctx);

    // Send the frame every second (or adjust as needed)
    sendVideoFrame();

    requestAnimationFrame(() => renderLoop(detector));
  };

  // Initialize everything on mount
  useEffect(() => {
    const run = async () => {
      await initBackend();
      await setupCamera();
      const detector = await loadModel();
      renderLoop(detector);
    };

    // Connect to WebSocket server
    websocketRef.current = new WebSocket("ws://localhost:8765"); // Adjust the URL to your backend

    websocketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    websocketRef.current.onmessage = (event) => {
      const currentTime = Date.now();

      // Throttle updates
      if (currentTime - lastReceivedTimeRef.current > throttleTime) {
        lastReceivedTimeRef.current = currentTime;

        // Receive JSON data from the backend
        const receivedData = JSON.parse(event.data);
        console.log("Received accuracy grades:", receivedData);

        // Update state with received grades
        setGrades((prevGrades) => ({
          ...prevGrades,
          ...receivedData,
        }));
        setGrades(receivedData);
      }
    };

       
    websocketRef.current.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data.arrayBuffer().then(buffer => {
          const array = Array.from(new Float32Array(buffer));
          console.log("Received array:", array);
          console.log("Array length:", array.length);
        });
      } else {
        console.log("Received non-binary data:", event.data);
      }
    };

    websocketRef.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    run();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const findMaxAccuracy = (grades: {
    [key: string]: { accuracy: number };
  }): PoseGrade | null => {
    let maxPose: string | null = null;
    let maxAccuracy = -Infinity;

    // Iterate through the poses and find the maximum accuracy
    for (const pose in grades) {
      if (grades[pose].accuracy > maxAccuracy) {
        maxAccuracy = grades[pose].accuracy;
        maxPose = pose;
      }
    }

    return maxPose ? { name: maxPose, grade: maxAccuracy } : null;
  };

  const maxAccuracyPose = findMaxAccuracy(grades);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        Maximum Accuracy:{" "}
        {maxAccuracyPose
          ? `${maxAccuracyPose.name}: ${maxAccuracyPose.grade.toFixed(3)}`
          : "No data available"}
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ border: "1px solid black" }}
      />
      <video ref={videoRef} style={{ display: "none" }} playsInline autoPlay />
    </div>
  );
};

export default Camera;
