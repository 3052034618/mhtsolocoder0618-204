import { useForm } from 'react-hook-form';
import { Calendar, Clock, Users, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { Session } from '@/types';
import { cn } from '@/lib/utils';

interface SessionFormProps {
  initialData?: Session;
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
}

export interface SessionFormData {
  date: string;
  startTime: string;
  endTime: string;
  maxPeople: number;
  price: number;
  isTeamBooking: boolean;
}

const SessionForm = ({ initialData, onSubmit, onCancel }: SessionFormProps) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SessionFormData>({
    defaultValues: initialData
      ? {
          date: initialData.date,
          startTime: initialData.startTime,
          endTime: initialData.endTime,
          maxPeople: initialData.maxPeople,
          price: initialData.price,
          isTeamBooking: initialData.isTeamBooking,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '11:00',
          maxPeople: 10,
          price: 0,
          isTeamBooking: false,
        },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const validateEndTime = (value: string) => {
    if (startTime && value <= startTime) {
      return '结束时间必须晚于开始时间';
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-1.5">
          <Calendar size={16} className="inline mr-1.5" />
          日期
        </label>
        <input
          type="date"
          {...register('date', { required: '请选择日期' })}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border transition-colors',
            errors.date ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-1'
          )}
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">
            <Clock size={16} className="inline mr-1.5" />
            开始时间
          </label>
          <input
            type="time"
            {...register('startTime', { required: '请选择开始时间' })}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border transition-colors',
              errors.startTime ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-1'
            )}
          />
          {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">
            <Clock size={16} className="inline mr-1.5" />
            结束时间
          </label>
          <input
            type="time"
            {...register('endTime', {
              required: '请选择结束时间',
              validate: validateEndTime,
            })}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border transition-colors',
              errors.endTime ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-1'
            )}
          />
          {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">
            <Users size={16} className="inline mr-1.5" />
            人数限制
          </label>
          <input
            type="number"
            min={1}
            {...register('maxPeople', { required: '请输入人数限制', min: 1 })}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border transition-colors',
              errors.maxPeople ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-1'
            )}
          />
          {errors.maxPeople && <p className="text-red-500 text-sm mt-1">{errors.maxPeople.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">价格（元）</label>
          <input
            type="number"
            min={0}
            {...register('price', { required: '请输入价格', min: 0 })}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border transition-colors',
              errors.price ? 'border-red-300 focus:ring-red-500' : 'border-sand-200 focus:ring-clay-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-1'
            )}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isTeamBooking"
          {...register('isTeamBooking')}
          className="w-4 h-4 text-clay-600 rounded focus:ring-clay-500"
        />
        <label htmlFor="isTeamBooking" className="text-sm text-sand-700">
          设为团建专场
        </label>
      </div>

      {startTime && endTime && endTime <= startTime && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ 结束时间必须晚于开始时间
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-sand-100">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X size={18} />
          取消
        </Button>
        <Button type="submit">
          {isEditing ? '保存修改' : '创建期次'}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
