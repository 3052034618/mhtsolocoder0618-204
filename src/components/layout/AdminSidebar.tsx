import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  QrCode,
  Layers,
  Users,
  ChevronLeft,
  ChevronRight,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { name: '仪表盘', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: '课程管理', path: '/admin/courses', icon: BookOpen },
    { name: '期次管理', path: '/admin/sessions', icon: Calendar },
    { name: '签到管理', path: '/admin/checkin', icon: QrCode },
    { name: '系列课程', path: '/admin/series', icon: Layers },
    { name: '团建专场', path: '/admin/team-building', icon: Users },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-gradient-to-b from-sand-800 to-sand-900 text-white transition-all duration-300 z-40',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div
          className={cn(
            'flex items-center gap-3 h-16 border-b border-sand-700/50 px-4',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-clay-400 to-clay-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Palette className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-serif font-bold text-lg">管理后台</h1>
              <p className="text-xs text-sand-400">匠心工坊</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-clay-500 text-white shadow-lg shadow-clay-500/30'
                        : 'text-sand-300 hover:bg-sand-700/50 hover:text-white',
                      isCollapsed && 'justify-center px-0'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-sand-700/50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sand-400 hover:bg-sand-700/50 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">收起菜单</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
