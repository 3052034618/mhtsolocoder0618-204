import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import CourseCard from '@/components/home/CourseCard';
import Button from '@/components/common/Button';
import { useCourseStore } from '@/store/useCourseStore';
import type { Course, CourseCategory, DifficultyLevel } from '@/types';

type SortType = 'latest' | 'hottest' | 'price-asc' | 'price-desc';

const CATEGORIES: { id: CourseCategory | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'pottery', label: '陶艺' },
  { id: 'leather', label: '皮具' },
  { id: 'floral', label: '花艺' },
  { id: 'candle', label: '蜡烛' },
  { id: 'other', label: '其他' },
];

const PRICE_RANGES = [
  { id: 'all', label: '不限', min: 0, max: Infinity },
  { id: '0-200', label: '¥200以下', min: 0, max: 200 },
  { id: '200-500', label: '¥200-500', min: 200, max: 500 },
  { id: '500-1000', label: '¥500-1000', min: 500, max: 1000 },
  { id: '1000+', label: '¥1000以上', min: 1000, max: Infinity },
];

const DURATIONS = [
  { id: 'all', label: '不限', min: 0, max: Infinity },
  { id: '0-60', label: '1小时内', min: 0, max: 60 },
  { id: '60-120', label: '1-2小时', min: 60, max: 120 },
  { id: '120-180', label: '2-3小时', min: 120, max: 180 },
  { id: '180+', label: '3小时以上', min: 180, max: Infinity },
];

const AGE_RANGES = [
  { id: 'all', label: '不限', min: 0, max: Infinity },
  { id: '6-12', label: '儿童(6-12岁)', min: 6, max: 12 },
  { id: '12-18', label: '青少年(12-18岁)', min: 12, max: 18 },
  { id: '18+', label: '成人(18岁以上)', min: 18, max: Infinity },
];

const DIFFICULTIES: { id: DifficultyLevel | 'all'; label: string }[] = [
  { id: 'all', label: '不限' },
  { id: 'beginner', label: '入门' },
  { id: 'intermediate', label: '进阶' },
  { id: 'advanced', label: '高级' },
];

const SORT_OPTIONS: { id: SortType; label: string }[] = [
  { id: 'latest', label: '最新发布' },
  { id: 'hottest', label: '最热门' },
  { id: 'price-asc', label: '价格从低到高' },
  { id: 'price-desc', label: '价格从高到低' },
];

export default function CourseList() {
  const { courses, isLoaded, loadMockData } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState<CourseCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [ageRange, setAgeRange] = useState(AGE_RANGES[0]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    if (!isLoaded) {
      loadMockData();
    }
  }, [isLoaded, loadMockData]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.workshopName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    if (category !== 'all') {
      result = result.filter((c) => c.category === category);
    }

    result = result.filter(
      (c) => c.price >= priceRange.min && c.price < priceRange.max
    );

    result = result.filter(
      (c) => c.duration >= duration.min && c.duration < duration.max
    );

    result = result.filter(
      (c) => c.ageRange.min >= ageRange.min && c.ageRange.max <= ageRange.max
    );

    if (difficulty !== 'all') {
      result = result.filter((c) => c.difficulty === difficulty);
    }

    switch (sortBy) {
      case 'latest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'hottest':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [courses, searchQuery, category, priceRange, duration, ageRange, difficulty, sortBy]);

  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, page]);

  const activeFiltersCount = [
    category !== 'all',
    priceRange.id !== 'all',
    duration.id !== 'all',
    ageRange.id !== 'all',
    difficulty !== 'all',
  ].filter(Boolean).length;

  const resetFilters = () => {
    setCategory('all');
    setPriceRange(PRICE_RANGES[0]);
    setDuration(DURATIONS[0]);
    setAgeRange(AGE_RANGES[0]);
    setDifficulty('all');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-pottery mb-2">全部课程</h1>
          <p className="text-sand-500">探索各类手作课程，发现你的创作灵感</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="搜索课程名称、工坊..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand-200 focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all text-sand-700 placeholder:text-sand-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-sand-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-sand-400" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                筛选
                {activeFiltersCount > 0 && (
                  <span className="bg-clay-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortType);
                    setPage(1);
                  }}
                  className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-sand-200 bg-white focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all text-sand-700 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-sand-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">课程分类</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setPage(1);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        category === cat.id
                          ? 'bg-clay-500 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">价格区间</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setPriceRange(range);
                        setPage(1);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        priceRange.id === range.id
                          ? 'bg-clay-500 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">课程时长</label>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((dur) => (
                    <button
                      key={dur.id}
                      onClick={() => {
                        setDuration(dur);
                        setPage(1);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        duration.id === dur.id
                          ? 'bg-clay-500 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      )}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">适合年龄段</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_RANGES.map((age) => (
                    <button
                      key={age.id}
                      onClick={() => {
                        setAgeRange(age);
                        setPage(1);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        ageRange.id === age.id
                          ? 'bg-clay-500 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      )}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">难度等级</label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => {
                        setDifficulty(diff.id);
                        setPage(1);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        difficulty === diff.id
                          ? 'bg-clay-500 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      )}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={resetFilters}>
                    重置筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sand-500">
            共找到 <span className="font-semibold text-clay-600">{filteredCourses.length}</span> 门课程
          </p>
        </div>

        {paginatedCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedCourses.map((course: Course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sand-600 hover:bg-sand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp className="w-5 h-5 rotate-90" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-10 h-10 rounded-xl font-medium transition-colors',
                      page === p
                        ? 'bg-clay-500 text-white'
                        : 'text-sand-600 hover:bg-sand-100'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sand-600 hover:bg-sand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-pottery mb-2">未找到相关课程</h3>
            <p className="text-sand-500 mb-4">试试调整筛选条件或搜索关键词</p>
            <Button onClick={resetFilters}>重置筛选</Button>
          </div>
        )}
      </div>
    </div>
  );
}
