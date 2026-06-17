import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { Course, CourseCategory, DifficultyLevel } from '@/types';
import { cn } from '@/lib/utils';

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

export interface CourseFormData {
  title: string;
  category: CourseCategory;
  description: string;
  image: string;
  duration: number;
  maxPeople: number;
  price: number;
  materialIncluded: boolean;
  materialFee?: number;
  ageMin: number;
  ageMax: number;
  difficulty: DifficultyLevel;
  notice: string;
}

const categories: { value: CourseCategory; label: string }[] = [
  { value: 'pottery', label: '陶艺' },
  { value: 'leather', label: '皮艺' },
  { value: 'floral', label: '花艺' },
  { value: 'candle', label: '蜡烛' },
  { value: 'other', label: '其他' },
];

const difficulties: { value: DifficultyLevel; label: string }[] = [
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'advanced', label: '高级' },
];

const CourseForm = ({ initialData, onSubmit, onCancel }: CourseFormProps) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          category: initialData.category,
          description: initialData.description,
          image: initialData.images[0] || '',
          duration: initialData.duration,
          maxPeople: initialData.maxPeople,
          price: initialData.price,
          materialIncluded: initialData.materialIncluded,
          materialFee: initialData.materialFee,
          ageMin: initialData.ageRange.min,
          ageMax: initialData.ageRange.max,
          difficulty: initialData.difficulty,
          notice: initialData.notice.join('\n'),
        }
      : {
          category: 'pottery',
          materialIncluded: true,
          difficulty: 'beginner',
          ageMin: 6,
          ageMax: 60,
        },
  });

  const materialIncluded = watch('materialIncluded');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">课程名称</label>
        <input
          type="text"
          {...register('title', { required: '请输入课程名称' })}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border transition-colors',
            errors.title ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-1'
          )}
          placeholder="请输入课程名称"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">分类</label>
          <select
            {...register('category', { required: '请选择分类' })}
            className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">难度</label>
          <select
            {...register('difficulty', { required: '请选择难度' })}
            className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
          >
            {difficulties.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">描述</label>
        <textarea
          {...register('description', { required: '请输入课程描述' })}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1 resize-none"
          placeholder="请输入课程描述"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">封面图片</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-sand-300 rounded-xl cursor-pointer hover:border-clay-500 transition-colors">
            <input type="file" className="hidden" accept="image/*" />
            <Upload size={24} className="text-sand-400" />
          </label>
          <input
            type="text"
            {...register('image')}
            placeholder="或输入图片URL"
            className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">时长（分钟）</label>
          <input
            type="number"
            {...register('duration', { required: '请输入时长', min: 1 })}
            className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">人数限制</label>
          <input
            type="number"
            {...register('maxPeople', { required: '请输入人数限制', min: 1 })}
            className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
          />
          {errors.maxPeople && <p className="text-red-500 text-sm mt-1">{errors.maxPeople.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">价格（元）</label>
          <input
            type="number"
            {...register('price', { required: '请输入价格', min: 0 })}
            className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('materialIncluded')}
            className="w-4 h-4 text-clay-600 rounded focus:ring-clay-500"
          />
          <span className="text-sm text-sand-700">材料费包含</span>
        </label>
        {!materialIncluded && (
          <div className="flex-1">
            <input
              type="number"
              {...register('materialFee', { min: 0 })}
              placeholder="材料费金额"
              className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">适合年龄段</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              {...register('ageMin', { required: '请输入最小年龄', min: 1 })}
              className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
              placeholder="最小"
            />
            <span className="text-sand-500">-</span>
            <input
              type="number"
              {...register('ageMax', { required: '请输入最大年龄', min: 1 })}
              className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1"
              placeholder="最大"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">注意事项</label>
        <textarea
          {...register('notice')}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-1 resize-none"
          placeholder="每行一条注意事项"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-sand-100">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X size={18} />
          取消
        </Button>
        <Button type="submit">
          {isEditing ? '保存修改' : '创建课程'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
