// Get the output canvas and its 2D rendering context
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

const MAX_FRAMES = 50; // Total frames to record
const RECORD_EVERY = 6; // Record every 5th frame
let recordedFrames = []; // Array to store the pose data
let frameCounter = 0; // Counter to track the number of frames processed

// Function to set up the camera
async function setupCamera() {
    // Request access to the user's webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video'); // Create a video element
    video.srcObject = stream; // Set the video source to the webcam stream
    video.play(); // Play the video
    return new Promise(resolve => {
        video.onloadedmetadata = () => resolve(video); // Resolve the promise when metadata is loaded
    });
}

// Function to load the pose detection model
async function loadModel() {
    const model = poseDetection.SupportedModels.MoveNet; // Select the MoveNet model
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING // Use the lightning version of the model for speed
    };
    return poseDetection.createDetector(model, detectorConfig); // Create and return the detector
}

// Function to detect the pose in the video
async function detectPose(detector, video) {
    const poses = await detector.estimatePoses(video); // Estimate poses from the video
    return poses[0]; // Return the first detected pose
}

// Function to draw keypoints on the canvas
function drawKeypoints(pose) {
    if (pose && pose.keypoints) {
        for (let keypoint of pose.keypoints) {
            if (keypoint.score > 0.3) { // Only draw keypoints with a score above 0.3
                ctx.beginPath();
                ctx.arc(canvas.width - keypoint.x, keypoint.y, 5, 0, 2 * Math.PI); // Draw a circle at the keypoint location
                ctx.fillStyle = 'red'; // Set the fill color to red
                ctx.fill(); // Fill the circle
            }
        }
    }
}

// Function to draw the skeleton lines connecting keypoints
function drawSkeleton(pose) {
    // Define connections between keypoints
    const connections = [
        ['nose', 'left_eye'], ['nose', 'right_eye'], ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
        ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
        ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'], ['left_shoulder', 'left_hip'],
        ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'], ['left_hip', 'left_knee'],
        ['right_hip', 'right_knee'], ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];

    if (pose && pose.keypoints) {
        ctx.strokeStyle = 'blue'; // Set the stroke color for the skeleton lines
        ctx.lineWidth = 2; // Set the line width
        for (let [start, end] of connections) {
            // Find the start and end points of each connection
            const startPoint = pose.keypoints.find(kp => kp.name === start);
            const endPoint = pose.keypoints.find(kp => kp.name === end);
            // Draw the line if both keypoints are found and have a score above 0.3
            if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
                ctx.beginPath();
                ctx.moveTo(canvas.width -startPoint.x, startPoint.y); // Move to the start point
                ctx.lineTo(canvas.width - endPoint.x, endPoint.y); // Draw to the end point
                ctx.stroke(); // Render the line
            }
        }
    }
}

// Function to continuously render the video and pose estimates
async function renderLoop(detector, video) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the current video frame
    // Save the current state of the canvas context
    ctx.save();

    // Flip the canvas horizontally
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Draw the video frame

    // Restore the canvas context to its original state
    ctx.restore();
    const pose = await detectPose(detector, video); // Detect the pose in the current video frame

    frameCounter++;

    if (recordedFrames.length < MAX_FRAMES && frameCounter % RECORD_EVERY === 0) {
        if (pose) {
            recordedFrames.push(pose); // Store the detected pose
        }
    }
    // Log recorded data after reaching the maximum frames
    if (recordedFrames.length >= MAX_FRAMES) {
        console.log("Recording complete. Recorded frames:");

        // Loop through each recorded frame and log it
        recordedFrames.forEach((frame, index) => {
            console.log(`Frame ${index + 1}:`, JSON.stringify(frame, null, 2)); // Pretty print the frame data
        });

        return; // Exit the loop
    }

    drawSkeleton(pose); // Draw the skeleton based on the detected pose
    drawKeypoints(pose); // Draw the keypoints

    requestAnimationFrame(() => renderLoop(detector, video)); // Schedule the next frame
}

// Main function to set up the camera and start the detection process
async function main() {
    const video = await setupCamera(); // Set up the camera and get the video stream
    const detector = await loadModel(); // Load the pose detection model
    renderLoop(detector, video); // Start the rendering loop
}

// Call the main function to kick off the process
main();
