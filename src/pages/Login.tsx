import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Smartphone,
  MessageCircle,
  LogIn,
  Eye,
  EyeOff,
  Share2,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import Card, { CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';

type LoginMethod = 'password' | 'code';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUserStore();
  const [method, setMethod] = useState<LoginMethod>('password');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  if (isLoggedIn) {
    navigate('/user', { replace: true });
  }

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginEmail = method === 'password' ? email : `${phone}@example.com`;
    const loginPassword = method === 'password' ? password : code;

    const success = await login(loginEmail, loginPassword);
    setLoading(false);

    if (success) {
      navigate('/user', { replace: true });
    }
  };

  const handleThirdPartyLogin = (provider: string) => {
    alert(`${provider} 登录功能开发中...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-clay-50 to-sand-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-clay-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-sand-900 mb-2">欢迎回来</h1>
          <p className="text-sand-600">登录你的账号，开启手工创作之旅</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex mb-6 bg-sand-100 rounded-xl p-1">
              <button
                onClick={() => setMethod('password')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  method === 'password'
                    ? 'bg-white text-clay-600 shadow-sm'
                    : 'text-sand-500 hover:text-sand-700'
                }`}
              >
                密码登录
              </button>
              <button
                onClick={() => setMethod('code')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  method === 'code'
                    ? 'bg-white text-clay-600 shadow-sm'
                    : 'text-sand-500 hover:text-sand-700'
                }`}
              >
                验证码登录
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {method === 'password' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">
                      邮箱/手机号
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="请输入邮箱或手机号"
                        className="w-full pl-12 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">密码</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        className="w-full pl-12 pr-12 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-sand-300 text-clay-500 focus:ring-clay-500" />
                      <span className="text-sand-600">记住我</span>
                    </label>
                    <a href="#" className="text-clay-500 hover:text-clay-600">
                      忘记密码？
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">手机号</label>
                    <div className="relative">
                      <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="请输入手机号"
                        maxLength={11}
                        className="w-full pl-12 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">验证码</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <MessageCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400" />
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="请输入验证码"
                          maxLength={6}
                          className="w-full pl-12 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={countdown > 0 || !phone || phone.length !== 11}
                        className="px-5 py-3 bg-sand-100 text-clay-600 rounded-xl font-medium hover:bg-sand-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={
                  (method === 'password' && (!email || !password)) ||
                  (method === 'code' && (!phone || !code))
                }
              >
                <LogIn size={18} />
                登录
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sand-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-sand-500">其他登录方式</span>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleThirdPartyLogin('微信')}
                className="w-14 h-14 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center hover:bg-forest-100 transition-colors"
              >
                <MessageCircle size={28} />
              </button>
              <button
                onClick={() => handleThirdPartyLogin('微博')}
                className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors"
              >
                <Share2 size={28} />
              </button>
            </div>

            <p className="text-center text-sand-600 mt-8">
              还没有账号？
              <Link to="/register" className="text-clay-500 font-medium hover:text-clay-600 ml-1">
                立即注册
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
