import { get } from "@/lib/api/requests";
import { Staff } from "@/lib/api/types";

export const getStaff = async (): Promise<Staff[]> => {
  const response = await get("/users/get-staff");
  console.log("Staff response:", response);
  return response;
};