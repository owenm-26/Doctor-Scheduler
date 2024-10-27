# Easy-PT
(Easy Physical Therapy)

### See it
Frontend Deployment: https://streching-pal.vercel.app/

DevPost Readme: https://devpost.com/software/ez-pt?ref_content=my-projects-tab&ref_feature=my_projects 

### Research & Dataset Citations

- https://www.kaggle.com/datasets/muhannadtuameh/exercise-recognition


### Class Layout & Architecture

Landmarks - pose detection outputs by movenet
Landmark embeddings - created using the raw landmarks that're esentially normalized landmarks for image transformation invariance
Pose - each landmark embedding should correspond to a pose like sitting, standing, squatting, etc.

Possible Tables:

Pose
- pose name

Landmark
- ref pose

Landmark embedding
- ref landmark
- ref pose

Possible Actions:

- search for top n similar embeddings
