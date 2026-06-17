import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Users, Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SessionCalendar from '@/components/course/SessionCalendar';
import NoticePanel from '@/components/course/NoticePanel';
import ReviewList from '@/components/course/ReviewList';
import BookingModal from '@/components/course/BookingModal';
import CourseCard from '@/components/home/CourseCard';
import Button from '@/components/common/Button';
import { useCourseStore } from '@/store/useCourseStore';
import type { Course, Session } from '@/types';

interface CourseDetailProps {
  courseId?: string;
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-5 h-5',
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-sand-300'
          )}
        />
      ))}
    </div>
  );
}

const difficultyLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

export default function CourseDetail({ courseId = 'c001' }: CourseDetailProps) {
  const { courses, getCourseById, getWorkshopById, isLoaded, loadMockData } = useCourseStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      loadMockData();
    }
  }, [isLoaded, loadMockData]);

  const course = useMemo(() => getCourseById(courseId), [courseId, getCourseById]);
  const workshop = useMemo(() => course ? getWorkshopById(course.workshopId) : undefined, [course, getWorkshopById]);

  const relatedCourses = useMemo(() => {
    if (!course) return [];
    return courses
      .filter((c: Course) => c.category === course.category && c.id !== course.id)
      .slice(0, 4);
  }, [course, courses]);

  if (!course) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-pottery mb-2">课程不存在</h2>
          <p className="text-sand-500">请检查课程ID是否正确</p>
        </div>
      </div>
    );
  }

  const images = course.images?.length ? course.images : ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handcraft%20course&image_size=landscape_16_9'];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBook = () => {
    if (!selectedSession) {
      alert('请先选择上课时间');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedSession(null);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 p-4 md:p-8">
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-sand-100">
                <img
                  src={images[currentImageIndex]}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        'w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
                        currentImageIndex === index
                          ? 'border-clay-500 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <img src={_} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-pottery mb-2">
                  {course.title}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <button className="flex items-center gap-1">
                    {renderStars(course.rating)}
                    <span className="font-semibold text-amber-600">{course.rating}</span>
                    <span className="text-sand-400 text-sm">({course.reviewCount}条评价)</span>
                  </button>
                </div>

                <div className="bg-sand-50 rounded-2xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-clay-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-clay-600" />
                      </div>
                      <div>
                        <p className="text-sm text-sand-500">授课工坊</p>
                        <p className="font-medium text-sand-800">{course.workshopName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-sand-500">工坊地址</p>
                        <p className="font-medium text-sand-800 truncate">{workshop?.address || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-sand-50 rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 text-clay-500 mx-auto mb-1" />
                  <p className="text-xs text-sand-500">课程时长</p>
                  <p className="font-semibold text-sand-800">{Math.floor(course.duration / 60)}小时{course.duration % 60 > 0 ? `${course.duration % 60}分钟` : ''}</p>
                </div>
                <div className="bg-sand-50 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-clay-500 mx-auto mb-1" />
                  <p className="text-xs text-sand-500">人数限制</p>
                  <p className="font-semibold text-sand-800">{course.maxPeople}人</p>
                </div>
                <div className="bg-sand-50 rounded-xl p-3 text-center">
                  <Calendar className="w-5 h-5 text-clay-500 mx-auto mb-1" />
                  <p className="text-xs text-sand-500">适合年龄</p>
                  <p className="font-semibold text-sand-800">{course.ageRange.min}-{course.ageRange.max}岁</p>
                </div>
                <div className="bg-sand-50 rounded-xl p-3 text-center">
                  <Star className="w-5 h-5 text-clay-500 mx-auto mb-1" />
                  <p className="text-xs text-sand-500">难度等级</p>
                  <p className="font-semibold text-sand-800">{difficultyLabels[course.difficulty]}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pottery mb-3">课程介绍</h3>
                <p className="text-sand-600 leading-relaxed">{course.description}</p>
              </div>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-sand-100">
              <div>
                <span className="text-sm text-sand-500">课程价格</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-clay-600">¥{course.price}</span>
                  {course.materialFee && course.materialFee > 0 && (
                    <span className="text-sm text-sand-400">+{course.materialFee}材料费</span>
                  )}
                </div>
                <span className="text-sm text-sand-400 block">/人</span>
              </div>
              <Button size="lg" onClick={handleBook} className="px-8">
                立即报名
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SessionCalendar
            courseId={course.id}
            selectedSession={selectedSession}
            onSelectSession={setSelectedSession}
          />
          <NoticePanel courseId={course.id} />
          <ReviewList courseId={course.id} />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-sand-900 font-serif mb-4">已选信息</h3>
            {selectedSession ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sand-500">课程</span>
                  <span className="font-medium text-sand-800">{course.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-500">日期</span>
                  <span className="font-medium text-sand-800">{selectedSession.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-500">时间</span>
                  <span className="font-medium text-sand-800">{selectedSession.startTime} - {selectedSession.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-500">剩余名额</span>
                  <span className="font-medium text-sand-800">{selectedSession.maxPeople - selectedSession.currentPeople}人</span>
                </div>
                <div className="border-t border-sand-100 pt-3 flex justify-between">
                  <span className="text-sand-500">单价</span>
                  <span className="font-bold text-clay-600">¥{selectedSession.price}</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-sand-400 py-4">请在左侧日历中选择上课时间</p>
            )}
          </div>

          <Button className="w-full" size="lg" onClick={handleBook}>
            {selectedSession ? '立即报名' : '请先选择时间'}
          </Button>
        </div>
      </div>
    </div>

    {relatedCourses.length > 0 && (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-pottery mb-2">相关课程推荐</h2>
              <p className="text-sand-500">你可能也喜欢这些课程</p>
            </div>
            <Button variant="ghost" className="flex items-center gap-2">
              查看更多 <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCourses.map((c: Course) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>
    )}

    <BookingModal
      isOpen={showBookingModal}
      onClose={() => setShowBookingModal(false)}
      courseId={course.id}
      session={selectedSession}
      onSuccess={handleBookingSuccess}
    />
    </div>
  );
}
