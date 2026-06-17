import { useEffect, useMemo } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryNav from '@/components/home/CategoryNav';
import CourseCard from '@/components/home/CourseCard';
import ReviewWall from '@/components/home/ReviewWall';
import Button from '@/components/common/Button';
import { useCourseStore } from '@/store/useCourseStore';
import type { Course, Workshop } from '@/types';

export default function Home() {
  const { courses, workshops, isLoaded, loadMockData, getFeaturedCourses } = useCourseStore();

  useEffect(() => {
    if (!isLoaded) {
      loadMockData();
    }
  }, [isLoaded, loadMockData]);

  const featuredCourses = useMemo(() => getFeaturedCourses().slice(0, 6), [getFeaturedCourses]);
  const hotWorkshops = useMemo(() => [...workshops].sort((a, b) => b.rating - a.rating).slice(0, 3), [workshops]);

  return (
    <div className="min-h-screen bg-sand-50">
      <HeroBanner />
      <CategoryNav />

      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-10 opacity-0 animate-fade-in-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-pottery mb-2">精选课程</h2>
              <p className="text-sand-500">高评分优质课程，不容错过</p>
            </div>
            <Button variant="ghost" className="hidden md:flex items-center gap-2">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course: Course, index: number) => (
              <div
                key={course.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {featuredCourses.length === 0 && (
            <div className="text-center py-12 text-sand-400">
              暂无精选课程
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-sand-50 to-white">
        <div className="container">
          <div className="flex items-end justify-between mb-10 opacity-0 animate-fade-in-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-pottery mb-2">热门工坊</h2>
              <p className="text-sand-500">发现身边优秀的手作工坊</p>
            </div>
            <Button variant="ghost" className="hidden md:flex items-center gap-2">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotWorkshops.map((workshop: Workshop, index: number) => (
              <div
                key={workshop.id}
                className="opacity-0 animate-fade-in-up card card-hover cursor-pointer group overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={workshop.coverImage}
                    alt={workshop.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white mb-1">{workshop.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{workshop.address}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 font-semibold">{workshop.rating}</span>
                      <span className="text-sand-400 text-sm">({workshop.reviewCount}条评价)</span>
                    </div>
                    <Button variant="outline" size="sm">
                      进入工坊
                    </Button>
                  </div>
                  <p className="text-sand-500 text-sm line-clamp-2">{workshop.description}</p>
                </div>
              </div>
            ))}
          </div>

          {hotWorkshops.length === 0 && (
            <div className="text-center py-12 text-sand-400">
              暂无工坊信息
            </div>
          )}
        </div>
      </section>

      <ReviewWall />

      <section className="py-20 bg-gradient-to-br from-clay-500 to-pottery">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 opacity-0 animate-fade-in-up">
            开启你的手作之旅
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            加入我们，用双手创造独一无二的美好，感受手工艺术的魅力
          </p>
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Button variant="secondary" size="lg">
              浏览课程
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
              企业团建
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}