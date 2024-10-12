import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Initialize the camera
cap = cv2.VideoCapture(1)

# Get video properties
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

# List to store pose data
pose_data = []

# Set the duration for recording (in seconds)
duration = 12
start_time = time.time()

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Create a copy of the frame for display
    display_frame = frame.copy()

    # Convert the BGR image to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame and detect the pose
    results = pose.process(rgb_frame)

    if results.pose_landmarks:
        # Extract landmark coordinates
        landmarks = np.array([[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark])
        pose_data.append(landmarks.flatten())  # Flatten the array and append

        # Draw the pose landmarks on the display frame
        mp_drawing.draw_landmarks(
            display_frame, 
            results.pose_landmarks, 
            mp_pose.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
            mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
        )

        # todo: data preprocessing and classify
        

    # Calculate elapsed time
    elapsed_time = time.time() - start_time
    remaining_time = max(0, duration - elapsed_time)

    # Display remaining time on both frames
    cv2.putText(frame, f"Time left: {remaining_time:.1f}s", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(display_frame, f"Time left: {remaining_time:.1f}s", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Display the frame with overlay
    cv2.imshow('Pose Recording', display_frame)

    # Break the loop when 'q' is pressed or 10 seconds have passed
    if cv2.waitKey(1) & 0xFF == ord('q') or elapsed_time >= duration:
        break

# Release the camera, video writer, and close windows
cap.release()
cv2.destroyAllWindows()

# Convert pose_data to a numpy array and save it
pose_array = np.array(pose_data)