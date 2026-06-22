import api from "./api";
import type { DashboardData } from "@/types/Dashboard";

export const dashboardService = {
  getDashboard: async (): Promise<{ data: DashboardData }> => {
    return api.get("/dashboard");
  },
};
