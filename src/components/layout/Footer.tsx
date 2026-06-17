import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: '关于我们', path: '/about' },
    { name: '课程中心', path: '/courses' },
    { name: '工坊空间', path: '/workshops' },
    { name: '企业团建', path: '/team-building' },
    { name: '学员作品', path: '/works' },
    { name: '常见问题', path: '/faq' },
  ];

  const contactInfo = [
    { icon: MapPin, text: '上海市静安区南京西路1788号' },
    { icon: Phone, text: '400-888-9999' },
    { icon: Mail, text: 'hello@jiangxingongfang.com' },
    { icon: Clock, text: '周二至周日 10:00-21:00' },
  ];

  return (
    <footer className="bg-gradient-to-b from-sand-100 to-sand-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-clay-400 to-clay-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">匠</span>
              </div>
              <span className="text-xl font-serif font-bold text-clay-700">匠心工坊</span>
            </Link>
            <p className="text-sand-700 text-sm leading-relaxed mb-4">
              匠心工坊致力于传承和发扬传统手工艺，为每一位热爱生活的人提供专业、温馨的手工体验课程。在这里，用双手创造美好，让匠心温暖时光。
            </p>
            <div className="flex gap-3">
              {['微信', '微博', '小红书'].map((platform) => (
                <button
                  key={platform}
                  className="w-9 h-9 bg-clay-500/10 hover:bg-clay-500/20 rounded-full flex items-center justify-center text-clay-600 transition-colors text-xs font-medium"
                >
                  {platform[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-clay-700 mb-4">快速链接</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sand-700 hover:text-clay-600 transition-colors text-sm flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 bg-clay-400 rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-clay-700 mb-4">联系方式</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sand-700 text-sm">
                  <item.icon className="w-4 h-4 text-clay-500 mt-0.5 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-clay-700 mb-4">订阅资讯</h3>
            <p className="text-sand-700 text-sm mb-4">
              订阅我们的 newsletter，获取最新课程和优惠活动信息。
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="flex-1 px-4 py-2 rounded-full bg-white border border-sand-300 text-sm outline-none focus:border-clay-400 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-clay-500 text-white rounded-full hover:bg-clay-600 transition-colors text-sm font-medium"
              >
                订阅
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-sand-300 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sand-600 text-sm">
            © 2024 匠心工坊 Jiangxin Workshop. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-sand-600">
            <Link to="/privacy" className="hover:text-clay-600 transition-colors">
              隐私政策
            </Link>
            <Link to="/terms" className="hover:text-clay-600 transition-colors">
              服务条款
            </Link>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-clay-500 fill-clay-500" /> in Shanghai
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
