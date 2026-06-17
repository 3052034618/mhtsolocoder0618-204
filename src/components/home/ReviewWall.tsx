import { Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCourseStore } from '@/store/useCourseStore';
import type { Review } from '@/types';

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-3.5 h-3.5',
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-sand-300'
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className={cn(
      'break-inside-avoid mb-6 card card-hover',
      review.isFeatured && 'ring-2 ring-clay-200'
    )}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-sand-100"
              loading="lazy"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-pottery">{review.userName}</h4>
                {review.isFeatured && (
                  <span className="flex items-center gap-1 text-xs font-medium text-clay-500 bg-clay-50 px-2 py-0.5 rounded-full">
                    <Award className="w-3 h-3" />
                    精选
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {renderStars(review.rating)}
                <span className="text-xs text-sand-400">
                  {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sand-600 text-sm leading-relaxed mb-4">
          {review.content}
        </p>

        {review.images && review.images.length > 0 && (
          <div className={cn(
            'grid gap-2',
            review.images.length === 1 ? 'grid-cols-1' :
            review.images.length === 2 ? 'grid-cols-2' :
            review.images.length >= 3 ? 'grid-cols-3' : ''
          )}>
            {review.images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                  src={image}
                  alt={`作品 ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReviewWall() {
  const { reviews, isLoaded, loadMockData } = useCourseStore();

  if (!isLoaded) {
    loadMockData();
  }

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const featuredReviews = sortedReviews.filter(r => r.isFeatured);
  const otherReviews = sortedReviews.filter(r => !r.isFeatured);
  const displayReviews = [...featuredReviews, ...otherReviews].slice(0, 9);

  return (
    <section className="py-16 bg-gradient-to-b from-sand-50 to-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pottery mb-3">
            学员好评墙
          </h2>
          <p className="text-sand-500">
            看看其他学员的手作成果和真实体验
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {displayReviews.map((review: Review, index: number) => (
            <div
              key={review.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        {displayReviews.length === 0 && (
          <div className="text-center py-12 text-sand-400">
            暂无评价
          </div>
        )}
      </div>
    </section>
  );
}
