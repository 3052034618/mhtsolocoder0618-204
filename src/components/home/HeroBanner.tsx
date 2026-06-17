import { useState } from 'react';
import { Search, Flame, UtensilsCrossed, Flower2, Lamp } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { name: '陶艺', icon: UtensilsCrossed, color: 'bg-pottery' },
  { name: '皮具', icon: Flame, color: 'bg-sand-500' },
  { name: '花艺', icon: Flower2, color: 'bg-floral' },
  { name: '蜡烛', icon: Lamp, color: 'bg-candle' },
];

export default function HeroBanner() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('搜索:', searchQuery);
    }
  };

  const handleCategoryClick = (category: string) => {
    console.log('分类:', category);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-clay-50 via-sand-50 to-floral/20 bg-texture">
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
      
      <div className="container relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-pottery mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            发现手工的温度
          </h1>
          
          <p 
            className="text-lg md:text-xl text-sand-600 mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            陶艺 · 皮具 · 花艺 · 蜡烛，亲手创造独一无二的美好
          </p>
          
          <form 
            onSubmit={handleSearch}
            className="relative max-w-xl mx-auto mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索课程或工坊..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border border-sand-200 shadow-card focus:border-clay-400 focus:ring-4 focus:ring-clay-100 outline-none transition-all duration-300 text-sand-700 placeholder:text-sand-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2.5 px-6"
              >
                搜索
              </button>
            </div>
          </form>
          
          <div 
            className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-sand-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 group',
                    'opacity-0 animate-fade-in-up'
                  )}
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <span className={cn('w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110', category.color)}>
                    <Icon className="w-4 h-4 text-white" />
                  </span>
                  <span className="font-medium text-pottery">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-sand-50 to-transparent" />
    </section>
  );
}
