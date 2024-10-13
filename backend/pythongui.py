import sys
import cv2
import mediapipe as mp
import numpy as np
import time
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QStackedWidget
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QImage, QPixmap
from PyQt5.QtWidgets import QLabel

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

        self.stacked_widget.addWidget(self.menu_page)
        self.stacked_widget.addWidget(self.practice_page)

    def show_menu(self):
        self.stacked_widget.setCurrentWidget(self.menu_page)

    def show_practice(self):
        self.stacked_widget.setCurrentWidget(self.practice_page)
        self.practice_page.start_camera()

class MenuPage(QWidget):
    def __init__(self, main_window):
        super().__init__()
        self.main_window = main_window
        layout = QVBoxLayout(self)

        practice_button = QPushButton("Practice")
        practice_button.clicked.connect(self.main_window.show_practice)
        layout.addWidget(practice_button)

        # Add more buttons for other pages as needed

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

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())