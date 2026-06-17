import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TeamBooking, MaterialPackageItem } from '@/types';

interface ConfirmScheduleData {
  confirmedDate: string;
  confirmedStartTime: string;
  confirmedEndTime: string;
  teacherNotes?: string;
}

interface TeamBookingStore {
  teamBookings: TeamBooking[];
  currentTeamBooking: TeamBooking | null;
  addTeamBooking: (data: Omit<TeamBooking, 'id' | 'createdAt' | 'status'>) => TeamBooking;
  updateTeamBooking: (id: string, updates: Partial<TeamBooking>) => void;
  updateStatus: (id: string, status: TeamBooking['status']) => void;
  updateMaterialPackage: (id: string, materials: MaterialPackageItem[]) => void;
  confirmSchedule: (id: string, scheduleData: ConfirmScheduleData) => void;
  getTeamBookings: () => TeamBooking[];
  getTeamBookingById: (id: string) => TeamBooking | undefined;
  getConfirmedTeamBookingsByCourse: (courseId: string) => TeamBooking[];
  setCurrentTeamBooking: (booking: TeamBooking | null) => void;
}

export const useTeamBookingStore = create<TeamBookingStore>()(
  persist(
    (set, get) => ({
      teamBookings: [],
      currentTeamBooking: null,

      addTeamBooking: (data) => {
        const newBooking: TeamBooking = {
          id: crypto.randomUUID(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...data,
        };

        set((state) => ({
          teamBookings: [...state.teamBookings, newBooking],
          currentTeamBooking: newBooking,
        }));

        return newBooking;
      },

      updateTeamBooking: (id, updates) => {
        set((state) => ({
          teamBookings: state.teamBookings.map((booking) =>
            booking.id === id ? { ...booking, ...updates } : booking
          ),
          currentTeamBooking:
            state.currentTeamBooking?.id === id
              ? { ...state.currentTeamBooking, ...updates }
              : state.currentTeamBooking,
        }));
      },

      updateStatus: (id, status) => {
        set((state) => ({
          teamBookings: state.teamBookings.map((booking) =>
            booking.id === id ? { ...booking, status } : booking
          ),
        }));
      },

      updateMaterialPackage: (id, materials) => {
        set((state) => ({
          teamBookings: state.teamBookings.map((booking) =>
            booking.id === id
              ? { ...booking, materialPackageConfig: materials }
              : booking
          ),
        }));
      },

      confirmSchedule: (id, scheduleData) => {
        set((state) => ({
          teamBookings: state.teamBookings.map((booking) =>
            booking.id === id
              ? { ...booking, ...scheduleData, status: 'confirmed' as const }
              : booking
          ),
        }));
      },

      getTeamBookings: () => {
        return get().teamBookings.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getTeamBookingById: (id) => {
        return get().teamBookings.find((booking) => booking.id === id);
      },

      getConfirmedTeamBookingsByCourse: (courseId) => {
        return get().teamBookings.filter(
          (b) => b.courseId === courseId && (b.status === 'confirmed' || b.status === 'completed') && b.confirmedDate
        );
      },

      setCurrentTeamBooking: (booking) => {
        set({ currentTeamBooking: booking });
      },
    }),
    {
      name: 'team-booking-storage',
    }
  )
);
