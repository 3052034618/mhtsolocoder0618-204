import { useState, useEffect, useMemo } from 'react';
import { Star, MapPin, Phone, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import CourseCard from '@/components/home/CourseCard';
import ReviewList from '@/components/course/ReviewList';
import Button from '@/components/common/Button';
import { useCourseStore } from '@/store/useCourseStore';
import type { Course, Workshop, WorkCard } from '@/types';

interface WorkshopDetailProps {
  workshopId?: string;
}

type TabType = 'courses' | 'reviews' | 'works';

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-sand-300'
          )}
        />
      ))}
    </div>
  );
}

const TABS: { id: TabType; label: string }[] = [
  { id: 'courses', label: '全部课程' },
  { id: 'reviews', label: '学员评价' },
  { id: 'works', label: '作品展示' },
];

const mockWorkCards: WorkCard[] = [
  {
    id: 'wc001',
    userId: 'u001',
    courseId: 'c001',
    bookingId: 'b001',
    originalImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=精美手工陶瓷茶杯，釉色温润，放在木质桌面上&image_size=square',
    borderStyle: 'none',
    filterStyle: 'none',
    courseName: '陶艺入门体验课',
    workshopName: '陶然居陶艺工坊',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    isPublic: true,
    title: '温润陶瓷茶杯',
    tags: ['陶艺', '茶杯'],
    likes: 24,
    views: 156,
  },
  {
    id: 'wc002',
    userId: 'u002',
    courseId: 'c002',
    bookingId: 'b002',
    originalImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=手工拉坯陶瓷花瓶，造型优雅，放在展架上&image_size=square',
    borderStyle: 'none',
    filterStyle: 'none',
    courseName: '拉坯进阶课程',
    workshopName: '陶然居陶艺工坊',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    isPublic: true,
    title: '优雅陶瓷花瓶',
    tags: ['陶艺', '花瓶'],
    likes: 42,
    views: 289,
  },
  {
    id: 'wc003',
    userId: 'u003',
    courseId: 'c001',
    bookingId: 'b003',
    originalImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=可爱的手工陶艺小摆件，卡通造型，色彩丰富&image_size=square',
    borderStyle: 'none',
    filterStyle: 'none',
    courseName: '陶艺入门体验课',
    workshopName: '陶然居陶艺工坊',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    isPublic: true,
    title: '可爱陶艺小摆件',
    tags: ['陶艺', '摆件'],
    likes: 18,
    views: 98,
  },
  {
    id: 'wc004',
    userId: 'u004',
    courseId: 'c002',
    bookingId: 'b004',
    originalImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=手工陶瓷碗套装，简约设计，实用性强&image_size=square',
    borderStyle: 'none',
    filterStyle: 'none',
    courseName: '拉坯进阶课程',
    workshopName: '陶然居陶艺工坊',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    isPublic: true,
    title: '简约陶瓷碗套装',
    tags: ['陶艺', '餐具'],
    likes: 31,
    views: 201,
  },
  {
    id: 'wc005',
    userId: 'u005',
    courseId: 'c001',
    bookingId: 'b005',
    originalImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=手工陶艺茶叶罐，密封性好，造型古朴&image_size=square',
    borderStyle: 'none',
    filterStyle: 'none',
    courseName: '陶艺入门体验课',
    workshopName: '陶然居陶艺工坊',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
    isPublic: true,
    title: '古朴陶艺茶叶罐',
    tags: ['陶艺', '茶叶罐'],
    likes: 27,
    views: 167,
  },
  {
    id: 'wc006',
    userId: 'u006',
    courseId: 'c002',
    bookingId: 'b006',
    originalImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=手工陶瓷餐盘，手绘花纹，艺术感强&image_size=square',
    borderStyle: 'none',
    filterStyle: 'none',
    courseName: '拉坯进阶课程',
    workshopName: '陶然居陶艺工坊',
    createdAt: '2024-01-10T13:20:00Z',
    updatedAt: '2024-01-10T13:20:00Z',
    isPublic: true,
    title: '手绘陶瓷餐盘',
    tags: ['陶艺', '餐盘'],
    likes: 35,
    views: 243,
  },
];

