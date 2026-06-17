import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Card, { CardContent, CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';
import Modal from '@/components/common/Modal';
import CourseForm, { CourseFormData } from '@/components/admin/CourseForm';
import {
  Search,
  Plus,
  Edit,
  Eye,
  ArrowDownCircle,
  ArrowUpCircle,
  Filter,
} from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { Course } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  pottery: '陶艺',
  leather: '皮艺',
  floral: '花艺',
  candle: '蜡烛',
  other: '其他',
};

const difficultyLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

export default function AdminCourses() {
  const { courses, loadMockData } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeCourses, setActiveCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMockData();
    if (courses.length > 0 && activeCourses.size === 0) {
      setActiveCourses(new Set(courses.slice(0, 8).map((c) => c.id)));
    }
  }, [loadMockData, courses, activeCourses.size]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.workshopName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const isActive = activeCourses.has(course.id);
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, searchTerm, categoryFilter, statusFilter, activeCourses]);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (courseId: string) => {
    setActiveCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const handleSubmit = (data: CourseFormData) => {
    console.log('提交课程数据:', data);
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sand-900 font-serif mb-2">课程管理</h1>
            <p className="text-sand-600">管理所有课程信息、状态和排期</p>
          </div>
          <Button onClick={handleAddCourse}>
            <Plus size={18} /> 新增课程
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
                <input
                  type="text"
                  placeholder="搜索课程名称或工坊..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-sand-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1 bg-white"
                >
                  <option value="all">全部分类</option>
                  <option value="pottery">陶艺</option>
                  <option value="leather">皮艺</option>
                  <option value="floral">花艺</option>
                  <option value="candle">蜡烛</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1 bg-white"
                >
                  <option value="all">全部状态</option>
                  <option value="active">上架中</option>
                  <option value="inactive">已下架</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-sand-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">课程</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">分类</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">难度</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">价格</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">人数</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">评分</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredCourses.map((course) => {
                  const isActive = activeCourses.has(course.id);
                  return (
                    <tr key={course.id} className="hover:bg-sand-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.images[0]}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-sand-900">{course.title}</p>
                            <p className="text-xs text-sand-400">{course.workshopName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Tag variant="default">{categoryLabels[course.category]}</Tag>
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">
                        {difficultyLabels[course.difficulty]}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-sand-900">
                        ¥{course.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">
                        {course.maxPeople}人
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">
                        ⭐ {course.rating} ({course.reviewCount})
                      </td>
                      <td className="px-6 py-4">
                        <Tag variant={isActive ? 'success' : 'default'}>
                          {isActive ? '上架中' : '已下架'}
                        </Tag>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCourse(course)}>
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(course.id)}
                            className={cn(isActive ? 'text-orange-600' : 'text-green-600')}
                          >
                            {isActive ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sand-500">
                      暂无匹配的课程
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
            setEditingCourse(null);
          }}
          title={editingCourse ? '编辑课程' : '新增课程'}
          size="lg"
        >
          <CourseForm
            initialData={editingCourse || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingCourse(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
