import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  userRole: UserRole;
}

interface UserActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'role'> & { password: string }) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isLoggedIn: false,
      userRole: 'guest',

      login: async (email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (email && password) {
          const mockUser: User = {
            id: crypto.randomUUID(),
            name: email.split('@')[0],
            email,
            role: 'student',
            createdAt: new Date().toISOString(),
          };

          set({
            currentUser: mockUser,
            isLoggedIn: true,
            userRole: mockUser.role,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          currentUser: null,
          isLoggedIn: false,
          userRole: 'guest',
        });
      },

      register: async (userData) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (userData.email && userData.password) {
          const newUser: User = {
            id: crypto.randomUUID(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            avatar: userData.avatar,
            role: 'student',
            createdAt: new Date().toISOString(),
          };

          set({
            currentUser: newUser,
            isLoggedIn: true,
            userRole: newUser.role,
          });
          return true;
        }
        return false;
      },

      updateUser: (updates) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updatedUser = { ...state.currentUser, ...updates };
          return {
            currentUser: updatedUser,
            userRole: updatedUser.role,
          };
        });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
