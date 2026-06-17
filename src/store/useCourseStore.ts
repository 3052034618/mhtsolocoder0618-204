import { create } from 'zustand';
import type { Course, Workshop, Session, Series, Review } from '@/types';

import mockCourses from '@/data/mock/courses.json';
import mockWorkshops from '@/data/mock/workshops.json';
import mockSessions from '@/data/mock/sessions.json';
import mockSeries from '@/data/mock/series.json';
import mockReviews from '@/data/mock/reviews.json';

interface CourseState {
  courses: Course[];
  workshops: Workshop[];
  sessions: Session[];
  series: Series[];
  reviews: Review[];
  isLoaded: boolean;
}

interface CourseActions {
  loadMockData: () => void;
  getCourseById: (id: string) => Course | undefined;
  getWorkshopById: (id: string) => Workshop | undefined;
  getSessionsByCourse: (courseId: string) => Session[];
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'isFeatured'>) => Review;
  featuredReviews: (courseId?: string) => Review[];
  getFeaturedCourses: () => Course[];
  getCoursesByCategory: (category: string) => Course[];
  getWorkshopsByCourse: (courseId: string) => Workshop[];
}

export type CourseStore = CourseState & CourseActions;

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  workshops: [],
  sessions: [],
  series: [],
  reviews: [],
  isLoaded: false,

  loadMockData: () => {
    set({
      courses: mockCourses as Course[],
      workshops: mockWorkshops as Workshop[],
      sessions: mockSessions as Session[],
      series: mockSeries as Series[],
      reviews: mockReviews as Review[],
      isLoaded: true,
    });
  },

  getCourseById: (id) => {
    return get().courses.find((course) => course.id === id);
  },

  getWorkshopById: (id) => {
    return get().workshops.find((workshop) => workshop.id === id);
  },

  getSessionsByCourse: (courseId) => {
    return get()
      .sessions.filter((session) => session.courseId === courseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  addReview: (reviewData) => {
    const newReview: Review = {
      id: crypto.randomUUID(),
      isFeatured: false,
      createdAt: new Date().toISOString(),
      images: [],
      workCardIds: [],
      ...reviewData,
    };

    set((state) => ({
      reviews: [...state.reviews, newReview],
    }));

    return newReview;
  },

  featuredReviews: (courseId) => {
    let reviews = get().reviews.filter((review) => review.isFeatured);
    if (courseId) {
      reviews = reviews.filter((review) => review.courseId === courseId);
    }
    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getFeaturedCourses: () => {
    return get().courses.filter((course) => course.rating >= 4.8);
  },

  getCoursesByCategory: (category) => {
    return get().courses.filter((course) => course.category === category);
  },

  getWorkshopsByCourse: (courseId) => {
    return get()
      .workshops.filter((workshop) => workshop.id === courseId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
}));
