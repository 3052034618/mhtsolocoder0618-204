import { NavLink } from 'react-router-dom';
import { Home, BookOpen, ShoppingBag, Image, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MobileNav() {
  const tabs: TabItem[] = [
    { name: '首页', path: '/', icon: Home },
    { name: '课程', path: '/courses', icon: BookOpen },
    { name: '订单', path: '/orders', icon: ShoppingBag },
    { name: '作品', path: '/works', icon: Image },
    { name: '我的', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sand-200 z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                isActive ? 'text-clay-600' : 'text-sand-500'
              )
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon
                  className={cn(
                    'w-5 h-5 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium transition-all',
                    isActive && 'text-clay-600'
                  )}
                >
                  {tab.name}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-clay-500 rounded-b-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
