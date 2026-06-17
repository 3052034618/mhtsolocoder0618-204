import { useMemo } from 'react';
import { Shirt, Gem, Briefcase, Shield, RefreshCw, Info } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';

interface NoticePanelProps {
  courseId: string;
}

const NOTICE_ITEMS = [
  {
    icon: Shirt,
    title: '穿着建议',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    items: ['建议穿着旧衣服或不怕脏的衣物', '避免佩戴贵重首饰，以免损坏或丢失'],
  },
  {
    icon: Briefcase,
    title: '工具携带',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    items: ['无需携带任何工具', '工坊将提供所有必要的材料和设备'],
  },
  {
    icon: Shield,
    title: '安全提示',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    items: ['请全程听从老师指导', '注意高温设备，小心烫伤', '操作设备时请保持专注'],
  },
  {
    icon: RefreshCw,
    title: '退款政策',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    items: ['提前24小时可全额退款', '24小时内取消将收取50%费用', '课程开始后不予退款'],
  },
];

function NoticePanel({ courseId }: NoticePanelProps) {
  const { getCourseById } = useCourseStore();

  const course = useMemo(
    () => getCourseById(courseId),
    [courseId, getCourseById]
  );

  return (
    <div className="bg-white rounded-3xl shadow-soft p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-clay-100 flex items-center justify-center">
          <Info size={20} className="text-clay-600" />
        </div>
        <h3 className="text-xl font-semibold text-sand-900 font-serif">
          报名须知
        </h3>
      </div>

      {course?.notice && course.notice.length > 0 && (
        <div className="mb-6 p-4 bg-clay-50 rounded-2xl">
          <h4 className="font-medium text-clay-800 mb-2">课程特别说明</h4>
          <ul className="space-y-1">
            {course.notice.map((item, idx) => (
              <li key={idx} className="text-sm text-clay-700 flex items-start gap-2">
                <span className="text-clay-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4">
        {NOTICE_ITEMS.map((notice) => (
          <div
            key={notice.title}
            className="flex gap-4 p-4 rounded-2xl hover:bg-sand-50 transition-colors"
          >
            <div
              className={`w-12 h-12 rounded-xl ${notice.bgColor} flex items-center justify-center flex-shrink-0`}
            >
              <notice.icon size={22} className={notice.color} />
            </div>
            <div>
              <h4 className="font-semibold text-sand-900 mb-2">
                {notice.title}
              </h4>
              <ul className="space-y-1">
                {notice.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-sand-600 flex items-start gap-2"
                  >
                    <span className="text-sand-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoticePanel;
