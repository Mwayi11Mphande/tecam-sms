import { api } from "@/lib/api";

export const devDashService = {
  getStats: () => api.get<any>("/dev/stats"),

  getSystemHealth: () => api.get<any>("/dev/health"),
};
