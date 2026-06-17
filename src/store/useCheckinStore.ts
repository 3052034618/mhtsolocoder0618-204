import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CheckinRecord {
  id: string;
  bookingId: string;
  sessionId: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

interface CheckinStore {
  checkinRecords: CheckinRecord[];
  checkIn: (bookingId: string, sessionId: string) => boolean;
  cancelCheckIn: (bookingId: string, sessionId: string) => boolean;
  isCheckedIn: (bookingId: string, sessionId: string) => boolean;
  getCheckinCount: (sessionId: string) => number;
  getCheckedInBookings: (sessionId: string) => string[];
}

export const useCheckinStore = create<CheckinStore>()(
  persist(
    (set, get) => ({
      checkinRecords: [],

      checkIn: (bookingId, sessionId) => {
        const existing = get().checkinRecords.find(
          (r) => r.bookingId === bookingId && r.sessionId === sessionId
        );

        if (existing?.checkedIn) {
          return false;
        }

        if (existing) {
          set((state) => ({
            checkinRecords: state.checkinRecords.map((r) =>
              r.bookingId === bookingId && r.sessionId === sessionId
                ? { ...r, checkedIn: true, checkedInAt: new Date().toISOString() }
                : r
            ),
          }));
        } else {
          set((state) => ({
            checkinRecords: [
              ...state.checkinRecords,
              {
                id: crypto.randomUUID(),
                bookingId,
                sessionId,
                checkedIn: true,
                checkedInAt: new Date().toISOString(),
              },
            ],
          }));
        }

        return true;
      },

      cancelCheckIn: (bookingId, sessionId) => {
        const existing = get().checkinRecords.find(
          (r) => r.bookingId === bookingId && r.sessionId === sessionId
        );

        if (!existing?.checkedIn) {
          return false;
        }

        set((state) => ({
          checkinRecords: state.checkinRecords.map((r) =>
            r.bookingId === bookingId && r.sessionId === sessionId
              ? { ...r, checkedIn: false, checkedInAt: undefined }
              : r
          ),
        }));

        return true;
      },

      isCheckedIn: (bookingId, sessionId) => {
        const record = get().checkinRecords.find(
          (r) => r.bookingId === bookingId && r.sessionId === sessionId
        );
        return record?.checkedIn || false;
      },

      getCheckinCount: (sessionId) => {
        return get().checkinRecords.filter(
          (r) => r.sessionId === sessionId && r.checkedIn
        ).length;
      },

      getCheckedInBookings: (sessionId) => {
        return get()
          .checkinRecords.filter((r) => r.sessionId === sessionId && r.checkedIn)
          .map((r) => r.bookingId);
      },
    }),
    {
      name: 'checkin-storage',
    }
  )
);
