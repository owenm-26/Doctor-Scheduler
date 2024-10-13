import numpy as np
from posecore.classifier import PoseClassifier
from posecore.embedder import FullBodyPoseEmbedder

models = {}

def get_embedder():
    if "embedder" not in models:
        models["embedder"] = FullBodyPoseEmbedder()
    return models["embedder"]


def get_classifier(embedder):
    if "classifier" not in models:
        models["classifier"] = PoseClassifier(
            "./pose-logic/data/excercise-recognition",
            embedder,
        )
    return models["classifier"]


def detect_exercise(landmarks):
    pose_embedder = get_embedder()
    classifier = get_classifier(pose_embedder)
    results = classifier(pose_landmarks=landmarks)
    return results
