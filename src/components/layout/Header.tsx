import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Settings, Heart } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isLoggedIn, currentUser, logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '课程', path: '/courses' },
    { name: '工坊', path: '/workshops' },
    { name: '企业团建', path: '/team-building' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-gradient-to-b from-sand-50/80 to-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-clay-400 to-clay-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">匠</span>
            </div>
            <span className="text-xl font-serif font-bold text-clay-700 hidden sm:block">
              匠心工坊
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sand-700 hover:text-clay-600 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center bg-sand-100 rounded-full px-4 py-2 w-48 lg:w-64 focus-within:ring-2 focus-within:ring-clay-400 transition-all"
            >
              <Search className="w-4 h-4 text-sand-500 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索课程..."
                className="bg-transparent outline-none text-sm w-full text-sand-800 placeholder:text-sand-400"
              />
            </form>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-sand-100 transition-colors"
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-clay-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-clay-500 text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-sand-200 animate-fade-in">
                    <div className="px-4 py-2 border-b border-sand-100">
                      <p className="font-medium text-sand-800">{currentUser?.name}</p>
                      <p className="text-xs text-sand-500">{currentUser?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-sand-700 hover:bg-sand-50"
                    >
                      <Settings className="w-4 h-4" />
                      个人中心
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-sand-700 hover:bg-sand-50"
                    >
                      <Heart className="w-4 h-4" />
                      我的收藏
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-clay-600 hover:bg-clay-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-clay-600 hover:text-clay-700 font-medium"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-clay-500 text-white rounded-full hover:bg-clay-600 transition-colors font-medium"
                >
                  注册
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-sand-700 hover:bg-sand-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-sand-200 animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="flex items-center bg-sand-100 rounded-full px-4 py-2 mb-4">
              <Search className="w-4 h-4 text-sand-500 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索课程..."
                className="bg-transparent outline-none text-sm w-full text-sand-800 placeholder:text-sand-400"
              />
            </form>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sand-700 hover:bg-sand-50 rounded-lg font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            {!isLoggedIn && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-sand-100">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-clay-600 border border-clay-500 rounded-full font-medium"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center bg-clay-500 text-white rounded-full font-medium"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
