import { get, post } from "@/lib/api/requests";
import { Staff } from "@/lib/api/types";

export const getStaff = async (): Promise<Staff[]> => {
  const response = await get("/users/get-staff");
  console.log("Staff response:", response);
  return response;
};

export const createStaff = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const response = await post("/users/create-cashier", data);

  console.log("Create staff response:", response);

  return response;
};