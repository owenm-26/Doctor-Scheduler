export interface TrainerData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  biography: string | null;
  date_joined: Date;
  picture: string | null;
}

export interface TrainerCardParams {
  data: TrainerData;
  selected: number;
  key: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

export interface SaveTrainerParams {
  userId: number;
  trainerId: number;
}

export interface PoseGrade {
  name: string;
  grade: number;
}

export interface CustomDropdownParams {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}
export interface VideoStreamParams {
  selectedStretch: string;
}

export interface MovementData {
  [movementName: string]: number;
  // up?: number;
  // down?: number;
  // For movements like "clap" where there's no up/down, just a single count.
}