export default function WorkshopDetail({ workshopId = 'w001' }: WorkshopDetailProps) {
  const { workshops, courses, getWorkshopById, isLoaded, loadMockData } = useCourseStore();
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const [isFollowed, setIsFollowed] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      loadMockData();
    }
  }, [isLoaded, loadMockData]);

  const workshop = useMemo(() => getWorkshopById(workshopId), [workshopId, getWorkshopById]);

  const workshopCourses = useMemo(() => {
    return courses.filter((c: Course) => c.workshopId === workshopId);
  }, [courses, workshopId]);

  if (!workshop) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-pottery mb-2">工坊不存在</h2>
          <p className="text-sand-500">请检查工坊ID是否正确</p>
        </div>
      </div>
    );
  }

  const galleryImages = workshop.gallery?.length ? workshop.gallery : [workshop.coverImage];

  const handlePrevImage = () => {
    setGalleryIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setGalleryIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const openGalleryModal = (index: number) => {
    setGalleryIndex(index);
    setShowGalleryModal(true);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={workshop.coverImage}
          alt={workshop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{workshop.name}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    {renderStars(workshop.rating)}
                    <span className="font-semibold">{workshop.rating}</span>
                    <span className="text-white/70">({workshop.reviewCount}条评价)</span>
                  </div>
                </div>
              </div>
              <Button
                variant={isFollowed ? 'secondary' : 'primary'}
                onClick={() => setIsFollowed(!isFollowed)}
                className="flex items-center gap-2"
              >
                <Heart className={cn('w-4 h-4', isFollowed && 'fill-red-500 text-red-500')} />
                {isFollowed ? '已关注' : '关注'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-soft p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-clay-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-clay-600" />
              </div>
              <div>
                <p className="text-sm text-sand-500 mb-1">工坊地址</p>
                <p className="font-medium text-sand-800">{workshop.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-sand-500 mb-1">联系电话</p>
                <p className="font-medium text-sand-800">{workshop.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-sand-500 mb-1">工坊评分</p>
                <div className="flex items-center gap-2">
                  {renderStars(workshop.rating)}
                  <span className="font-semibold text-amber-600">{workshop.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-6 mb-8">
          <h2 className="text-xl font-semibold text-pottery mb-4">工坊介绍</h2>
          <p className="text-sand-600 leading-relaxed">{workshop.description}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-6 mb-8">
          <h2 className="text-xl font-semibold text-pottery mb-4">环境照片</h2>
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-sand-100">
            <img
              src={galleryImages[galleryIndex]}
              alt="工坊环境"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openGalleryModal(galleryIndex)}
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-sand-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-sand-700" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => openGalleryModal(index)}
                className={cn(
                  'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                  galleryIndex === index
                    ? 'border-clay-500 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft overflow-hidden mb-8">
          <div className="flex border-b border-sand-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 py-4 px-6 text-center font-medium transition-all',
                  activeTab === tab.id
                    ? 'text-clay-600 border-b-2 border-clay-500 bg-clay-50/50'
                    : 'text-sand-500 hover:text-sand-700 hover:bg-sand-50'
                )}
              >
                {tab.label}
                {tab.id === 'courses' && <span className="ml-1 text-xs">({workshopCourses.length})</span>}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                {workshopCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workshopCourses.map((course: Course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-sand-400">
                    暂无课程
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <ReviewList pageSize={5} />
              </div>
            )}

            {activeTab === 'works' && (
              <div>
                {mockWorkCards.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {mockWorkCards.map((work) => (
                      <div
                        key={work.id}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                        onClick={() => setPreviewImage(work.originalImage)}
                      >
                        <img
                          src={work.originalImage}
                          alt="学员作品"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white truncate">{work.courseName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-sand-400">
                    暂无作品展示
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setShowGalleryModal(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <img
            src={galleryImages[galleryIndex]}
            alt="环境照片"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setGalleryIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  galleryIndex === index ? 'bg-white w-6' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="作品预览"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
