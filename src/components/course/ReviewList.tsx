import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Rating from '@/components/common/Rating';
import { useCourseStore } from '@/store/useCourseStore';
import type { Review } from '@/types';

type FilterType = 'all' | 'good' | 'medium' | 'bad';

interface ReviewListProps {
  courseId?: string;
  pageSize?: number;
}

const FILTERS: { id: FilterType; label: string; min: number; max: number }[] = [
  { id: 'all', label: '全部', min: 0, max: 5 },
  { id: 'good', label: '好评', min: 4, max: 5 },
  { id: 'medium', label: '中评', min: 3, max: 3 },
  { id: 'bad', label: '差评', min: 1, max: 2 },
];

function ReviewList({ courseId, pageSize = 5 }: ReviewListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { reviews } = useCourseStore();

  const filteredReviews = useMemo(() => {
    const filterConfig = FILTERS.find((f) => f.id === filter)!;
    let result = reviews;

    if (courseId) {
      result = result.filter((r) => r.courseId === courseId);
    }

    result = result.filter(
      (r) => r.rating >= filterConfig.min && r.rating <= filterConfig.max
    );

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reviews, filter, courseId]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWorkshopReply = (reviewId: string) => {
    const replies: Record<string, string> = {
      r001: '感谢您的好评！很高兴您喜欢我们的陶艺课程，期待您下次再来体验更多精彩内容！',
      r002: '谢谢您的支持！手工皮具确实需要耐心，您做的钱包非常棒，欢迎常来！',
    };
    return replies[reviewId];
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-sand-900 font-serif">
          用户评价 ({filteredReviews.length})
        </h3>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id);
              setPage(1);
            }}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === f.id
                ? 'bg-clay-500 text-white'
                : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {paginatedReviews.length === 0 ? (
          <div className="text-center py-12 text-sand-500">
            暂无评价
          </div>
        ) : (
          paginatedReviews.map((review: Review) => {
            const reply = getWorkshopReply(review.id);
            return (
              <div
                key={review.id}
                className="border-b border-sand-100 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sand-900">
                          {review.userName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Rating value={review.rating} readOnly size="sm" />
                          <span className="text-sm text-sand-400">
                            {format(
                              new Date(review.createdAt),
                              'yyyy-MM-dd HH:mm',
                              { locale: zhCN }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sand-700 mb-4">{review.content}</p>

                    {review.images.length > 0 && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {review.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPreviewImage(img)}
                            className="w-20 h-20 rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={img}
                              alt={`评价图片${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {reply && (
                      <div className="bg-sand-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle
                            size={16}
                            className="text-clay-500"
                          />
                          <span className="text-sm font-medium text-clay-700">
                            工坊回复
                          </span>
                        </div>
                        <p className="text-sm text-sand-600">{reply}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sand-600 hover:bg-sand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={cn(
                'w-10 h-10 rounded-xl font-medium transition-colors',
                page === p
                  ? 'bg-clay-500 text-white'
                  : 'text-sand-600 hover:bg-sand-100'
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sand-600 hover:bg-sand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
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
            <X size={24} />
          </button>
          <img
            src={previewImage}
            alt="预览图片"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default ReviewList;
