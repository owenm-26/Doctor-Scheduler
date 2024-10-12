"use client";
import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

const PoseEstimation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Function to initialize TensorFlow backend
  const initBackend: any = async () => {
    await tf.ready(); // Ensure TensorFlow.js is ready
    await tf.setBackend("webgl"); // Set the backend to WebGL
  };

  // Setup the webcam
  const setupCamera = async (): Promise<HTMLVideoElement> => {
    const video = videoRef.current!;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
      video.onloadedmetadata = () => resolve(video);
    });
  };

  // Load the pose detection model
  const loadModel: any = async () => {
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    return await poseDetection.createDetector(model, detectorConfig);
  };

  // Detect pose in video
  const detectPose = async (detector: any) => {
    const video = videoRef.current!;
    const poses = await detector.estimatePoses(video);
    return poses[0];
  };

  // Draw keypoints on the canvas
  const drawKeypoints = (pose: any, ctx: CanvasRenderingContext2D) => {
    if (pose && pose.keypoints) {
      pose.keypoints.forEach((keypoint: any) => {
        // Log the keypoint data for debugging
        console.log(
          `Keypoint: ${keypoint.name}, Score: ${keypoint.score}, X: ${keypoint.x}, Y: ${keypoint.y}`
        );

        // Adjusted score threshold for better visibility
        if (keypoint.score > 0.1) {
          // You can experiment with this threshold
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red"; // You can change color for visibility
          ctx.fill();
        }
      });
    }
  };

  // Rendering loop for pose estimation
  const renderLoop = async (detector: any, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); // Clear the canvas using dynamic width/height
    ctx.drawImage(
      videoRef.current!,
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    ); // Draw the video feed

    const pose = await detectPose(detector); // Detect the pose

    // Log the pose data for debugging
    console.log(pose);

    drawKeypoints(pose, ctx); // Draw the keypoints on canvas

    requestAnimationFrame(() => renderLoop(detector, ctx)); // Repeat the loop
  };

  // Main function to initiate camera, model, and rendering
  useEffect(() => {
    const runPoseEstimation: any = async () => {
      await initBackend(); // Initialize the TensorFlow.js backend
      await setupCamera();
      const video = videoRef.current!;
      video.play(); // Play the video once loaded

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const detector = await loadModel(); // Load the pose detection model

      renderLoop(detector, ctx); // Start the rendering loop
    };

    runPoseEstimation(); // Trigger the webcam setup and model loading
  }, []);

  return (
    <div>
      <h1>Webcam Pose Estimation</h1>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        playsInline
      ></video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default PoseEstimation;
