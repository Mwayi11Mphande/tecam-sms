import { post, get } from "@/lib/api/requests";
import { LoginResponse, AuthUser } from "@/lib/api/types";

// -----------------------------
// LOGIN
// -----------------------------
export const login = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  console.log('Login request with data:', data);
  const response = await post("/auth/login", data);
  console.log('Login response:', response);
  return response;
};

// -----------------------------
// GET CURRENT USER
// -----------------------------
export const getMe = async (): Promise<AuthUser> => {
  return get("/auth/me");
};

// -----------------------------
// LOGOUT
// -----------------------------
export const logout = async (): Promise<void> => {
  return post("/auth/logout");
};