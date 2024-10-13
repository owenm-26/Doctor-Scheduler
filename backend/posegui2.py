import sys
import cv2
import mediapipe as mp
import numpy as np
import time
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QStackedWidget, QLabel, QLineEdit, QHBoxLayout
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QImage, QPixmap

from exercise_lib import detect_exercise

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Exercise Application")
        self.setGeometry(100, 100, 800, 600)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout(self.central_widget)

        self.stacked_widget = QStackedWidget()
        self.layout.addWidget(self.stacked_widget)

        self.menu_page = MenuPage(self)
        self.practice_page = PracticePage(self)
        self.record_page = RecordPage(self)

        self.stacked_widget.addWidget(self.menu_page)
        self.stacked_widget.addWidget(self.practice_page)
        self.stacked_widget.addWidget(self.record_page)

    def show_menu(self):
        self.stacked_widget.setCurrentWidget(self.menu_page)

    def show_practice(self):
        self.stacked_widget.setCurrentWidget(self.practice_page)
        self.practice_page.start_camera()

    def show_record(self):
        self.stacked_widget.setCurrentWidget(self.record_page)

class MenuPage(QWidget):
    def __init__(self, main_window):
        super().__init__()
        self.main_window = main_window
        layout = QVBoxLayout(self)

        practice_button = QPushButton("Practice")
        practice_button.clicked.connect(self.main_window.show_practice)
        layout.addWidget(practice_button)

        record_button = QPushButton("Record")
        record_button.clicked.connect(self.main_window.show_record)
        layout.addWidget(record_button)


