import { useState, useEffect, useMemo } from 'react';
import { Users, Award, Clock, HandHeart, Building2, Phone, Calendar, MessageSquare, CheckCircle, Sparkles, UtensilsCrossed, Flame, Flower2, Lamp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import CourseCard from '@/components/home/CourseCard';
import Button from '@/components/common/Button';
import { useCourseStore } from '@/store/useCourseStore';
import { useTeamBookingStore } from '@/store/useTeamBookingStore';
import { useUserStore } from '@/store/useUserStore';
import type { Course } from '@/types';

interface TeamBookingForm {
  enterpriseName: string;
  contactName: string;
  contactPhone: string;
  peopleCount: number;
  expectedDate: string;
  requirements: string;
  courseId: string;
}

const ADVANTAGES = [
  { icon: Users, title: '专属定制', desc: '根据企业需求量身定制课程内容和形式' },
  { icon: Award, title: '专业师资', desc: '资深手作老师全程指导，确保体验质量' },
  { icon: Clock, title: '灵活时间', desc: '可根据企业日程安排课程时间' },
  { icon: HandHeart, title: '贴心服务', desc: '提供专属客服，全程无忧服务' },
];

const CATEGORY_ICONS: Record<string, any> = {
  pottery: UtensilsCrossed,
  leather: Flame,
  floral: Flower2,
  candle: Lamp,
  other: Sparkles,
};

const CATEGORY_NAMES: Record<string, string> = {
  pottery: '陶艺',
  leather: '皮具',
  floral: '花艺',
  candle: '蜡烛',
  other: '其他',
};

export default function TeamBooking() {
  const { courses, isLoaded, loadMockData } = useCourseStore();
  const { addTeamBooking } = useTeamBookingStore();
  const { currentUser } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TeamBookingForm>({
    defaultValues: {
      enterpriseName: '',
      contactName: '',
      contactPhone: '',
      peopleCount: 10,
      expectedDate: '',
      requirements: '',
      courseId: '',
    },
  });

  const watchCourseId = watch('courseId');

  useEffect(() => {
    if (!isLoaded) {
      loadMockData();
    }
  }, [isLoaded, loadMockData]);

  useEffect(() => {
    if (selectedCourse) {
      setValue('courseId', selectedCourse);
    }
  }, [selectedCourse, setValue]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'all') {
      return courses;
    }
    return courses.filter((c: Course) => c.category === selectedCategory);
  }, [courses, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(courses.map((c: Course) => c.category));
    return ['all', ...Array.from(cats)];
  }, [courses]);

  const selectedCourseData = useMemo(() => {
    return courses.find((c: Course) => c.id === watchCourseId);
  }, [courses, watchCourseId]);

  const calculatePrice = () => {
    if (!selectedCourseData || !watch('peopleCount')) return 0;
    const basePrice = selectedCourseData.price * watch('peopleCount');
    const teamDiscount = watch('peopleCount') >= 20 ? 0.85 : watch('peopleCount') >= 10 ? 0.9 : 1;
    return Math.round(basePrice * teamDiscount);
  };

  const onSubmit = async (data: TeamBookingForm) => {
    if (!selectedCourseData) {
      alert('请选择团建课程');
      return;
    }

    setIsSubmitting(true);
    try {
      addTeamBooking({
        userId: currentUser?.id || 'team-booking',
        enterpriseName: data.enterpriseName,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        courseId: data.courseId,
        courseName: selectedCourseData.title,
        sessionId: `team-session-${crypto.randomUUID()}`,
        peopleCount: data.peopleCount,
        totalPrice: calculatePrice(),
        requirements: `期望日期: ${data.expectedDate}\n特殊需求: ${data.requirements}`,
        materialPackageConfig: [],
        workshopId: selectedCourseData.workshopId,
        workshopName: selectedCourseData.workshopName,
      });

      setIsSubmitting(false);
      setShowSuccess(true);
      reset();
      setSelectedCourse('');
      setSelectedCategory('all');
    } catch (error) {
      setIsSubmitting(false);
      alert('提交失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="relative bg-gradient-to-br from-clay-500 to-pottery py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white" />
        </div>
        <div className="container relative text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 opacity-0 animate-fade-in-up">
            企业团建定制
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            为您的团队打造独一无二的手作体验，增进团队凝聚力，释放创意灵感
          </p>
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-white">
              <Users className="w-4 h-4" />
              <span>已服务500+企业</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-white">
              <Award className="w-4 h-4" />
              <span>满意度98%</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-white">
              <Sparkles className="w-4 h-4" />
              <span>10000+学员参与</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-pottery mb-3">为什么选择我们</h2>
            <p className="text-sand-500">专业的团建服务，为您的团队带来全新体验</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="card card-hover text-center p-6 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-clay-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-clay-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-pottery mb-2">{item.title}</h3>
                  <p className="text-sand-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-sand-50">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-pottery mb-3">选择团建课程</h2>
            <p className="text-sand-500">挑选适合您团队的手作课程</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Sparkles;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all',
                    selectedCategory === cat
                      ? 'bg-clay-500 text-white shadow-md'
                      : 'bg-white text-sand-600 hover:bg-sand-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat === 'all' ? '全部' : CATEGORY_NAMES[cat] || cat}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCourses.map((course: Course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedCourse === course.id && 'ring-4 ring-clay-300 rounded-3xl'
                )}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {selectedCourseData && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-soft p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sand-900">已选择课程</h3>
                  <p className="text-sand-600">{selectedCourseData.title}</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-soft p-6 md:p-8">
            <h2 className="text-2xl font-bold text-pottery mb-6">填写预订信息</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  企业名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('enterpriseName', { required: '请输入企业名称' })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all"
                  placeholder="请输入企业全称"
                />
                {errors.enterpriseName && (
                  <p className="text-red-500 text-sm mt-1">{errors.enterpriseName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">
                    <span className="text-red-500">*</span> 联系人
                  </label>
                  <input
                    type="text"
                    {...register('contactName', { required: '请输入联系人姓名' })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all"
                    placeholder="请输入联系人姓名"
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('contactPhone', {
                      required: '请输入联系电话',
                      pattern: {
                        value: /^1[3-9]\d{9}$/,
                        message: '请输入正确的手机号',
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all"
                    placeholder="请输入联系电话"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    参与人数 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    {...register('peopleCount', {
                      required: '请输入参与人数',
                      min: { value: 5, message: '至少5人起订' },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all"
                    placeholder="请输入参与人数"
                  />
                  {errors.peopleCount && (
                    <p className="text-red-500 text-sm mt-1">{errors.peopleCount.message}</p>
                  )}
                  <p className="text-xs text-sand-400 mt-1">
                    {watch('peopleCount') >= 20
                      ? '20人以上享85折优惠'
                      : watch('peopleCount') >= 10
                      ? '10人以上享9折优惠'
                      : '10人以上享9折，20人以上享85折'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    期望日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('expectedDate', { required: '请选择期望日期' })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.expectedDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expectedDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  特殊需求
                </label>
                <textarea
                  rows={4}
                  {...register('requirements')}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all resize-none"
                  placeholder="如有特殊需求，请在此说明（如定制课程内容、预算范围等）"
                />
              </div>

              {selectedCourseData && (
                <div className="bg-sand-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sand-600">预估总价</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-clay-600">¥{calculatePrice()}</span>
                      {watch('peopleCount') >= 10 && (
                        <p className="text-xs text-green-600 mt-1">
                          已享{watch('peopleCount') >= 20 ? '85' : '9'}折优惠
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isSubmitting}
                disabled={!selectedCourseData}
              >
                {selectedCourseData ? '提交预订申请' : '请先选择课程'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-pottery mb-3">提交成功！</h3>
            <p className="text-sand-500 mb-6">
              我们的专属客服将在24小时内与您联系，请保持手机畅通
            </p>
            <Button onClick={() => setShowSuccess(false)}>我知道了</Button>
          </div>
        </div>
      )}
    </div>
  );
}
