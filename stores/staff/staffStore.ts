import { create } from "zustand";
import { Staff } from "@/lib/api/types";
import { getStaff, createStaff as createStaffAPI } from "@/services/staff/staff.api";

interface StaffState {
  staff: Staff[];
  loading: boolean;
  error: string | null;

  fetchStaff: () => Promise<void>;
  createStaff: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staff: [],
  loading: false,
  error: null,

  fetchStaff: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getStaff();
      set({ staff: data });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch staff",
      });
    } finally {
      set({ loading: false });
    }
  },

  createStaff: async (data) => {
    set({ loading: true, error: null });

    try {
      await createStaffAPI(data);

      // Refetch updated staff list
      await get().fetchStaff();
    } catch (err: any) {
      set({
        error: err?.message || "Failed to create staff",
      });
    } finally {
      set({ loading: false });
    }
  },
}));