class PracticePage(QWidget):
    def __init__(self, main_window):
        super().__init__()
        self.main_window = main_window
        layout = QVBoxLayout(self)

        self.video_label = QLabel(self)
        layout.addWidget(self.video_label)

        back_button = QPushButton("Back to Menu")
        back_button.clicked.connect(self.stop_camera)
        back_button.clicked.connect(self.main_window.show_menu)
        layout.addWidget(back_button)

        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose()
        self.cap = None
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_frame)

    def start_camera(self):
        if self.cap is None:
            self.cap = cv2.VideoCapture(1)
            self.timer.start(30)  # Update every 30 ms

    def stop_camera(self):
        if self.cap is not None:
            self.timer.stop()
            self.cap.release()
            self.cap = None

    def update_frame(self):
        ret, frame = self.cap.read()
        if ret:
            display_frame = frame.copy()
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(rgb_frame)

            if results.pose_landmarks:
                landmarks = np.array([[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark])
                
                self.mp_drawing.draw_landmarks(
                    display_frame, 
                    results.pose_landmarks, 
                    self.mp_pose.POSE_CONNECTIONS,
                    self.mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
                    self.mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                )

                model_results = detect_exercise(landmarks)
                max_key = max(model_results, key=model_results.get)

                cv2.putText(display_frame, f"Exercise: {max_key}", (10, 60), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.putText(display_frame, f"Confidence: {model_results[max_key]*10:.1f}%", (10, 90), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            h, w, ch = display_frame.shape
            bytes_per_line = ch * w
            qt_image = QImage(display_frame.data, w, h, bytes_per_line, QImage.Format_RGB888)
            pixmap = QPixmap.fromImage(qt_image)
            self.video_label.setPixmap(pixmap)


class RecordPage(QWidget):
    def __init__(self, main_window):
        super().__init__()
        self.main_window = main_window
        layout = QVBoxLayout(self)

        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("Enter name prefix for saved files")
        layout.addWidget(self.name_input)

        self.duration_input = QLineEdit()
        self.duration_input.setPlaceholderText("Enter recording duration (seconds)")
        layout.addWidget(self.duration_input)

        self.start_button = QPushButton("Start Recording")
        self.start_button.clicked.connect(self.start_recording)
        layout.addWidget(self.start_button)

        self.video_label = QLabel(self)
        layout.addWidget(self.video_label)

        self.time_label = QLabel(self)
        layout.addWidget(self.time_label)

        back_button = QPushButton("Back to Menu")
        back_button.clicked.connect(self.stop_recording)
        back_button.clicked.connect(self.main_window.show_menu)
        layout.addWidget(back_button)

        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose()
        self.cap = None
        self.out = None
        self.pose_data = []
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_frame)
        self.start_time = None
        self.duration = 0

    def start_recording(self):
        name_prefix = self.name_input.text()
        self.duration = int(self.duration_input.text())

        self.cap = cv2.VideoCapture(1)
        frame_width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(self.cap.get(cv2.CAP_PROP_FPS))

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        self.out = cv2.VideoWriter(f'{name_prefix}_movement.mp4', fourcc, fps, (frame_width, frame_height))

        self.pose_data = []
        self.start_time = time.time()
        self.timer.start(30)  # Update every 30 ms

    def stop_recording(self):
        if self.cap is not None:
            self.timer.stop()
            self.cap.release()
            self.cap = None
        if self.out is not None:
            self.out.release()
            self.out = None
        
        if self.pose_data:
            pose_array = np.array(self.pose_data)
            np.save(f'{self.name_input.text()}_movement.npy', pose_array)
            self.append_to_csv(pose_array, self.name_input.text())
            print(f"Pose data saved to '{self.name_input.text()}_movement.npy' with shape {pose_array.shape}")
        
        print(f"Video saved to '{self.name_input.text()}_movement.mp4'")

    def append_to_csv(self, pose_arr, pose_name):
        combined_path = 'pose-logic/data/excercise-recognition/combined_dataset.csv'
        import pandas as pd

        # Read existing data
        existing_data = pd.read_csv(combined_path)
        
        # Get the last pose_id and increment for new entries
        last_pose_id = existing_data['pose_id'].max()
        new_pose_ids = np.arange(last_pose_id + 1, last_pose_id + 1 + len(pose_arr))
        
        # Create a DataFrame from the new pose_arr
        new_data = pd.DataFrame(pose_arr)
        
        # Add pose_id, pose, and duplicate pose_id columns
        new_data.insert(0, 'pose_id', new_pose_ids)
        new_data.insert(1, 'pose', [pose_name] * len(pose_arr))
        new_data.insert(2, 'pose_id_duplicate', new_pose_ids)
        
        # Ensure column names match the existing data (excluding pose_id, pose, and the duplicate pose_id)
        existing_columns = existing_data.columns[3:]
        new_data.columns = ['pose_id', 'pose', 'pose_id.1'] + list(existing_columns)
        
        # Append new data to existing data
        updated_data = pd.concat([existing_data, new_data], ignore_index=True)
        
        # Write the updated data back to the CSV file
        updated_data.to_csv(combined_path, index=False)
        
        print(f"Appended {len(pose_arr)} new entries to {combined_path}")


    def update_frame(self):
        ret, frame = self.cap.read()
        if ret:
            display_frame = frame.copy()
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(rgb_frame)

            if results.pose_landmarks:
                landmarks = np.array([[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark])
                self.pose_data.append(landmarks.flatten())

                self.mp_drawing.draw_landmarks(
                    display_frame, 
                    results.pose_landmarks, 
                    self.mp_pose.POSE_CONNECTIONS,
                    self.mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
                    self.mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                )

            elapsed_time = time.time() - self.start_time
            remaining_time = max(0, self.duration - elapsed_time)

            cv2.putText(frame, f"Time left: {remaining_time:.1f}s", (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(display_frame, f"Time left: {remaining_time:.1f}s", (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            self.out.write(frame)

            h, w, ch = display_frame.shape
            bytes_per_line = ch * w
            qt_image = QImage(display_frame.data, w, h, bytes_per_line, QImage.Format_RGB888)
            pixmap = QPixmap.fromImage(qt_image)
            self.video_label.setPixmap(pixmap)

            self.time_label.setText(f"Time left: {remaining_time:.1f}s")

            if elapsed_time >= self.duration:
                self.stop_recording()
                self.main_window.show_menu()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())