import { create } from "zustand";
import { Staff } from "@/lib/api/types";
import { getStaff } from "@/services/staff/staff.api";

interface StaffState {
  staff: Staff[];
  loading: boolean;
  error: string | null;

  fetchStaff: () => Promise<void>;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [],
  loading: false,
  error: null,

  fetchStaff: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getStaff();
      set({ staff: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch staff",
        loading: false,
      });
    }
  },
}));