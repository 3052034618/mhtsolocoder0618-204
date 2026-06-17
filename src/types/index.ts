export type CourseCategory = 'pottery' | 'leather' | 'floral' | 'candle' | 'other';

export type UserRole = 'student' | 'workshop' | 'enterprise';

export type BookingStatus = 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled' | 'checked-in' | 'refunded';

export type TeamBookingStatus = 'pending' | 'paid' | 'confirmed' | 'completed';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Workshop {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  gallery: string[];
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Course {
  id: string;
  workshopId: string;
  workshopName: string;
  title: string;
  category: CourseCategory;
  description: string;
  images: string[];
  duration: number;
  maxPeople: number;
  price: number;
  materialIncluded: boolean;
  materialFee?: number;
  ageRange: {
    min: number;
    max: number;
  };
  difficulty: DifficultyLevel;
  rating: number;
  reviewCount: number;
  isSeries: boolean;
  seriesId?: string;
  notice: string[];
  createdAt: string;
}

export interface Session {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPeople: number;
  currentPeople: number;
  price: number;
  isTeamBooking: boolean;
  teamBookingId?: string;
}

export interface Series {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  workshopId: string;
  workshopName: string;
  courseIds: string[];
  courses: Array<{
    id: string;
    title: string;
    duration: number;
    description: string;
    image: string;
  }>;
  totalDuration: number;
  originalPrice: number;
  seriesPrice: number;
  discount: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  level: string;
  notice: string[];
  createdAt: string;
}

export interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
  role: UserRole;
  workshopId?: string;
  enterpriseName?: string;
}

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  sessionId: string;
  peopleCount: number;
  totalPrice: number;
  status: BookingStatus;
  paidAt?: string;
  checkedInAt?: string;
  createdAt: string;
  attendeeNames: string[];
  courseName: string;
  sessionDate?: string;
  sessionTime?: string;
  notes?: string;
  userName?: string;
  userPhone?: string;
  workshopId?: string;
  workshopName?: string;
}

export interface WorkCard {
  id: string;
  userId: string;
  courseId: string;
  bookingId: string;
  originalImage: string;
  filteredImage?: string;
  processedImage?: string;
  borderStyle: string;
  filterStyle: string;
  courseName: string;
  workshopName: string;
  createdAt: string;
  isPublic: boolean;
  title: string;
  description?: string;
  filterId?: string;
  borderId?: string;
  tags: string[];
  workshopId?: string;
  likes: number;
  views: number;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  courseId: string;
  workshopId: string;
  rating: number;
  content: string;
  images: string[];
  workCardIds: string[];
  createdAt: string;
  isFeatured: boolean;
}

export interface MaterialPackageItem {
  name: string;
  quantity: number;
  description: string;
}

export interface TeamBooking {
  id: string;
  userId: string;
  enterpriseName: string;
  contactName: string;
  contactPhone: string;
  courseId: string;
  courseName: string;
  sessionId: string;
  peopleCount: number;
  totalPrice: number;
  status: TeamBookingStatus;
  requirements: string;
  materialPackageConfig: MaterialPackageItem[];
  workshopId: string;
  workshopName: string;
  createdAt: string;
}
