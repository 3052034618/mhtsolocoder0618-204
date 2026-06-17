import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Clock, Users, Minus, Plus, CreditCard, Wallet, Smartphone, LogIn, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useCourseStore } from '@/store/useCourseStore';
import { useBookingStore } from '@/store/useBookingStore';
import { useUserStore } from '@/store/useUserStore';
import type { Session } from '@/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  session: Session | null;
  onSuccess?: () => void;
}

type PaymentMethod = 'wechat' | 'alipay' | 'card';

const PAYMENT_METHODS = [
  { id: 'wechat' as PaymentMethod, label: '微信支付', icon: Wallet, color: 'text-green-500' },
  { id: 'alipay' as PaymentMethod, label: '支付宝', icon: Smartphone, color: 'text-blue-500' },
  { id: 'card' as PaymentMethod, label: '银行卡', icon: CreditCard, color: 'text-purple-500' },
];

function BookingModal({ isOpen, onClose, courseId, session, onSuccess }: BookingModalProps) {
  const navigate = useNavigate();
  const [peopleCount, setPeopleCount] = useState(1);
  const [attendeeNames, setAttendeeNames] = useState<string[]>(['']);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getCourseById } = useCourseStore();
  const { addBooking, getSessionBookedCount, bookings } = useBookingStore();
  const { currentUser, isLoggedIn } = useUserStore();

  const course = useMemo(() => getCourseById(courseId), [courseId, getCourseById]);

  const bookedCount = useMemo(() => {
    if (!session) return 0;
    return getSessionBookedCount(session.id);
  }, [session, getSessionBookedCount, bookings]);

  const remainingSpots = useMemo(() => {
    if (!session) return 0;
    return Math.max(0, session.maxPeople - session.currentPeople - bookedCount);
  }, [session, bookedCount]);

  const totalPrice = useMemo(() => (session ? session.price * peopleCount : 0), [session, peopleCount]);

  const isFull = remainingSpots <= 0;
  const isExceeding = peopleCount > remainingSpots;

  const handlePeopleChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(remainingSpots, peopleCount + delta));
    setPeopleCount(newCount);
    setAttendeeNames((prev) =>
      newCount > prev.length
        ? [...prev, ...Array(newCount - prev.length).fill('')]
        : prev.slice(0, newCount)
    );
  };

  const handleNameChange = (index: number, value: string) => {
    setAttendeeNames((prev) => {
      const newNames = [...prev];
      newNames[index] = value;
      return newNames;
    });
  };

  const handleSubmit = async () => {
    if (!session || !course || !currentUser) return;

    const validNames = attendeeNames.filter((name) => name.trim());
    if (validNames.length !== peopleCount) {
      alert('请填写所有参与人的姓名');
      return;
    }

    setIsSubmitting(true);
    try {
      addBooking({
        userId: currentUser.id,
        courseId: course.id,
        sessionId: session.id,
        peopleCount: attendeeNames.length,
        totalPrice,
        attendeeNames,
        courseName: course.title,
        workshopId: course.workshopId,
        workshopName: course.workshopName,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        sessionDate: session.date,
        sessionTime: `${session.startTime}-${session.endTime}`,
        notes: `参与人: ${attendeeNames.join(', ')}`,
      });
      setIsSubmitting(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      alert('提交失败，请重试');
    }
  };

  if (!session || !course) return null;

  const sessionDate = new Date(session.date);

  if (!isLoggedIn) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="确认报名" size="md">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-clay-100 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-clay-600" />
          </div>
          <h3 className="text-xl font-bold text-sand-900 mb-2">请先登录</h3>
          <p className="text-sand-500 mb-6">报名课程需要登录账号，登录后即可继续报名</p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={onClose}>稍后再说</Button>
            <Button onClick={() => { onClose(); navigate('/login'); }}>
              <LogIn size={16} /> 去登录
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (isFull) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="确认报名" size="md">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-sand-900 mb-2">名额已满</h3>
          <p className="text-sand-500 mb-6">该期次报名人数已达上限，请选择其他期次</p>
          <Button variant="ghost" onClick={onClose}>返回选择其他期次</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="确认报名" size="lg">
      <div className="space-y-6">
        <div className="bg-sand-50 rounded-2xl p-4 space-y-3">
          <h4 className="font-semibold text-sand-900 font-serif">{course.title}</h4>
          <div className="flex flex-wrap gap-4 text-sm text-sand-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-clay-500" />
              <span>{format(sessionDate, 'MM月dd日 EEEE', { locale: zhCN })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-clay-500" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-clay-500" />
              <span className={remainingSpots <= 3 ? 'text-amber-600 font-medium' : ''}>
                剩余 {remainingSpots} 个名额
              </span>
            </div>
          </div>
          <div className="text-xl font-bold text-clay-600">¥{session.price} / 人</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-3">参与人数</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePeopleChange(-1)}
              disabled={peopleCount <= 1}
              className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-sand-600 hover:bg-sand-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="w-16 text-center text-2xl font-bold text-sand-900">{peopleCount}</span>
            <button
              onClick={() => handlePeopleChange(1)}
              disabled={peopleCount >= remainingSpots}
              className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-sand-600 hover:bg-sand-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={18} />
            </button>
            <span className="text-sm text-sand-500">最多{remainingSpots}人</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-sand-700">参与人姓名</label>
          <div className="grid gap-3">
            {attendeeNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`请输入第 ${index + 1} 位参与人的姓名`}
                className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-clay-500 focus:outline-none transition-colors"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-700 mb-3">支付方式</label>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  paymentMethod === method.id
                    ? 'border-clay-500 bg-clay-50'
                    : 'border-sand-200 hover:border-sand-300'
                )}
              >
                <method.icon size={24} className={method.color} />
                <span className="text-sm font-medium text-sand-700">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-sand-100 pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sand-600">{session.price} × {peopleCount} 人</span>
            <span className="text-2xl font-bold text-clay-600">¥{totalPrice}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isExceeding}
          >
            确认支付 ¥{totalPrice}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default BookingModal;
