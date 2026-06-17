import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Card, { CardContent, CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';
import Modal from '@/components/common/Modal';
import SeriesForm, { SeriesFormData } from '@/components/admin/SeriesForm';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  Star,
  BookOpen,
} from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { Series } from '@/types';
import { format } from 'date-fns';

export default function AdminSeries() {
  const { series, courses, loadMockData } = useCourseStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  const handleAddSeries = () => {
    setEditingSeries(null);
    setIsFormOpen(true);
  };

  const handleEditSeries = (s: Series) => {
    setEditingSeries(s);
    setIsFormOpen(true);
  };

  const handleDeleteSeries = (id: string) => {
    if (confirm('确定要删除这个系列课程吗？')) {
      console.log('删除系列课程:', id);
    }
  };

  const handleSubmit = (data: SeriesFormData) => {
    console.log('提交系列课程数据:', data);
    setIsFormOpen(false);
    setEditingSeries(null);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sand-900 font-serif mb-2">系列课程管理</h1>
            <p className="text-sand-600">管理系列课程套餐，提供优惠组合</p>
          </div>
          <Button onClick={handleAddSeries}>
            <Plus size={18} /> 新增系列课程
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {series.map((s) => (
            <Card key={s.id} hoverable>
              <div className="relative">
                <img
                  src={s.coverImage}
                  alt={s.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Tag variant="warning">{s.discount}</Tag>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-sand-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-sand-500 line-clamp-2">{s.subtitle}</p>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-sand-600">
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{s.courseIds.length}门课程</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{Math.floor(s.totalDuration / 60)}小时</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{s.studentCount}人</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-sand-700">{s.rating}</span>
                    <span className="text-xs text-sand-400">({s.reviewCount}评价)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-clay-600">¥{s.seriesPrice}</span>
                    <span className="text-sm text-sand-400 line-through">¥{s.originalPrice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleEditSeries(s)}>
                    <Edit size={14} /> 编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteSeries(s.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {series.length === 0 && (
            <div className="col-span-3">
              <Card>
                <CardContent className="py-16 text-center text-sand-500">
                  暂无系列课程
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSeries(null);
          }}
          title={editingSeries ? '编辑系列课程' : '新增系列课程'}
          size="lg"
        >
          <SeriesForm
            initialData={editingSeries || undefined}
            courses={courses}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingSeries(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}


