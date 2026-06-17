import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking, BookingStatus } from '@/types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
}

interface BookingActions {
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'> & Partial<Booking>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getBookingsByCourse: (courseId: string) => Booking[];
  checkIn: (bookingId: string) => boolean;
  setCurrentBooking: (booking: Booking | null) => void;
}

export type BookingStore = BookingState & BookingActions;

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],
      currentBooking: null,

      addBooking: (bookingData) => {
        const newBooking: Booking = {
          id: crypto.randomUUID(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...bookingData,
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking],
          currentBooking: newBooking,
        }));

        return newBooking;
      },

      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id
              ? { ...booking, ...updates }
              : booking
          ),
          currentBooking:
            state.currentBooking?.id === id
              ? { ...state.currentBooking, ...updates }
              : state.currentBooking,
        }));
      },

      getBookingsByUser: (userId) => {
        return get()
          .bookings.filter((booking) => booking.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getBookingsByCourse: (courseId) => {
        return get()
          .bookings.filter((booking) => booking.courseId === courseId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      checkIn: (bookingId) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return false;

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: 'checked-in',
                  checkedInAt: new Date().toISOString(),
                }
              : b
          ),
        }));
        return true;
      },

      setCurrentBooking: (booking) => {
        set({ currentBooking: booking });
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);
