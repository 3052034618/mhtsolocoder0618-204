import { useForm, useWatch } from 'react-hook-form';
import { Upload, X, Check, DollarSign } from 'lucide-react';
import Button from '@/components/common/Button';
import { Series, Course } from '@/types';
import { cn } from '@/lib/utils';

interface SeriesFormProps {
  initialData?: Series;
  courses: Course[];
  onSubmit: (data: SeriesFormData) => void;
  onCancel: () => void;
}

export interface SeriesFormData {
  title: string;
  description: string;
  courseIds: string[];
  originalPrice: number;
  seriesPrice: number;
  coverImage: string;
}

const SeriesForm = ({ initialData, courses, onSubmit, onCancel }: SeriesFormProps) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SeriesFormData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          courseIds: initialData.courseIds,
          originalPrice: initialData.originalPrice,
          seriesPrice: initialData.seriesPrice,
          coverImage: initialData.coverImage,
        }
      : {
          courseIds: [],
          originalPrice: 0,
          seriesPrice: 0,
        },
  });

  const selectedCourseIds = useWatch({
    control,
    name: 'courseIds',
    defaultValue: [],
  });

  const calculatedOriginalPrice = courses
    .filter((c) => selectedCourseIds.includes(c.id))
    .reduce((sum, c) => sum + c.price, 0);

  const toggleCourse = (courseId: string) => {
    const currentIds = selectedCourseIds;
    const newIds = currentIds.includes(courseId)
      ? currentIds.filter((id) => id !== courseId)
      : [...currentIds, courseId];
    setValue('courseIds', newIds, { shouldValidate: true });
    setValue('originalPrice', courses.filter((c) => newIds.includes(c.id)).reduce((sum, c) => sum + c.price, 0));
  };

  const validateCourseIds = (value: string[]) => {
    if (value.length < 2) {
      return '至少选择2门课程';
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">系列名称</label>
        <input
          type="text"
          {...register('title', { required: '请输入系列名称' })}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border transition-colors',
            errors.title ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-1'
          )}
          placeholder="请输入系列课程名称"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">描述</label>
        <textarea
          {...register('description', { required: '请输入系列描述' })}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1 resize-none"
          placeholder="请输入系列课程描述"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">
          选择课程 <span className="text-sand-400 text-xs">（至少2门）</span>
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto border border-sand-200 rounded-xl p-2">
          {courses.map((course) => {
            const isSelected = selectedCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => toggleCourse(course.id)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2',
                  isSelected
                    ? 'border-clay-500 bg-clay-50'
                    : 'border-transparent hover:bg-sand-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors',
                      isSelected ? 'bg-clay-500 border-clay-500' : 'border-sand-300'
                    )}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                  <div>
                    <p className={cn('text-sm font-medium', isSelected ? 'text-clay-700' : 'text-sand-700')}>
                      {course.title}
                    </p>
                    <p className="text-xs text-sand-500">{course.duration}分钟</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-clay-600">
                  <DollarSign size={14} />
                  <span className="font-semibold">¥{course.price}</span>
                </div>
              </div>
            );
          })}
        </div>
        <input
          type="hidden"
          {...register('courseIds', { validate: validateCourseIds })}
        />
        {errors.courseIds && <p className="text-red-500 text-sm mt-1">{errors.courseIds.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">
            原价总和
            <span className="text-sand-400 text-xs ml-1">（自动计算）</span>
          </label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
            <input
              type="number"
              {...register('originalPrice')}
              readOnly
              value={calculatedOriginalPrice}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-200 bg-sand-50 text-sand-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">优惠价</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
            <input
              type="number"
              {...register('seriesPrice', { required: '请输入优惠价', min: 0 })}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors',
                errors.seriesPrice ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
                'focus:outline-none focus:ring-2 focus:ring-offset-1'
              )}
            />
          </div>
          {errors.seriesPrice && <p className="text-red-500 text-sm mt-1">{errors.seriesPrice.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">封面图</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-sand-300 rounded-xl cursor-pointer hover:border-clay-500 transition-colors">
            <input type="file" className="hidden" accept="image/*" />
            <Upload size={24} className="text-sand-400" />
          </label>
          <input
            type="text"
            {...register('coverImage')}
            placeholder="或输入图片URL"
            className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-sand-100">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X size={18} />
          取消
        </Button>
        <Button type="submit">
          {isEditing ? '保存修改' : '创建系列'}
        </Button>
      </div>
    </form>
  );
};

export default SeriesForm;
