import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  Home,
  Brain,
  Users,
  CreditCard,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  Languages,
  Eye,
  Palette,
  ChevronDown,
  Compass,
  X,
  UserCircle
} from 'lucide-react';

const NavLink = ({ to, icon: Icon, children, onClick, isActive }) => {
  const { isHeritage, darkMode } = useTheme();
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? isHeritage 
            ? 'bg-[#8D1C1C] text-white' 
            : 'bg-[#1D4ED8] text-white'
          : isHeritage
            ? `hover:bg-[#8D1C1C]/10 ${darkMode ? 'text-[#FDF6E3]' : 'text-[#1A1A1A]'}`
            : `hover:bg-[#1D4ED8]/10 ${darkMode ? 'text-[#F9FAFB]' : 'text-[#0F172A]'}`
      }`}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
};

const NavDropdown = ({ trigger, items, isRTL, themeColors }) => {
  const { isHeritage, darkMode } = useTheme();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`gap-1.5 px-3 h-9 ${isHeritage ? 'hover:bg-[#8D1C1C]/10' : 'hover:bg-[#1D4ED8]/10'}`}
        >
          <trigger.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{trigger.label}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? 'start' : 'end'} 
        className="w-64"
        sideOffset={8}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.to || index}>
            {item.separator && <DropdownMenuSeparator />}
            {item.label && !item.to && (
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {item.label}
              </DropdownMenuLabel>
            )}
            {item.to && (
              <DropdownMenuItem asChild>
                <Link to={item.to} className="flex items-center gap-3 py-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: item.color || themeColors.primary + '20' }}
                  >
                    {item.emoji ? (
                      <span className="text-lg drop-shadow-md">{item.emoji}</span>
                    ) : item.icon ? (
                      <item.icon className="w-4 h-4" style={{ color: item.color || themeColors.primary }} />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </Link>
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Navbar = () => {
  const { theme, isHeritage, darkMode, toggleDarkMode, seniorMode, toggleSeniorMode, resetTheme, themeColors } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, languages, t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isArabic = language === 'ar';

  const mainNavItems = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/ai-hub', icon: Brain, label: t('ai_hub') },
  ];

  const sectionsDropdown = {
    trigger: { icon: Users, label: isArabic ? 'الأقسام' : 'Sections' },
    items: [
      { label: isArabic ? 'لكبار السن' : 'For Seniors' },
      { 
        to: '/seniors', 
        emoji: '☕', 
        label: isArabic ? 'بوابة المتقاعدين' : 'Seniors Gateway',
        description: isArabic ? 'السوق والمجالس والأكاديمية' : 'Marketplace, Councils & Academy',
        color: '#8D1C1C'
      },
      { separator: true },
      { label: isArabic ? 'للشباب' : 'For Youth' },
      { 
        to: '/youth', 
        emoji: '🚀', 
        label: isArabic ? 'تمكين الشباب' : 'Youth Empowerment',
        description: isArabic ? 'الدورات والتصميم والوظائف' : 'Courses, Design & Careers',
        color: '#1D4ED8'
      },
      { separator: true },
      { label: isArabic ? 'للأطفال' : 'For Kids' },
      { 
        to: '/kids', 
        emoji: '🎮', 
        label: isArabic ? 'عالم الأطفال' : 'Kids World',
        description: isArabic ? 'الألعاب والإنجازات' : 'Games & Achievements',
        color: '#F59E0B'
      },
    ]
  };

  const exploreDropdown = {
    trigger: { icon: Compass, label: isArabic ? 'استكشف' : 'Explore' },
    items: [
      { 
        to: '/cooking', 
        emoji: '👨‍🍳', 
        label: isArabic ? 'ركن الطبخ' : 'Cooking Corner',
        description: isArabic ? 'الوصفات والفيديوهات' : 'Recipes & Videos',
        color: '#EC4899'
      },
      { 
        to: '/smart-kitchen', 
        emoji: '🍳', 
        label: isArabic ? 'المطبخ الذكي' : 'Smart Kitchen',
        description: isArabic ? 'طبخات كويتية بالخطوات' : 'Kuwaiti Recipes Step-by-Step',
        color: '#F59E0B'
      },
      { 
        to: '/tourists', 
        emoji: '🗺️', 
        label: isArabic ? 'بوابة الكويت' : 'Kuwait Gateway',
        description: isArabic ? 'المعالم والثقافة' : 'Landmarks & Culture',
        color: '#3B82F6'
      },
      { 
        to: '/arab-world', 
        emoji: '🌍', 
        label: isArabic ? 'العالم العربي' : 'Arab World',
        description: isArabic ? 'ثقافات الوطن العربي' : 'Pan-Arab Cultures',
        color: '#10B981'
      },
      { separator: true },
      { 
        to: '/subscriptions', 
        emoji: '💎', 
        label: isArabic ? 'الاشتراكات' : 'Subscriptions',
        description: isArabic ? 'الخطط والأسعار' : 'Plans & Pricing',
        color: '#8B5CF6'
      },
    ]
  };

  const allNavItems = [
    { to: '/', icon: Home, label: t('home'), color: themeColors.primary },
    { to: '/ai-hub', emoji: '🧠', label: t('ai_hub'), color: '#8B5CF6' },
    { separator: true, label: isArabic ? 'الأقسام الرئيسية' : 'Main Sections' },
    { to: '/seniors', emoji: '☕', label: t('seniors'), color: '#8D1C1C' },
    { to: '/youth', emoji: '🚀', label: t('youth'), color: '#1D4ED8' },
    { to: '/kids', emoji: '🎮', label: t('kids'), color: '#F59E0B' },
    { separator: true, label: isArabic ? 'استكشف' : 'Explore' },
    { to: '/cooking', emoji: '👨‍🍳', label: t('cooking'), color: '#EC4899' },
    { to: '/smart-kitchen', emoji: '🍳', label: isArabic ? 'المطبخ الذكي' : 'Smart Kitchen', color: '#F59E0B' },
    { to: '/tourists', emoji: '🗺️', label: t('tourists'), color: '#3B82F6' },
    { to: '/arab-world', emoji: '🌍', label: t('arab_world'), color: '#10B981' },
    { separator: true, label: isArabic ? 'الحساب' : 'Account' },
    { to: '/profile', emoji: '👤', label: isArabic ? 'حسابي' : 'My Profile', color: themeColors.primary },
    { to: '/subscriptions', emoji: '💎', label: t('subscriptions'), color: '#8B5CF6' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // إعدادات تصميم قائمة المستخدم المنسدلة
  const userDropdownStyles = isHeritage ? {
    content: darkMode ? "bg-[#2C1E12] border-2 border-[#8D1C1C] rounded-none" : "bg-[#FDF5E6] border-2 border-[#8D1C1C] rounded-none",
    item: "rounded-none hover:bg-[#8D1C1C]/20 focus:bg-[#8D1C1C]/20 transition-colors",
    logout: "rounded-none hover:bg-red-500/20 focus:bg-red-500/20 text-red-700 dark:text-red-400 transition-colors",
    pattern: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }
  } : {
    content: darkMode ? "bg-[#0F172A]/90 backdrop-blur-2xl border border-blue-500/30 rounded-2xl shadow-[0_0_25px_rgba(37,99,235,0.2)]" : "bg-white/90 backdrop-blur-2xl border border-blue-200 rounded-2xl shadow-[0_15px_35px_rgba(37,99,235,0.15)]",
    item: "rounded-xl hover:bg-blue-500/10 focus:bg-blue-500/10 transition-colors",
    logout: "rounded-xl hover:bg-red-500/10 focus:bg-red-500/10 text-red-500 transition-colors",
    pattern: {}
  };

  if (!theme) return null;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHeritage
          ? darkMode
            ? 'bg-[#1A1A1A] border-b-4 border-[#8D1C1C]'
            : 'bg-[#FDF6E3] border-b-4 border-[#8D1C1C]'
          : darkMode
            ? 'bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10'
            : 'bg-white/95 backdrop-blur-xl border-b border-gray-200'
      }`}
    >
      {isHeritage && <div className="sadu-border w-full" />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]'
          }`}>
              <span className="text-white font-bold text-xl">د</span>
            </div>
            <span className={`text-xl font-bold ${
              isHeritage ? 'font-serif' : 'font-sans'
            } ${darkMode ? 'text-white' : isHeritage ? 'text-[#8D1C1C]' : 'text-[#0F172A]'}`}>
              دروازة
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                icon={item.icon}
                isActive={location.pathname === item.to}
              >
                {item.label}
              </NavLink>
            ))}
            
            <NavDropdown 
              trigger={sectionsDropdown.trigger} 
              items={sectionsDropdown.items} 
              isRTL={isRTL}
              themeColors={themeColors}
            />
            
            <NavDropdown 
              trigger={exploreDropdown.trigger} 
              items={exploreDropdown.items} 
              isRTL={isRTL}
              themeColors={themeColors}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Languages className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-48">
                <DropdownMenuLabel className="text-xs">
                  {isArabic ? 'اختر اللغة' : 'Select Language'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`gap-2 ${language === lang.code ? 'bg-accent' : ''}`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1">{lang.nativeName}</span>
                    {language === lang.code && <span className="text-xs">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Senior Mode */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${seniorMode ? 'bg-accent' : ''}`}
              onClick={toggleSeniorMode}
              title={isArabic ? 'وضع كبار السن' : 'Senior Mode'}
            >
              <Eye className="w-4 h-4" />
            </Button>

            {/* Interface Switch */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={resetTheme}
              title={isArabic ? 'تغيير الواجهة' : 'Switch Interface'}
            >
              <Palette className="w-4 h-4" />
            </Button>

            {/* Auth User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 h-9 px-2">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className={`w-7 h-7 ${isHeritage ? 'rounded-none border border-[#8D1C1C]' : 'rounded-full'}`} />
                    ) : (
                      <div className={`w-7 h-7 flex items-center justify-center ${
                        isHeritage ? 'bg-[#8D1C1C] rounded-none' : 'bg-blue-600 rounded-full'
                      }`}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-bold">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                
                {/* 🚀 القائمة المنسدلة الاحترافية والجديدة */}
                <DropdownMenuContent 
                  align={isRTL ? 'start' : 'end'} 
                  className={`w-56 p-2 mt-1 ${userDropdownStyles.content}`}
                  style={userDropdownStyles.pattern}
                >
                  <DropdownMenuItem asChild className={userDropdownStyles.item}>
                    <Link to="/profile" className="flex items-center gap-3 cursor-pointer py-3 px-3 font-bold">
                      <UserCircle className="w-5 h-5" />
                      <span className="text-base">{isArabic ? 'حسابي الشخصي' : 'My Profile'}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout} className={`flex items-center gap-3 cursor-pointer py-3 px-3 font-bold mt-1 ${userDropdownStyles.logout}`}>
                    <LogOut className="w-5 h-5" />
                    <span className="text-base">{isArabic ? 'تسجيل الخروج' : 'Log out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                size="sm"
                className={`h-9 px-4 transition-all duration-300 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white rounded-none' : 'bg-blue-600 text-white rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.6)] hover:shadow-[0_0_25px_rgba(37,99,235,0.8)]'}`}
              >
                {t('login')}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={isRTL ? 'right' : 'left'} 
                className={`w-80 border-none p-0 shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-[#0A0A0A] text-white' : 'bg-white text-gray-900'}`}
              >
                <div className="flex flex-col h-full py-6 px-2">                  
                  <div className={`p-4 border-b ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">د</span>
                        </div>
                        <span className="text-xl font-bold text-white">دروازة</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20"
                        onClick={() => setMobileOpen(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                      {allNavItems.map((item, index) => (
                        item.separator ? (
                          <div key={index} className="pt-4 pb-2">
                            <p className="text-xs font-medium text-muted-foreground px-3">
                              {item.label}
                            </p>
                          </div>
                        ) : (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                              location.pathname === item.to
                                ? isHeritage ? 'bg-[#8D1C1C] text-white' : 'bg-[#1D4ED8] text-white'
                                : 'hover:bg-accent'
                            }`}
                          >
                            <div 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                location.pathname === item.to ? 'bg-white/20' : ''
                              }`}
                              style={{ 
                                backgroundColor: location.pathname === item.to ? undefined : item.color + '20'
                              }}
                            >
                              {item.emoji ? (
                                <span className="text-2xl drop-shadow-sm">{item.emoji}</span>
                              ) : item.icon ? (
                                <item.icon 
                                  className="w-5 h-5" 
                                  style={{ color: location.pathname === item.to ? 'white' : item.color }} 
                                />
                              ) : null}
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        )
                      ))}
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="p-4 border-t">
                      <Button
                        onClick={() => { navigate('/login'); setMobileOpen(false); }}
                        className={`w-full h-12 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515] text-white rounded-none' : 'bg-blue-600 hover:bg-blue-700 text-white rounded-xl'}`}
                      >
                        {t('login')}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;