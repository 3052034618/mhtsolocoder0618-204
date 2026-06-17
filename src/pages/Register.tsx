import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Smartphone,
  MessageCircle,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Building2,
  Factory,
  GraduationCap,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import Card, { CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';
import type { UserRole } from '@/store/useUserStore';

const roles = [
  { key: 'student' as UserRole, label: '学员', icon: GraduationCap, desc: '学习手工课程，体验创作乐趣' },
  { key: 'teacher' as UserRole, label: '工坊管理员', icon: Building2, desc: '管理工坊，发布课程和活动' },
  { key: 'admin' as UserRole, label: '企业用户', icon: Factory, desc: '企业团建、团体定制服务' },
] as const;

export default function Register() {
  const navigate = useNavigate();
  const { register, updateUser, isLoggedIn } = useUserStore();
  const [step, setStep] = useState<'role' | 'info'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

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

  const validateForm = () => {
    setError('');
    if (!nickname.trim()) {
      setError('请输入昵称');
      return false;
    }
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return false;
    }
    if (!code || code.length !== 6) {
      setError('请输入6位验证码');
      return false;
    }
    if (!password || password.length < 6) {
      setError('密码长度不能少于6位');
      return false;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedRole) return;

    setLoading(true);
    const success = await register({
      name: nickname,
      email: `${phone}@example.com`,
      phone,
      password,
    });

    if (success) {
      updateUser({ role: selectedRole });
      setLoading(false);
      navigate('/user', { replace: true });
    } else {
      setLoading(false);
      setError('注册失败，请重试');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setTimeout(() => setStep('info'), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-clay-50 to-sand-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-clay-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-sand-900 mb-2">
            {step === 'role' ? '选择身份' : '完善信息'}
          </h1>
          <p className="text-sand-600">
            {step === 'role' ? '选择适合你的身份，开启手工创作之旅' : '请填写以下信息完成注册'}
          </p>
        </div>

        {step === 'role' ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.key}
                    onClick={() => handleRoleSelect(role.key)}
                    className="w-full p-4 border-2 border-sand-200 rounded-xl text-left hover:border-clay-500 hover:bg-clay-50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sand-100 group-hover:bg-clay-100 flex items-center justify-center transition-colors">
                        <role.icon size={24} className="text-sand-500 group-hover:text-clay-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sand-900 group-hover:text-clay-600 mb-1">
                          {role.label}
                        </h3>
                        <p className="text-sm text-sand-500">{role.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center text-sand-600 mt-8">
                已有账号？
                <Link to="/login" className="text-clay-500 font-medium hover:text-clay-600 ml-1">
                  去登录
                </Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStep('role')}
                  className="p-2 -ml-2 rounded-lg hover:bg-sand-100 text-sand-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-clay-500 text-white flex items-center justify-center text-sm font-medium">
                    {selectedRole && roles.find((r) => r.key === selectedRole)?.icon && (
                      <span className="w-4 h-4">
                        {React.createElement(roles.find((r) => r.key === selectedRole)!.icon, { size: 18 })}
                      </span>
                    )}
                  </div>
                  <span className="text-sand-700">
                    {selectedRole && roles.find((r) => r.key === selectedRole)?.label}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">昵称</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400" />
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="请输入昵称"
                      className="w-full pl-12 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">密码</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请设置密码（至少6位）"
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

                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">确认密码</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="请再次输入密码"
                      className="w-full pl-12 pr-12 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-clay-500 text-sm text-center">{error}</div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  disabled={!nickname || !phone || !code || !password || !confirmPassword}
                >
                  <UserPlus size={18} />
                  注册
                </Button>
              </form>

              <p className="text-center text-sand-600 mt-8">
                已有账号？
                <Link to="/login" className="text-clay-500 font-medium hover:text-clay-600 ml-1">
                  去登录
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
