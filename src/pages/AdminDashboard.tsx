import { useEffect, useMemo } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Card, { CardContent, CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Plus,
  Calendar,
  QrCode,
  ChevronRight,
} from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import mockBookings from '@/data/mock/bookings.json';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const chartData = [
  { month: '1月', value: 128 },
  { month: '2月', value: 156 },
  { month: '3月', value: 189 },
  { month: '4月', value: 234 },
  { month: '5月', value: 286 },
  { month: '6月', value: 312 },
];

const statusColors: Record<string, string> = {
  pending: 'warning',
  paid: 'default',
  confirmed: 'success',
  completed: 'success',
  cancelled: 'danger',
  refunded: 'danger',
};

const statusLabels: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款',
};

export default function AdminDashboard() {
  const { courses, series, loadMockData } = useCourseStore();

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = mockBookings.filter(
      (b) => new Date(b.createdAt).toISOString().split('T')[0] === today
    );
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyRevenue = mockBookings
      .filter((b) => {
        const d = new Date(b.createdAt);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, b) => sum + (b.status !== 'cancelled' && b.status !== 'refunded' ? b.payAmount : 0), 0);
    const uniqueUsers = new Set(mockBookings.map((b) => b.userId)).size;

    return {
      todayBookings: todayBookings.length,
      monthlyRevenue,
      totalCourses: courses.length,
      totalStudents: uniqueUsers,
    };
  }, [courses]);

  const recentBookings = useMemo(() => {
    return [...mockBookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, []);

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sand-900 font-serif mb-2">管理仪表盘</h1>
          <p className="text-sand-600">欢迎回来，查看今天的运营数据</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sand-500 mb-1">今日报名</p>
                  <p className="text-3xl font-bold text-sand-900">{stats.todayBookings}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> +12% 较昨日
                  </p>
                </div>
                <div className="w-12 h-12 bg-clay-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-clay-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sand-500 mb-1">本月收入</p>
                  <p className="text-3xl font-bold text-sand-900">¥{stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> +8% 较上月
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sand-500 mb-1">课程总数</p>
                  <p className="text-3xl font-bold text-sand-900">{stats.totalCourses}</p>
                  <p className="text-xs text-sand-400 mt-1">含 {series.length} 个系列课</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sand-500 mb-1">学员总数</p>
                  <p className="text-3xl font-bold text-sand-900">{stats.totalStudents}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> +5% 本月新增
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <h3 className="text-lg font-semibold text-sand-900">近6个月报名趋势</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-64 gap-4">
                {chartData.map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-clay-500 to-clay-400 rounded-t-xl transition-all duration-500"
                      style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '4px' }}
                    />
                    <p className="mt-3 text-sm text-sand-500">{item.month}</p>
                    <p className="text-xs font-medium text-sand-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-sand-900">快捷操作</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="secondary">
                <Plus size={18} /> 新增课程
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                <Calendar size={18} /> 排期管理
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                <QrCode size={18} /> 签到管理
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                <Users size={18} /> 团建预约
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-sand-900">最近报名</h3>
            <Button variant="ghost" size="sm">
              查看全部 <ChevronRight size={16} />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-sand-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">订单号</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">学员</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">课程</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">金额</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">报名时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-sand-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-sand-900">{booking.orderNo}</td>
                    <td className="px-6 py-4 text-sm text-sand-700">
                      <div>
                        <p className="font-medium">{booking.userName}</p>
                        <p className="text-sand-400 text-xs">{booking.contactPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-sand-700">{booking.courseTitle}</td>
                    <td className="px-6 py-4 text-sm font-medium text-sand-900">¥{booking.payAmount}</td>
                    <td className="px-6 py-4">
                      <Tag variant={statusColors[booking.status] as any}>
                        {statusLabels[booking.status]}
                      </Tag>
                    </td>
                    <td className="px-6 py-4 text-sm text-sand-500">
                      {format(new Date(booking.createdAt), 'MM-dd HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
