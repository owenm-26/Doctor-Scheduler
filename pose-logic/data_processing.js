function normalizePoseLandmarks(landmarks, landmarkNames, torsoSizeMultiplier) {
    // Normalizes landmarks translation and scale
    const normalizedLandmarks = landmarks.slice(); // Create a copy of landmarks

    // Normalize translation
    const poseCenter = getPoseCenter(normalizedLandmarks, landmarkNames);
    for (let i = 0; i < normalizedLandmarks.length; i++) {
        normalizedLandmarks[i] = normalizedLandmarks[i].map((coord, index) => coord - poseCenter[index]);
    }

    // Normalize scale
    const poseSize = getPoseSize(normalizedLandmarks, landmarkNames, torsoSizeMultiplier);
    for (let i = 0; i < normalizedLandmarks.length; i++) {
        normalizedLandmarks[i] = normalizedLandmarks[i].map(coord => coord / poseSize);
    }

    // Multiplication by 100 for debugging
    for (let i = 0; i < normalizedLandmarks.length; i++) {
        normalizedLandmarks[i] = normalizedLandmarks[i].map(coord => coord * 100);
    }

    return normalizedLandmarks;
}

function getPoseCenter(landmarks, landmarkNames) {
    // Calculates pose center as point between hips
    const leftHip = landmarks[landmarkNames.indexOf('left_hip')];
    const rightHip = landmarks[landmarkNames.indexOf('right_hip')];
    return leftHip.map((coord, index) => (coord + rightHip[index]) * 0.5);
}

function getPoseSize(landmarks, landmarkNames, torsoSizeMultiplier) {
    // Calculates pose size
    const twoDLandmarks = landmarks.map(landmark => landmark.slice(0, 2)); // Only use 2D

    // Hips center
    const leftHip = twoDLandmarks[landmarkNames.indexOf('left_hip')];
    const rightHip = twoDLandmarks[landmarkNames.indexOf('right_hip')];
    const hips = leftHip.map((coord, index) => (coord + rightHip[index]) * 0.5);

    // Shoulders center
    const leftShoulder = twoDLandmarks[landmarkNames.indexOf('left_shoulder')];
    const rightShoulder = twoDLandmarks[landmarkNames.indexOf('right_shoulder')];
    const shoulders = leftShoulder.map((coord, index) => (coord + rightShoulder[index]) * 0.5);

    // Torso size as the minimum body size
    const torsoSize = Math.sqrt(Math.pow(shoulders[0] - hips[0], 2) + Math.pow(shoulders[1] - hips[1], 2));

    // Max dist to pose center
    const poseCenter = getPoseCenter(twoDLandmarks, landmarkNames);
    const maxDist = Math.max(...twoDLandmarks.map(landmark => {
        return Math.sqrt(Math.pow(landmark[0] - poseCenter[0], 2) + Math.pow(landmark[1] - poseCenter[1], 2));
    }));

    return Math.max(torsoSize * torsoSizeMultiplier, maxDist);
}
