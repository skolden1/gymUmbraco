import type { AddWorkoutExerciseDto, CreateGymProgramDto, Exercise, GymProgram, GymProgramDetail, NewExerciseResponse, UpdatedWorkoutExercise, UpdateWorkoutExerciseDto } from "../types/gymProgramTypes";

const BASE_URL = "https://localhost:44388/api/GymProgram";

export const getGymProgramDetail = async (id: number): Promise<GymProgramDetail> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
  })
  if(!res.ok){
    if(res.status === 401){
      throw new Error("UNAUTHORIZED");
    }
    const text = await res.text();
    throw new Error(text || "Something went wrong");
  }

  const data = await res.json() as GymProgramDetail;
  return data;
}

export const getExercises = async (): Promise<Exercise[]> => {
  const res = await fetch(`${BASE_URL}/exercises`, {
      method: "GET",
      headers: {"Content-Type" : "application/json"}
  });
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "failed to fetch exercises")
  }
  const data = await res.json() as Exercise[];
  return data;
}

export const editProgramName = async (id: number, newName: string):Promise<void> => {
  const res = await fetch(`${BASE_URL}/program/${id}`, {
    method: "PUT",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
    body: JSON.stringify({gymProgramName: newName})
  });
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "failed to change name of the gym project")
  }
}

export const deleteProgram = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
  });
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "failed to delete program");
  }
}

export const deleteWorkout = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/workout/${id}`, {
    method: "DELETE",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "Failed to delete workout");
  }
}

export const deleteExercise = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/exercise/${id}`, {
    method: "DELETE",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "Failed to delete exercise");
  }
}

export const addExercise = async (id: number, dto: AddWorkoutExerciseDto): Promise<NewExerciseResponse> => {
  const res = await fetch(`${BASE_URL}/workout/${id}/exercise`,{
    method: "POST",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
    body: JSON.stringify(dto)
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "Failed to add exercise");
  }
  return res.json();
}

export const editSetNRep = async (id: number, dto: UpdateWorkoutExerciseDto): Promise<UpdatedWorkoutExercise> => {
  const res = await fetch(`${BASE_URL}/exercise/${id}`, {
    method: "PUT",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
    body: JSON.stringify(dto)
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "Failed to edit set/rep");
  }
  return res.json();
}

export const setEditWorkoutName = async (id: number, workoutName: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/workout/${id}`, {
    method: "PUT",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
    body: JSON.stringify({workoutName})
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "failed to edit workoutname");
  }
}

export const fetchExercises = async (): Promise<Exercise[]> => {
  const res = await fetch(`${BASE_URL}/exercises`, {
    method: "GET",
    headers: {"Content-Type" : "application/json"}
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "failed to fetch exercises")
  }
  const data: Exercise[] = await res.json();
  return data;
}

export const fetchCreateGymProgram = async (dto: CreateGymProgramDto): Promise<void> => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {"Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
    body: JSON.stringify(dto)
  })
  if (!res.ok) {
    const text = await res.text();
    if(res.status === 401){
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(text || "Failed to create gymprogram");
  }
}

export const fetchGymProgramDetail = async (id: number): Promise<GymProgramDetail> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
  })
  if(res.status === 401){
    throw new Error("UNAUTHORIZED")
  }
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "Failed to get program details");
  }
  const data: GymProgramDetail = await res.json();
  return data;

}

export const fetchGymPrograms = async (): Promise<GymProgram[]> => {
  const res = await fetch(`${BASE_URL}/myPrograms`, {
    method: "GET",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
  })
  if(res.status === 401){
    throw new Error("UNAUTHORIZED")
  }
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "Failed to get program details");
  }
  const data: GymProgram[] = await res.json();
  return data;
}