import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { SaduDivider } from '../components/SaduPattern';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage = ({ isLogin = true }) => {
  const { isHeritage, darkMode, themeColors, hasSelectedTheme } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const isArabic = language === 'ar';
  
  // Use heritage theme defaults if no theme selected
  const effectiveIsHeritage = hasSelectedTheme ? isHeritage : true;
  const effectiveDarkMode = hasSelectedTheme ? darkMode : false;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
        toast.success(isArabic ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || (isArabic ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${effectiveDarkMode ? (effectiveIsHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (effectiveIsHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      {effectiveIsHeritage && <div className="fixed inset-0 sadu-pattern opacity-10 pointer-events-none" />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-2xl ${
          effectiveIsHeritage
            ? effectiveDarkMode ? 'bg-[#2A2A2A] border-2 border-[#8D1C1C]' : 'bg-white border-2 border-[#8D1C1C]'
            : effectiveDarkMode ? 'glass-modern' : 'bg-white shadow-xl'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${effectiveIsHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'}`}>
            <span className="text-white font-bold text-2xl">د</span>
          </div>
          <span className={`text-2xl font-bold ${effectiveIsHeritage ? 'font-serif text-[#8D1C1C]' : 'text-[#0D9488]'}`}>
            دروازة
          </span>
        </Link>

        {/* Title */}
        <h1 className={`text-2xl font-bold text-center mb-2 ${effectiveIsHeritage ? 'font-serif' : ''}`}>
          {isLogin ? t('login') : t('register')}
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {isLogin
            ? (isArabic ? 'أهلاً بعودتك! سجل دخولك للمتابعة' : 'Welcome back! Sign in to continue')
            : (isArabic ? 'أنشئ حسابك للانضمام إلى دروازة' : 'Create your account to join Darwaza')}
        </p>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full h-12 mb-6"
          onClick={loginWithGoogle}
          data-testid="google-login-btn"
        >
          <svg className="w-5 h-5 me-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('continue_with_google')}
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">{t('or')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">{t('name')}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="ps-10 h-12"
                  placeholder={isArabic ? 'اسمك الكامل' : 'Your full name'}
                  data-testid="name-input"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="ps-10 h-12"
                placeholder="you@example.com"
                data-testid="email-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">{t('password')}</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                className="ps-10 pe-10 h-12"
                placeholder="••••••••"
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  className="ps-10 h-12"
                  placeholder="••••••••"
                  data-testid="confirm-password-input"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className={`w-full h-12 ${effectiveIsHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}`}
            data-testid="submit-btn"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? t('login') : t('register'))}
          </Button>
        </form>

        {/* Switch Auth Mode */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          {isLogin ? t('dont_have_account') : t('already_have_account')}{' '}
          <Link
            to={isLogin ? '/register' : '/login'}
            className={`font-semibold ${effectiveIsHeritage ? 'text-[#8D1C1C]' : 'text-[#0D9488]'} hover:underline`}
            data-testid="switch-auth-link"
          >
            {isLogin ? t('register') : t('login')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export const LoginPage = () => <AuthPage isLogin={true} />;
export const RegisterPage = () => <AuthPage isLogin={false} />;

export default AuthPage;
