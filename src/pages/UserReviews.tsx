import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Star,
  Image,
  Calendar,
  Edit3,
  Trash2,
  ChevronLeft,
  Send,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useBookingStore } from '@/store/useBookingStore';
import Card, { CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Rating from '@/components/common/Rating';
import EmptyState from '@/components/common/EmptyState';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const tabs = [
  { key: 'pending', label: '待评价' },
  { key: 'reviewed', label: '已评价' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

interface Review {
  id: string;
  bookingId: string;
  courseId: string;
  courseName: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
}

export default function UserReviews() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { getBookingsByUser, updateBooking } = useBookingStore();
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  const bookings = currentUser ? getBookingsByUser(currentUser.id) : [];
  const completedBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'checked-in'
  );

  const pendingBookings = completedBookings.filter(
    (b) => !reviews.find((r) => r.bookingId === b.id)
  );

  const reviewedBookings = completedBookings.filter((b) =>
    reviews.find((r) => r.bookingId === b.id)
  );

  const displayList = activeTab === 'pending' ? pendingBookings : reviewedBookings;

  const handleOpenReview = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setEditingReview(null);
    setRating(5);
    setContent('');
    setShowReviewModal(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setSelectedBooking(review.bookingId);
    setRating(review.rating);
    setContent(review.content);
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    if (!selectedBooking || rating === 0 || !content.trim()) return;

    const booking = bookings.find((b) => b.id === selectedBooking);
    if (!booking) return;

    if (editingReview) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating, content, createdAt: new Date().toISOString() }
            : r
        )
      );
    } else {
      const newReview: Review = {
        id: crypto.randomUUID(),
        bookingId: selectedBooking,
        courseId: booking.courseId,
        courseName: booking.courseName,
        rating,
        content,
        images: [],
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [...prev, newReview]);
      updateBooking(selectedBooking, { notes: '已评价' });
    }

    setShowReviewModal(false);
    setSelectedBooking(null);
    setEditingReview(null);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('确定要删除这条评价吗？')) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
  };

  const getReviewForBooking = (bookingId: string) => {
    return reviews.find((r) => r.bookingId === bookingId);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/user')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-sand-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-sand-700" />
          </button>
          <h1 className="text-2xl font-bold text-sand-900">我的评价</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-card mb-6">
          <div className="flex border-b border-sand-100">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                  activeTab === tab.key ? 'text-clay-500' : 'text-sand-500 hover:text-sand-700'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.key
                      ? 'bg-clay-100 text-clay-600'
                      : 'bg-sand-100 text-sand-600'
                  }`}
                >
                  {tab.key === 'pending' ? pendingBookings.length : reviewedBookings.length}
                </span>
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-clay-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {displayList.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={MessageSquare}
                title={activeTab === 'pending' ? '暂无待评价课程' : '暂无已评价课程'}
                description={
                  activeTab === 'pending'
                    ? '完成课程后可以在这里评价，分享你的学习体验'
                    : '评价过的课程会显示在这里'
                }
                action={
                  activeTab === 'pending' ? (
                    <Button variant="outline" onClick={() => navigate('/')}>
                      去浏览课程
                    </Button>
                  ) : null
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayList.map((booking) => {
              const review = getReviewForBooking(booking.id);

              return (
                <Card key={booking.id}>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-clay-100 to-sand-200 flex items-center justify-center flex-shrink-0">
                        <Star size={28} className="text-clay-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sand-900 mb-2 truncate">
                          {booking.courseName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-sand-500 mb-3">
                          <Calendar size={14} />
                          <span>
                            {booking.sessionDate &&
                              format(new Date(booking.sessionDate), 'yyyy年MM月dd日', {
                                locale: zhCN,
                              })}
                          </span>
                        </div>

                        {review ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <Rating value={review.rating} readOnly size="sm" />
                              <span className="text-sm text-sand-500">
                                {format(new Date(review.createdAt), 'yyyy-MM-dd HH:mm', {
                                  locale: zhCN,
                                })}
                              </span>
                            </div>
                            <p className="text-sand-700 mb-3">{review.content}</p>
                            {review.images.length > 0 && (
                              <div className="flex gap-2 mb-3">
                                {review.images.map((img, idx) => (
                                  <div
                                    key={idx}
                                    className="w-16 h-16 rounded-lg bg-sand-100 flex items-center justify-center"
                                  >
                                    <Image size={20} className="text-sand-400" />
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditReview(review)}
                              >
                                <Edit3 size={14} />
                                编辑
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                <Trash2 size={14} className="text-clay-500" />
                                删除
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button onClick={() => handleOpenReview(booking.id)}>
                            <MessageSquare size={16} />
                            去评价
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Modal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          title={editingReview ? '编辑评价' : '发表评价'}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-3">课程评分</label>
              <div className="flex items-center gap-4">
                <Rating value={rating} onChange={setRating} size="lg" />
                <span className="text-2xl font-bold text-candle">{rating.toFixed(1)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sand-700 mb-3">评价内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="分享你的学习体验，帮助其他学员更好地了解课程..."
                rows={5}
                className="w-full px-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none resize-none"
              />
              <div className="text-right text-sm text-sand-400 mt-2">{content.length}/500</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sand-700 mb-3">上传图片</label>
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-sand-300 flex items-center justify-center cursor-pointer hover:border-clay-500 transition-colors">
                  <Image size={24} className="text-sand-400" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-sand-100">
              <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                取消
              </Button>
              <Button onClick={handleSubmitReview} disabled={rating === 0 || !content.trim()}>
                <Send size={16} />
                {editingReview ? '保存修改' : '提交评价'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
