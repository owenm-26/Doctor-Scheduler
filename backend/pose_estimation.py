import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()


def calc_landmarks(rgb_frame):
    results = pose.process(rgb_frame)

    if results.pose_landmarks:
        # Extract landmark coordinates
        landmarks = np.array(
            [[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark]
        )
        return landmarks
        # return landmarks.flatten()
    return None