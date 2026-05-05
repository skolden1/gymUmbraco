import type { Exercise, GymProgramDetail } from "../types/gymProgramTypes";

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
  const res = await fetch(`https://localhost:44388/api/GymProgram/${id}`, {
    method: "DELETE",
    headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
  });
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "failed to delete program");
  }
}