import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  QrCode,
  X,
  Upload,
  MessageSquare,
  Users,
  Clock,
  MapPin,
  ChevronLeft,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useBookingStore } from '@/store/useBookingStore';
import type { BookingStatus } from '@/types';
import Card, { CardContent } from '@/components/common/Card';
import Tag from '@/components/common/Tag';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'upcoming', label: '待参加' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function UserBookings() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { getBookingsByUser, updateBooking, checkIn } = useBookingStore();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const bookings = currentUser ? getBookingsByUser(currentUser.id) : [];

  const filteredBookings = bookings.filter((booking) => {
    switch (activeTab) {
      case 'upcoming':
        return booking.status === 'pending' || booking.status === 'paid' || booking.status === 'confirmed';
      case 'completed':
        return booking.status === 'completed' || booking.status === 'checked-in';
      case 'cancelled':
        return booking.status === 'cancelled' || booking.status === 'refunded';
      default:
        return true;
    }
  });

  const getStatusConfig = (status: BookingStatus) => {
    const map: Record<BookingStatus, { variant: 'default' | 'success' | 'warning' | 'danger'; label: string }> = {
      pending: { variant: 'warning', label: '待确认' },
      paid: { variant: 'success', label: '已支付' },
      confirmed: { variant: 'success', label: '已确认' },
      'checked-in': { variant: 'success', label: '已签到' },
      completed: { variant: 'default', label: '已完成' },
      cancelled: { variant: 'danger', label: '已取消' },
      refunded: { variant: 'danger', label: '已退款' },
    };
    return map[status];
  };

  const handleCancel = (id: string) => {
    updateBooking(id, { status: 'cancelled' });
  };

  const handleCheckIn = (id: string) => {
    setSelectedBookingId(id);
    setShowQrModal(true);
  };

  const confirmCheckIn = () => {
    if (selectedBookingId) {
      checkIn(selectedBookingId);
      setShowQrModal(false);
      setSelectedBookingId(null);
    }
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
          <h1 className="text-2xl font-bold text-sand-900">我的报名</h1>
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
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-clay-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Calendar size={48} className="mx-auto mb-4 text-sand-300" />
                <p className="text-sand-500 mb-4">暂无报名记录</p>
                <Button variant="outline" onClick={() => navigate('/')}>
                  去浏览课程
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const status = getStatusConfig(booking.status);
              const showActions = booking.status !== 'cancelled' && booking.status !== 'refunded';
              const isCompleted = booking.status === 'completed' || booking.status === 'checked-in';
              const canCheckIn = booking.status === 'confirmed' || booking.status === 'paid';

              return (
                <Card key={booking.id} hoverable>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-clay-100 to-sand-200 flex items-center justify-center flex-shrink-0">
                        <Calendar size={32} className="text-clay-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sand-900 truncate">{booking.courseName}</h3>
                          <Tag variant={status.variant}>{status.label}</Tag>
                        </div>
                        <div className="space-y-1 text-sm text-sand-500">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>
                              {booking.sessionDate && format(new Date(booking.sessionDate), 'yyyy-MM-dd', { locale: zhCN })}
                              {booking.sessionTime && ` ${booking.sessionTime}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{booking.peopleCount} 人参加</span>
                          </div>
                          {booking.notes && (
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>{booking.notes}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-sand-100">
                          <span className="text-lg font-bold text-clay-500">¥{booking.totalPrice}</span>
                          {showActions && (
                            <div className="flex gap-2">
                              {isCompleted && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate('/user/works')}
                                  >
                                    <Upload size={16} />
                                    上传作品
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => navigate('/user/reviews')}
                                  >
                                    <MessageSquare size={16} />
                                    去评价
                                  </Button>
                                </>
                              )}
                              {canCheckIn && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCheckIn(booking.id)}
                                >
                                  <QrCode size={16} />
                                  签到
                                </Button>
                              )}
                              {booking.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCancel(booking.id)}
                                >
                                  <X size={16} />
                                  取消报名
                                </Button>
                              )}
                              <Button size="sm" variant="secondary">
                                查看详情
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="签到二维码">
          <div className="text-center py-6">
            <div className="w-64 h-64 mx-auto bg-white border-2 border-sand-200 rounded-2xl flex items-center justify-center mb-4">
              <QrCode size={200} className="text-sand-900" />
            </div>
            <p className="text-sand-600 mb-6">请向工作人员出示此二维码进行签到</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowQrModal(false)}>
                取消
              </Button>
              <Button onClick={confirmCheckIn}>确认签到</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
