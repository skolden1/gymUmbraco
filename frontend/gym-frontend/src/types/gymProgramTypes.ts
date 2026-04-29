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