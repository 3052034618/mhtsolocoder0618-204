import { useState, useMemo } from 'react';
import { Search, Check, X, Users, UserCheck, UserX } from 'lucide-react';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface CheckinItem {
  id: string;
  userName: string;
  userPhone: string;
  peopleCount: number;
  createdAt: string;
  status: 'paid' | 'checkedin' | 'completed';
}

interface CheckinTableProps {
  bookings: CheckinItem[];
  onCheckin: (bookingId: string) => void;
  onCancelCheckin: (bookingId: string) => void;
}

const CheckinTable = ({ bookings, onCheckin, onCancelCheckin }: CheckinTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) =>
      b.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const stats = useMemo(() => {
    const total = filteredBookings.reduce((sum, b) => sum + b.peopleCount, 0);
    const checkedIn = filteredBookings
      .filter((b) => b.status === 'checkedin' || b.status === 'completed')
      .reduce((sum, b) => sum + b.peopleCount, 0);
    const notCheckedIn = total - checkedIn;
    return { total, checkedIn, notCheckedIn };
  }, [filteredBookings]);

  const statusConfig = {
    paid: { label: '已报名', className: 'bg-blue-100 text-blue-700' },
    checkedin: { label: '已签到', className: 'bg-green-100 text-green-700' },
    completed: { label: '已完成', className: 'bg-gray-100 text-gray-700' },
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-sand-50 rounded-2xl">
          <div className="flex items-center gap-2 text-sand-600 mb-1">
            <Users size={18} />
            <span className="text-sm">总人数</span>
          </div>
          <p className="text-2xl font-semibold text-sand-900">{stats.total}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-2xl">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <UserCheck size={18} />
            <span className="text-sm">已签到</span>
          </div>
          <p className="text-2xl font-semibold text-green-700">{stats.checkedIn}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-2xl">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <UserX size={18} />
            <span className="text-sm">未签到</span>
          </div>
          <p className="text-2xl font-semibold text-orange-700">{stats.notCheckedIn}</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
        <input
          type="text"
          placeholder="搜索学员姓名..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-sand-100">
        <table className="w-full">
          <thead className="bg-sand-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-sand-600">序号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-sand-600">学员姓名</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-sand-600">联系方式</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-sand-600">报名人数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-sand-600">报名时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-sand-600">签到状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-sand-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sand-500">
                  暂无报名记录
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking, index) => {
                const status = statusConfig[booking.status];
                const canCheckin = booking.status === 'paid';
                const canCancel = booking.status === 'checkedin';

                return (
                  <tr key={booking.id} className="hover:bg-sand-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-sand-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-sand-900">{booking.userName}</td>
                    <td className="px-4 py-3 text-sm text-sand-600">{booking.userPhone}</td>
                    <td className="px-4 py-3 text-sm text-sand-600">{booking.peopleCount}人</td>
                    <td className="px-4 py-3 text-sm text-sand-600">
                      {format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {canCheckin && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onCheckin(booking.id)}
                        >
                          <Check size={14} />
                          签到
                        </Button>
                      )}
                      {canCancel && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCancelCheckin(booking.id)}
                        >
                          <X size={14} />
                          取消签到
                        </Button>
                      )}
                      {booking.status === 'completed' && (
                        <span className="text-sm text-sand-400">已完成</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckinTable;
