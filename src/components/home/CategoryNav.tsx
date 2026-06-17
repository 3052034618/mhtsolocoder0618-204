import { UtensilsCrossed, Flame, Flower2, Lamp, TreeDeciduous, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCourseStore } from '@/store/useCourseStore';

const categories = [
  {
    id: 'pottery',
    name: '陶艺',
    icon: UtensilsCrossed,
    description: '揉泥拉坯，感受泥土的温度',
    gradient: 'from-amber-100 to-orange-100',
    iconBg: 'bg-pottery',
  },
  {
    id: 'leather',
    name: '皮具',
    icon: Flame,
    description: '一针一线，缝制专属质感',
    gradient: 'from-amber-50 to-yellow-100',
    iconBg: 'bg-sand-500',
  },
  {
    id: 'floral',
    name: '花艺',
    icon: Flower2,
    description: '拈花一笑，定格美好瞬间',
    gradient: 'from-pink-50 to-rose-100',
    iconBg: 'bg-floral',
  },
  {
    id: 'candle',
    name: '蜡烛',
    icon: Lamp,
    description: '香氛萦绕，营造温馨氛围',
    gradient: 'from-orange-50 to-amber-100',
    iconBg: 'bg-candle',
  },
  {
    id: 'wood',
    name: '木作',
    icon: TreeDeciduous,
    description: '刨花飞舞，雕琢原木之美',
    gradient: 'from-green-50 to-emerald-100',
    iconBg: 'bg-forest-500',
  },
  {
    id: 'other',
    name: '其他',
    icon: Sparkles,
    description: '更多惊喜，等你发现',
    gradient: 'from-purple-50 to-violet-100',
    iconBg: 'bg-purple-400',
  },
];

export default function CategoryNav() {
  const { getCoursesByCategory } = useCourseStore();

  const handleCategoryClick = (categoryId: string) => {
    const courses = getCoursesByCategory(categoryId);
    console.log('分类课程:', categoryId, courses);
  };

  return (
    <section className="py-16 bg-sand-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pottery mb-3">
            探索手作世界
          </h2>
          <p className="text-sand-500">选择你感兴趣的领域，开启创作之旅</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  'group relative p-6 rounded-2xl bg-gradient-to-br',
                  category.gradient,
                  'border border-white/50 shadow-soft',
                  'hover:shadow-hover hover:-translate-y-2 transition-all duration-300',
                  'text-left overflow-hidden'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
                    category.iconBg,
                    'shadow-md group-hover:scale-110 transition-transform duration-300'
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-pottery mb-1 group-hover:text-clay-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-sand-500 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
