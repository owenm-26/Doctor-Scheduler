import cv2
import numpy as np
import time

# Load the saved pose data
pose_data = np.load('pose_movement.npy')

# Open the video file
cap = cv2.VideoCapture('pose_movement2.mp4')

# Get video properties
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

# Define connections between landmarks
POSE_CONNECTIONS = [
    (0, 1), (0, 4), (1, 2), (2, 3), (3, 7), (4, 5), (5, 6), (6, 8),  # Face
    (9, 10), (11, 12), (11, 13), (13, 15), (15, 17), (15, 19), (15, 21), 
    (17, 19), (12, 14), (14, 16), (16, 18), (16, 20), (16, 22), (18, 20),
    (11, 23), (12, 24), (23, 24), (23, 25), (24, 26), (25, 27), (26, 28),
    (27, 29), (28, 30), (29, 31), (30, 32), (27, 31), (28, 32)
]

frame_index = 0

while cap.isOpened():
    time.sleep(1/30)
    ret, frame = cap.read()
    if not ret:
        break

    # Get the pose data for the current frame
    if frame_index < len(pose_data):
        current_pose = pose_data[frame_index]

        # Reshape the flattened pose data
        landmarks = current_pose.reshape(-1, 3)

        # Draw landmarks and connections
        for landmark in landmarks:
            x, y = int(landmark[0] * frame_width), int(landmark[1] * frame_height)
            cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)

        for connection in POSE_CONNECTIONS:
            start_point = landmarks[connection[0]]
            end_point = landmarks[connection[1]]
            start_point = (int(start_point[0] * frame_width), int(start_point[1] * frame_height))
            end_point = (int(end_point[0] * frame_width), int(end_point[1] * frame_height))
            cv2.line(frame, start_point, end_point, (255, 0, 0), 2)

    # Display the frame
    cv2.imshow('Pose Playback', frame)

    # Break the loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    frame_index += 1

# Release the video capture, writer, and close windows
cap.release()
cv2.destroyAllWindows()

print("Playback complete. Overlay video saved as 'pose_movement_with_overlay.mp4'")