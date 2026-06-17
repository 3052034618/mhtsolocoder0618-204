import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Card, { CardContent, CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';
import Modal from '@/components/common/Modal';
import SessionForm, { SessionFormData } from '@/components/admin/SessionForm';
import {
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
} from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { Session } from '@/types';
import { format } from 'date-fns';

export default function AdminSessions() {
  const { courses, sessions, loadMockData, getSessionsByCourse } = useCourseStore();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  useEffect(() => {
    loadMockData();
    if (courses.length > 0 && selectedCourseId === 'all') {
      setSelectedCourseId(courses[0].id);
    }
  }, [loadMockData, courses, selectedCourseId]);

  const filteredSessions = useMemo(() => {
    if (selectedCourseId === 'all') return sessions;
    return getSessionsByCourse(selectedCourseId);
  }, [selectedCourseId, sessions, getSessionsByCourse]);

  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId);
  }, [courses, selectedCourseId]);

  const handleAddSession = () => {
    setEditingSession(null);
    setIsFormOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setIsFormOpen(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('确定要删除这个期次吗？')) {
      console.log('删除期次:', sessionId);
    }
  };

  const handleSubmit = (data: SessionFormData) => {
    console.log('提交期次数据:', data);
    setIsFormOpen(false);
    setEditingSession(null);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sand-900 font-serif mb-2">期次管理</h1>
            <p className="text-sand-600">管理课程的排期和报名情况</p>
          </div>
          <Button onClick={handleAddSession}>
            <Plus size={18} /> 新增期次
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand-200 rounded-xl hover:border-clay-500 transition-colors min-w-64"
                >
                  <Calendar size={18} className="text-sand-400" />
                  <span className={selectedCourseId === 'all' ? 'text-sand-400' : 'text-sand-900'}>
                    {selectedCourse ? selectedCourse.title : '选择课程'}
                  </span>
                  <ChevronDown size={18} className="ml-auto text-sand-400" />
                </button>
                {showCourseDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-sand-200 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCourseId('all');
                        setShowCourseDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-sand-50 transition-colors ${
                        selectedCourseId === 'all' ? 'bg-clay-50 text-clay-700' : 'text-sand-700'
                      }`}
                    >
                      全部课程
                    </button>
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          setSelectedCourseId(course.id);
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
              {selectedCourse && (
                <div className="flex items-center gap-4 text-sm text-sand-600">
                  <span>共 {filteredSessions.length} 个期次</span>
                  <span>|</span>
                  <span>¥{selectedCourse.price}/人</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-sand-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">日期</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">时间</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">课程</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">人数限制</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">已报名</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">价格</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">类型</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredSessions.map((session) => {
                  const course = courses.find((c) => c.id === session.courseId);
                  const isFull = session.currentPeople >= session.maxPeople;
                  return (
                    <tr key={session.id} className="hover:bg-sand-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-sand-400" />
                          <span className="text-sm font-medium text-sand-900">
                            {format(new Date(session.date), 'yyyy-MM-dd')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">
                        {session.startTime} - {session.endTime}
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">
                        {course?.title || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">
                        {session.maxPeople}人
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-sand-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull ? 'bg-red-500' : 'bg-clay-500'
                              }`}
                              style={{ width: `${(session.currentPeople / session.maxPeople) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${isFull ? 'text-red-600' : 'text-sand-700'}`}>
                            {session.currentPeople}/{session.maxPeople}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-sand-900">
                        ¥{session.price}
                      </td>
                      <td className="px-6 py-4">
                        <Tag variant={session.isTeamBooking ? 'warning' : 'default'}>
                          {session.isTeamBooking ? '团建专场' : '散客'}
                        </Tag>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSession(session)}>
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Users size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sand-500">
                      暂无期次数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSession(null);
          }}
          title={editingSession ? '编辑期次' : '新增期次'}
        >
          <SessionForm
            initialData={editingSession || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingSession(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
