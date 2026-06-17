import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Card, { CardContent, CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';
import CheckinTable, { CheckinItem } from '@/components/admin/CheckinTable';
import {
  ChevronDown,
  Download,
  Users,
  UserCheck,
  UserX,
  Calendar,
} from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useCheckinStore } from '@/store/useCheckinStore';
import mockBookings from '@/data/mock/bookings.json';
import { format } from 'date-fns';

export default function AdminCheckin() {
  const { courses, sessions, loadMockData, getSessionsByCourse } = useCourseStore();
  const { checkinRecords, checkIn, cancelCheckIn, isCheckedIn, getCheckinCount } = useCheckinStore();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);

  useEffect(() => {
    loadMockData();
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [loadMockData, courses, selectedCourseId]);

  useEffect(() => {
    const courseSessions = getSessionsByCourse(selectedCourseId);
    if (courseSessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(courseSessions[0].id);
    }
  }, [selectedCourseId, getSessionsByCourse, selectedSessionId]);

  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId);
  }, [courses, selectedCourseId]);

  const selectedSession = useMemo(() => {
    return sessions.find((s) => s.id === selectedSessionId);
  }, [sessions, selectedSessionId]);

  const courseSessions = useMemo(() => {
    return getSessionsByCourse(selectedCourseId);
  }, [selectedCourseId, getSessionsByCourse]);

  const checkinBookings = useMemo((): CheckinItem[] => {
    return mockBookings
      .filter((b) => b.sessionId === selectedSessionId && b.status !== 'cancelled' && b.status !== 'refunded')
      .map((b): CheckinItem => {
        const checkedIn = isCheckedIn(b.id, selectedSessionId);
        const baseStatus = b.status === 'completed' ? 'completed' : b.status === 'confirmed' ? 'paid' : (b.status as 'paid' | 'checkedin');
        return {
          id: b.id,
          userName: b.userName,
          userPhone: b.contactPhone,
          peopleCount: b.quantity,
          createdAt: b.createdAt,
          status: checkedIn ? 'checkedin' : baseStatus === 'completed' ? 'completed' : 'paid',
        };
      });
  }, [selectedSessionId, checkinRecords, isCheckedIn]);

  const stats = useMemo(() => {
    const total = checkinBookings.reduce((sum, b) => sum + b.peopleCount, 0);
    const checkedInBookings = useCheckinStore.getState().getCheckedInBookings(selectedSessionId);
    const checkedIn = checkinBookings
      .filter((b) => checkedInBookings.includes(b.id) || b.status === 'completed')
      .reduce((sum, b) => sum + b.peopleCount, 0);
    const notCheckedIn = total - checkedIn;
    return { total, checkedIn, notCheckedIn };
  }, [checkinBookings, selectedSessionId, checkinRecords]);

  const handleCheckin = (bookingId: string) => {
    checkIn(bookingId, selectedSessionId);
  };

  const handleCancelCheckin = (bookingId: string) => {
    cancelCheckIn(bookingId, selectedSessionId);
  };

  const handleExport = () => {
    const headers = ['序号', '学员姓名', '联系方式', '报名人数', '签到状态', '报名时间'];
    const rows = checkinBookings.map((b, i) => [
      i + 1,
      b.userName,
      b.userPhone,
      b.peopleCount,
      b.status === 'checkedin' || b.status === 'completed' ? '已签到' : '未签到',
      format(new Date(b.createdAt), 'yyyy-MM-dd HH:mm'),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `签到名单_${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sand-900 font-serif mb-2">签到管理</h1>
            <p className="text-sand-600">管理课程期次的学员签到情况</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download size={18} /> 导出签到名单
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <label className="block text-sm text-sand-500 mb-1">选择课程</label>
                <button
                  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand-200 rounded-xl hover:border-clay-500 transition-colors min-w-64"
                >
                  <span className={!selectedCourse ? 'text-sand-400' : 'text-sand-900'}>
                    {selectedCourse?.title || '请选择课程'}
                  </span>
                  <ChevronDown size={18} className="ml-auto text-sand-400" />
                </button>
                {showCourseDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-sand-200 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setSelectedSessionId('');
                          setShowCourseDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-sand-50 transition-colors ${
                          selectedCourseId === course.id ? 'bg-clay-50 text-clay-700' : 'text-sand-700'
                        }`}
                      >
                        {course.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm text-sand-500 mb-1">选择期次</label>
                <button
                  onClick={() => setShowSessionDropdown(!showSessionDropdown)}
                  disabled={!selectedCourseId || courseSessions.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand-200 rounded-xl hover:border-clay-500 transition-colors min-w-72 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar size={16} className="text-sand-400" />
                  <span className={!selectedSession ? 'text-sand-400' : 'text-sand-900'}>
                    {selectedSession
                      ? `${format(new Date(selectedSession.date), 'MM-dd')} ${selectedSession.startTime}-${selectedSession.endTime}`
                      : '请选择期次'}
                  </span>
                  <ChevronDown size={18} className="ml-auto text-sand-400" />
                </button>
                {showSessionDropdown && courseSessions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-sand-200 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
                    {courseSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => {
                          setSelectedSessionId(session.id);
                          setShowSessionDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-sand-50 transition-colors ${
                          selectedSessionId === session.id ? 'bg-clay-50 text-clay-700' : 'text-sand-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {format(new Date(session.date), 'yyyy-MM-dd')} {session.startTime}-{session.endTime}
                          </span>
                          <Tag variant={session.isTeamBooking ? 'warning' : 'default'} className="text-xs">
                            {session.isTeamBooking ? '团建' : '散客'}
                          </Tag>
                        </div>
                        <p className="text-xs text-sand-400 mt-1">
                          已报名 {session.currentPeople}/{session.maxPeople} 人
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedSession && (
                <div className="ml-auto flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sand-500 mb-1">
                      <Users size={16} />
                      <span className="text-sm">总人数</span>
                    </div>
                    <p className="text-2xl font-bold text-sand-900">{stats.total}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600 mb-1">
                      <UserCheck size={16} />
                      <span className="text-sm">已签到</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-orange-600 mb-1">
                      <UserX size={16} />
                      <span className="text-sm">未签到</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{stats.notCheckedIn}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedSession ? (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-sand-900">
                {selectedCourse?.title} - {format(new Date(selectedSession.date), 'MM月dd日')} {selectedSession.startTime}
              </h3>
            </CardHeader>
            <CardContent>
              <CheckinTable
                bookings={checkinBookings}
                onCheckin={handleCheckin}
                onCancelCheckin={handleCancelCheckin}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-sand-500">
              请先选择课程和期次
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
