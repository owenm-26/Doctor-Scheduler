from exercise_lib import detect_exercise
from pose_estimation import calc_landmarks


def get_excercise_scores(frame):
    landmarks = calc_landmarks(frame)
    exercise_scores = detect_exercise(landmarks)
    return exercise_scores
