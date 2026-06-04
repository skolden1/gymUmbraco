
//för att matcha backends saveset dto typ
export type SaveWorkoutSetDto = {
  workoutId: number;
  exerciseId: number;
  setNumber: number;
  repsDone: number;
  weight: number;
}

export type WorkoutSessionExercise = {
  id: number;
  workoutSessionId: number;
  exerciseId: number;
  setNumber: number;
  repsDone: number;
  weight: number;
}

export type PreviousWorkoutSet = {
  exerciseId: number;
  setNumber: number;
  repsDone: number;
  weight: number;
}