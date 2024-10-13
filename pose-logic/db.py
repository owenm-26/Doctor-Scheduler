# import sqlite3
# import sqlite_vec

# db = sqlite3.connect(":memory:")
# db.enable_load_extension(True)
# sqlite_vec.load(db)
# db.enable_load_extension(False)

# vec_version, = db.execute("select vec_version()").fetchone()
# print(f"vec_version={vec_version}")

# import numpy as np
# embedding = np.array([0.1, 0.2, 0.3, 0.4])
# result = db.execute(
#     "SELECT vec_length(?)", [embedding.astype(np.float32)]
# ) # 4
# print(result.fetchall())



import sqlite3
import numpy as np

class PoseLandmarkDB:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.cursor.execute("SELECT load_extension('sqlite-vec')")

    def add_pose(self, pose_name):
        self.cursor.execute("INSERT INTO Pose (name) VALUES (?)", (pose_name,))
        self.conn.commit()
        return self.cursor.lastrowid

    def add_landmark(self, pose_id, x, y, z):
        self.cursor.execute("INSERT INTO Landmark (pose_id, x, y, z) VALUES (?, ?, ?, ?)",
                            (pose_id, x, y, z))
        self.conn.commit()
        return self.cursor.lastrowid

    def add_landmark_embedding(self, landmark_id, pose_id, embedding):
        embedding_str = ','.join(map(str, embedding))
        self.cursor.execute("INSERT INTO LandmarkEmbedding (landmark_id, pose_id, embedding) VALUES (?, ?, vector(?))",
                            (landmark_id, pose_id, embedding_str))
        self.conn.commit()
        return self.cursor.lastrowid

    def search_similar_embeddings(self, query_embedding, top_n=5):
        query_str = ','.join(map(str, query_embedding))
        self.cursor.execute("""
            SELECT le.id, p.name, euclidean_distance(le.embedding, vector(?)) as distance
            FROM LandmarkEmbedding le
            JOIN Pose p ON le.pose_id = p.id
            ORDER BY distance ASC
            LIMIT ?
        """, (query_str, top_n))
        return self.cursor.fetchall()

    def close(self):
        self.conn.close()

# Example usage
if __name__ == "__main__":
    db = PoseLandmarkDB("pose_landmarks.db")

    # Add a pose
    pose_id = db.add_pose("standing")

    # Add a landmark
    landmark_id = db.add_landmark(pose_id, 0.5, 0.5, 0.0)

    # Add a landmark embedding (example with random 128-dimensional vector)
    embedding = np.random.rand(128)
    db.add_landmark_embedding(landmark_id, pose_id, embedding)

    # Search for similar embeddings
    query_embedding = np.random.rand(128)
    results = db.search_similar_embeddings(query_embedding, top_n=3)
    print("Similar embeddings:")
    for result in results:
        print(f"ID: {result[0]}, Pose: {result[1]}, Distance: {result[2]}")

    db.close()