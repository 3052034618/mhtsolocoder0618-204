import { Star, Clock, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCourseStore } from '@/store/useCourseStore';
import type { Course, Session } from '@/types';

interface CourseCardProps {
  course: Course;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  pottery: { label: '陶艺', color: 'bg-amber-100 text-amber-700' },
  leather: { label: '皮具', color: 'bg-orange-100 text-orange-700' },
  floral: { label: '花艺', color: 'bg-pink-100 text-pink-700' },
  candle: { label: '蜡烛', color: 'bg-yellow-100 text-yellow-700' },
  wood: { label: '木作', color: 'bg-green-100 text-green-700' },
  other: { label: '其他', color: 'bg-purple-100 text-purple-700' },
};

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

export default function CourseCard({ course }: CourseCardProps) {
  const { getSessionsByCourse } = useCourseStore();
  const sessions = getSessionsByCourse(course.id);
  
  const availableSession = sessions.find(
    (s: Session) => s.currentPeople < s.maxPeople
  );
  const remainingSlots = availableSession
    ? availableSession.maxPeople - availableSession.currentPeople
    : 0;

  const category = categoryLabels[course.category] || categoryLabels.other;
  const coverImage = course.images?.[0] || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handcraft%20workshop&image_size=square_hd';

  const handleClick = () => {
    console.log('查看课程:', course.id);
  };

  return (
    <div
      onClick={handleClick}
      className="card card-hover cursor-pointer group"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={coverImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('badge', category.color)}>
            {category.label}
          </span>
          {course.isSeries && (
            <span className="badge bg-gradient-to-r from-clay-400 to-amber-400 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              系列课
            </span>
          )}
        </div>

        {remainingSlots > 0 && remainingSlots <= 3 && (
          <div className="absolute top-3 right-3 badge bg-red-500 text-white animate-pulse">
            仅剩 {remainingSlots} 位
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-pottery mb-2 line-clamp-1 group-hover:text-clay-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-sand-500 mb-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sand-400" />
          {course.workshopName}
        </p>

        <div className="flex items-center gap-2 mb-4">
          {renderStars(course.rating)}
          <span className="text-sm font-medium text-amber-600">{course.rating}</span>
          <span className="text-sm text-sand-400">({course.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-sand-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.floor(course.duration / 60)}小时
              {course.duration % 60 > 0 && `${course.duration % 60}分钟`}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              剩余 {remainingSlots} 位
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold text-clay-500">
              ¥{course.price}
            </span>
            {course.materialFee && course.materialFee > 0 && (
              <span className="text-xs text-sand-400 ml-1">
                +{course.materialFee}材料费
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
