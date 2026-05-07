export type ExerciseDetail = {
  id: number,
  exerciseId: number,
  exerciseName: string,
  set: number,
  rep: number
}

export type Workout = {
  id: number,
  workoutName: string,
  exercises: ExerciseDetail[]
}

export type GymProgramDetail = {
  id: number,
  programName: string,
  workouts: Workout[]
}

export type Exercise = {
  id: number,
  exerciseName: string
  pictureUrl: string | null
}

export type NewExerciseResponse = {
  id: number,
  exerciseId: number,
  set: number,
  rep: number
}

export type UpdatedWorkoutExercise = {
  id: number,
  set: number,
  rep: number
}

export type AddWorkoutExerciseDto = {
  exerciseId: number,
  rep: number,
  set: number
}

export type UpdateWorkoutExerciseDto = {
  set?: number;
  rep?: number;
}

export type ExerciseInput = {
  exerciseId: string;
  set: string;
  rep: string;
};

export type WorkoutInput = {
  workoutName: string;
  exercises: ExerciseInput[];
};

export type CreateWorkoutExerciseDto = {
  exerciseId: number;
  set: number;
  rep: number;
}

export type CreateWorkoutDto = {
  workoutName: string;
  exercises: CreateWorkoutExerciseDto[];
}

export type CreateGymProgramDto = {
  programName: string;
  workouts: CreateWorkoutDto[];
}

export type GymProgram = {
  id: number,
  programName: string
}