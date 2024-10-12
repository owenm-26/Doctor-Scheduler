"use client";

import { useEffect, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";

const Camera: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  // Draw keypoints on the canvas
  const drawKeypoints = (pose: poseDetection.Pose | undefined, ctx: CanvasRenderingContext2D) => {
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
  const drawSkeleton = (pose: poseDetection.Pose | undefined, ctx: CanvasRenderingContext2D) => {
    const connections: [string, string][] = [
      ["nose", "left_eye"], ["nose", "right_eye"], ["left_eye", "left_ear"], ["right_eye", "right_ear"],
      ["left_shoulder", "right_shoulder"], ["left_shoulder", "left_elbow"], ["right_shoulder", "right_elbow"],
      ["left_elbow", "left_wrist"], ["right_elbow", "right_wrist"], ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"], ["left_hip", "right_hip"], ["left_hip", "left_knee"],
      ["right_hip", "right_knee"], ["left_knee", "left_ankle"], ["right_knee", "right_ankle"]
    ];

    if (pose?.keypoints) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      connections.forEach(([start, end]) => {
        const startPoint = pose.keypoints.find((kp) => kp.name === start);
        const endPoint = pose.keypoints.find((kp) => kp.name === end);
        if (startPoint && endPoint && startPoint.score! > 0.3 && endPoint.score! > 0.3) {
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          ctx.stroke();
        }
      });
    }
  };

  // Main rendering loop
  const renderLoop = async (detector: poseDetection.PoseDetector) => {
    const canvas = canvasRef.current!;
    const ctx = canvas?.getContext("2d"); // Use optional chaining
    if (!ctx || !videoRef.current) return; // Early return if ctx or video is null
    const video = videoRef.current!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const pose = await detectPose(detector);
    drawSkeleton(pose, ctx);
    drawKeypoints(pose, ctx);

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

    run();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
      <canvas ref={canvasRef} width={640} height={480} style={{ border: "1px solid black" }} />
      <video ref={videoRef} style={{ display: "none" }} playsInline autoPlay />
    </div>
  );
};

export default Camera;