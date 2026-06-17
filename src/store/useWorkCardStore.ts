import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkCard } from '@/types';

export interface Filter {
  id: string;
  name: string;
  value: string;
}

export interface Border {
  id: string;
  name: string;
  style: string;
  color: string;
  width: number;
}

interface WorkCardState {
  workCards: WorkCard[];
  currentImage: string | null;
  selectedFilter: Filter | null;
  selectedBorder: Border | null;
  isGenerating: boolean;
  courseName: string;
  workshopName: string;
}

interface WorkCardActions {
  addWorkCard: (cardData: Omit<WorkCard, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'> & Partial<WorkCard>) => WorkCard;
  updateWorkCard: (id: string, updates: Partial<WorkCard>) => void;
  deleteWorkCard: (id: string) => void;
  setCurrentImage: (image: string | null) => void;
  setFilter: (filter: Filter | null) => void;
  setBorder: (border: Border | null) => void;
  setCourseName: (name: string) => void;
  setWorkshopName: (name: string) => void;
  generateWorkCard: () => Promise<string | null>;
  getWorkCardsByUser: (userId: string) => WorkCard[];
  getWorkCardsByCourse: (courseId: string) => WorkCard[];
}

export type WorkCardStore = WorkCardState & WorkCardActions;

export const useWorkCardStore = create<WorkCardStore>()(
  persist(
    (set, get) => ({
      workCards: [],
      currentImage: null,
      selectedFilter: null,
      selectedBorder: null,
      isGenerating: false,
      courseName: '',
      workshopName: '',

      addWorkCard: (cardData) => {
        const newCard: WorkCard = {
          id: crypto.randomUUID(),
          likes: 0,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: false,
          borderStyle: 'none',
          filterStyle: 'none',
          tags: [],
          ...cardData,
        };

        set((state) => ({
          workCards: [...state.workCards, newCard],
        }));

        return newCard;
      },

      updateWorkCard: (id, updates) => {
        set((state) => ({
          workCards: state.workCards.map((card) =>
            card.id === id
              ? { ...card, ...updates, updatedAt: new Date().toISOString() }
              : card
          ),
        }));
      },

      deleteWorkCard: (id) => {
        set((state) => ({
          workCards: state.workCards.filter((card) => card.id !== id),
        }));
      },

      setCurrentImage: (image) => {
        set({ currentImage: image });
      },

      setFilter: (filter) => {
        set({ selectedFilter: filter });
      },

      setBorder: (border) => {
        set({ selectedBorder: border });
      },

      setCourseName: (name) => {
        set({ courseName: name });
      },

      setWorkshopName: (name) => {
        set({ workshopName: name });
      },

      generateWorkCard: async () => {
        const { currentImage, selectedFilter, selectedBorder } = get();

        if (!currentImage) return null;

        set({ isGenerating: true });

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const processedImage = currentImage;

        set({ isGenerating: false });

        return processedImage;
      },

      getWorkCardsByUser: (userId) => {
        return get()
          .workCards.filter((card) => card.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getWorkCardsByCourse: (courseId) => {
        return get()
          .workCards.filter((card) => card.courseId === courseId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
    }),
    {
      name: 'workcard-storage',
    }
  )
);
