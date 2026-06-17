import { useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Image,
  MessageSquare,
  Heart,
  Bell,
  CheckCircle,
  Upload,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useBookingStore } from '@/store/useBookingStore';
import Card, { CardContent, CardHeader } from '@/components/common/Card';
import Tag from '@/components/common/Tag';
import Button from '@/components/common/Button';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const quickLinks = [
  { icon: Calendar, label: '我的报名', path: '/user/bookings', color: 'text-clay-500 bg-clay-50' },
  { icon: Image, label: '我的作品', path: '/user/works', color: 'text-forest-500 bg-forest-50' },
  { icon: MessageSquare, label: '我的评价', path: '/user/reviews', color: 'text-pottery bg-candle/20' },
  { icon: Heart, label: '我的收藏', path: '/user/favorites', color: 'text-rose-500 bg-rose-50' },
];

export default function UserCenter() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { getBookingsByUser } = useBookingStore();

  const bookings = currentUser ? getBookingsByUser(currentUser.id) : [];
  const recentBookings = bookings.slice(0, 3);

  const pendingCheckIn = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const pendingReviews = bookings.filter((b) => b.status === 'completed' && !b.notes);
  const pendingWorks = bookings.filter((b) => b.status === 'completed');

  const todos = [
    { icon: CheckCircle, label: '待签到', count: pendingCheckIn.length, color: 'text-clay-500' },
    { icon: MessageSquare, label: '待评价', count: pendingReviews.length, color: 'text-pottery' },
    { icon: Upload, label: '待上传作品', count: pendingWorks.length, color: 'text-forest-500' },
  ];

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger'; label: string }> = {
      pending: { variant: 'warning', label: '待确认' },
      confirmed: { variant: 'success', label: '已确认' },
      completed: { variant: 'default', label: '已完成' },
      cancelled: { variant: 'danger', label: '已取消' },
      'checked-in': { variant: 'success', label: '已签到' },
    };
    return statusMap[status] || { variant: 'default', label: status };
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 bg-gradient-to-r from-clay-500 to-pottery text-white border-0">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{currentUser?.name || '学员'}</h1>
                <div className="flex items-center gap-2">
                  <Award size={18} />
                  <span className="text-sm">1,280 积分</span>
                </div>
              </div>
              <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate('/login')}>
                退出登录
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-sand-900">快捷入口</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {quickLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-sand-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center`}>
                    <link.icon size={24} />
                  </div>
                  <span className="text-sm font-medium text-sand-700">{link.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-sand-900">待办提醒</h2>
              <Bell size={18} className="text-sand-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {todos.map((todo) => (
                <div
                  key={todo.label}
                  className="flex items-center gap-3 p-4 bg-sand-50 rounded-xl cursor-pointer hover:bg-sand-100 transition-colors"
                  onClick={() => navigate('/user/bookings')}
                >
                  <div className={`w-10 h-10 rounded-lg bg-white ${todo.color} flex items-center justify-center`}>
                    <todo.icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sand-900">{todo.count}</div>
                    <div className="text-sm text-sand-500">{todo.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-sand-900">最近报名</h2>
              <button
                onClick={() => navigate('/user/bookings')}
                className="text-sm text-clay-500 flex items-center gap-1 hover:text-clay-600"
              >
                查看全部 <ChevronRight size={16} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-sand-500">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p>暂无报名记录</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
                  去浏览课程
                </Button>
              </div>
            ) : (
              recentBookings.map((booking) => {
                const status = getStatusTag(booking.status);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-4 bg-sand-50 rounded-xl hover:bg-sand-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/user/bookings`)}
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-clay-100 to-sand-200 flex items-center justify-center">
                      <Calendar size={24} className="text-clay-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sand-900 truncate">{booking.courseName}</h3>
                      <p className="text-sm text-sand-500 mt-1">
                        {booking.sessionDate && format(new Date(booking.sessionDate), 'yyyy年MM月dd日', { locale: zhCN })}
                        {booking.sessionTime && ` ${booking.sessionTime}`}
                      </p>
                      <p className="text-xs text-sand-400 mt-1">
                        {booking.peopleCount}人 · ¥{booking.totalPrice}
                      </p>
                    </div>
                    <Tag variant={status.variant}>{status.label}</Tag>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
