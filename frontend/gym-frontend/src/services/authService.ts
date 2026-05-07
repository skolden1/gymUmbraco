import type { LoginDto, LoginResponse, RegisterDto } from "../types/authTypes";

const BASE_URL = "https://localhost:44388/api/userauth";

export const loginUser = async (dto: LoginDto): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(dto)
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "Failed to login user");
  }
  const data: LoginResponse = await res.json();
  return data;
}

export const registerUser = async (dto: RegisterDto): Promise<void> => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(dto)
  })
  if(!res.ok){
    const text = await res.text();
    throw new Error(text || "failed to register user");
  }
}