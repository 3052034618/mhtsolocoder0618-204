import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  isToday,
  getDay,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCourseStore } from '@/store/useCourseStore';
import type { Session } from '@/types';

interface SessionCalendarProps {
  courseId: string;
  selectedSession: Session | null;
  onSelectSession: (session: Session) => void;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function SessionCalendar({
  courseId,
  selectedSession,
  onSelectSession,
}: SessionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { getSessionsByCourse } = useCourseStore();

  const sessions = useMemo(
    () => getSessionsByCourse(courseId),
    [courseId, getSessionsByCourse]
  );

  const calendarDays = useMemo(() => {
    const startDate = startOfWeek(startOfMonth(currentMonth), { locale: zhCN });
    const endDate = endOfWeek(endOfMonth(currentMonth), { locale: zhCN });
    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getSessionsByDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return sessions.filter((s) => s.date === dateStr);
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(date, today)) return false;
    return getSessionsByDate(date).length > 0;
  };

  const isDateFull = (date: Date) => {
    const daySessions = getSessionsByDate(date);
    return daySessions.length > 0 && daySessions.every((s) => s.currentPeople >= s.maxPeople);
  };

  const getDateInfo = (date: Date) => {
    const daySessions = getSessionsByDate(date);
    if (daySessions.length === 0) return null;
    const minPrice = Math.min(...daySessions.map((s) => s.price));
    const totalSpots = daySessions.reduce((sum, s) => sum + (s.maxPeople - s.currentPeople), 0);
    return { minPrice, totalSpots };
  };

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date) || isDateFull(date)) return;
    setSelectedDate(date);
  };

  const selectedDateSessions = selectedDate ? getSessionsByDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-3xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-sand-100 text-sand-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-xl font-semibold text-sand-900 font-serif">
          {format(currentMonth, 'yyyy年MM月', { locale: zhCN })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-sand-100 text-sand-600 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-sand-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isPast = isBefore(day, new Date()) && !isToday(day);
          const available = isDateAvailable(day);
          const isFull = isDateFull(day);
          const dateInfo = getDateInfo(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(day)}
              disabled={!available || isFull || isPast}
              className={cn(
                'relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-200',
                !isCurrentMonth && 'opacity-30',
                isPast && 'opacity-30 cursor-not-allowed',
                available && !isFull && !isPast && 'hover:bg-clay-50 cursor-pointer',
                isFull && 'bg-sand-100 cursor-not-allowed',
                isSelected && 'bg-clay-500 text-white hover:bg-clay-600',
                !isSelected && !isFull && available && !isPast && isWeekend && 'text-clay-600'
              )}
            >
              <span className={cn('text-sm font-medium', isToday(day) && !isSelected && 'text-clay-600 font-bold')}>
                {format(day, 'd')}
              </span>
              {available && !isFull && dateInfo && !isSelected && (
                <>
                  <span className="text-xs text-clay-600 font-medium mt-1">¥{dateInfo.minPrice}</span>
                  <span className="text-xs text-sand-400">余{dateInfo.totalSpots}</span>
                </>
              )}
              {isFull && <span className="text-xs text-sand-400 mt-1">约满</span>}
              {isToday(day) && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-clay-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDateSessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-sand-700">
            {format(selectedDate!, 'MM月dd日 EEEE', { locale: zhCN })} 可预约时段
          </h4>
          <div className="grid gap-3">
            {selectedDateSessions.map((session) => {
              const isFull = session.currentPeople >= session.maxPeople;
              const isSelected = selectedSession?.id === session.id;
              return (
                <button
                  key={session.id}
                  onClick={() => !isFull && onSelectSession(session)}
                  disabled={isFull}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200',
                    isFull && 'bg-sand-50 border-sand-100 cursor-not-allowed opacity-60',
                    !isFull && !isSelected && 'border-sand-200 hover:border-clay-300 hover:bg-clay-50',
                    isSelected && 'border-clay-500 bg-clay-50'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        isSelected ? 'bg-clay-500 text-white' : 'bg-sand-100 text-sand-600'
                      )}
                    >
                      <Clock size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sand-900">
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-sand-500">
                        <Users size={14} />
                        <span>{session.maxPeople - session.currentPeople}/{session.maxPeople}人可约</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-clay-600">¥{session.price}</div>
                    {isFull && <span className="text-sm text-sand-400">已满</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionCalendar;
