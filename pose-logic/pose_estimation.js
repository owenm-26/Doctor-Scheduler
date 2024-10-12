// pose_estimation.js
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    return new Promise(resolve => {
        video.onloadedmetadata = () => resolve(video);
    });
}

async function loadModel() {
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    };
    return poseDetection.createDetector(model, detectorConfig);
}

async function detectPose(detector, video) {
    const poses = await detector.estimatePoses(video);
    return poses[0];
}

function drawKeypoints(pose) {
    if (pose && pose.keypoints) {
        for (let keypoint of pose.keypoints) {
            if (keypoint.score > 0.3) {
                ctx.beginPath();
                ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            }
        }
    }
}

function drawSkeleton(pose) {
    const connections = [
        ['nose', 'left_eye'], ['nose', 'right_eye'], ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
        ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
        ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'], ['left_shoulder', 'left_hip'],
        ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'], ['left_hip', 'left_knee'],
        ['right_hip', 'right_knee'], ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];

    if (pose && pose.keypoints) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        for (let [start, end] of connections) {
            const startPoint = pose.keypoints.find(kp => kp.name === start);
            const endPoint = pose.keypoints.find(kp => kp.name === end);
            if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
                ctx.beginPath();
                ctx.moveTo(startPoint.x, startPoint.y);
                ctx.lineTo(endPoint.x, endPoint.y);
                ctx.stroke();
            }
        }
    }
}

async function renderLoop(detector, video) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const pose = await detectPose(detector, video);
    drawSkeleton(pose);
    drawKeypoints(pose);

    requestAnimationFrame(() => renderLoop(detector, video));
}

async function main() {
    const video = await setupCamera();
    const detector = await loadModel();
    renderLoop(detector, video);
}

main();