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
  X
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
      data-testid={`nav-${to.replace('/', '') || 'home'}`}
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
          data-testid={`nav-dropdown-${trigger.label}`}
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
                    {/* عرض الإيموجي هنا إذا كان موجوداً، وإلا عرض الأيقونة العادية */}
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

  // Main navigation items
  const mainNavItems = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/ai-hub', icon: Brain, label: t('ai_hub') },
  ];

  // Sections dropdown (إضافة الإيموجيات هنا)
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

  // Explore dropdown (إضافة الإيموجيات هنا)
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
        to: '/tourists', 
        emoji: '🗺️', 
        label: isArabic ? 'دليل السياح' : 'Tourist Guide',
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

  // All nav items for mobile (إضافة الإيموجيات لقائمة الجوال)
  const allNavItems = [
    { to: '/', icon: Home, label: t('home'), color: themeColors.primary },
    { to: '/ai-hub', emoji: '🧠', label: t('ai_hub'), color: '#8B5CF6' },
    { separator: true, label: isArabic ? 'الأقسام الرئيسية' : 'Main Sections' },
    { to: '/seniors', emoji: '☕', label: t('seniors'), color: '#8D1C1C' },
    { to: '/youth', emoji: '🚀', label: t('youth'), color: '#1D4ED8' },
    { to: '/kids', emoji: '🎮', label: t('kids'), color: '#F59E0B' },
    { separator: true, label: isArabic ? 'استكشف' : 'Explore' },
    { to: '/cooking', emoji: '👨‍🍳', label: t('cooking'), color: '#EC4899' },
    { to: '/tourists', emoji: '🗺️', label: t('tourists'), color: '#3B82F6' },
    { to: '/arab-world', emoji: '🌍', label: t('arab_world'), color: '#10B981' },
    { separator: true, label: isArabic ? 'الحساب' : 'Account' },
    { to: '/subscriptions', emoji: '💎', label: t('subscriptions'), color: '#8B5CF6' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
      data-testid="main-navbar"
    >
      {isHeritage && <div className="sadu-border w-full" />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
  isHeritage ? 'bg-[#8D1C1C]' : 'bg-blue-700 shadow-[0_0_15px_rgba(29,78,216,0.8)] animate-[pulse_3s_ease-in-out_infinite]'
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
                <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="language-selector">
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
              data-testid="dark-mode-toggle"
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
              data-testid="senior-mode-toggle"
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
              data-testid="interface-switch"
            >
              <Palette className="w-4 h-4" />
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 h-9 px-2" data-testid="user-menu">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'
                      }`}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-48">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/subscriptions" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {t('subscriptions')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="w-4 h-4 me-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
  onClick={() => navigate('/login')}
  size="sm"
  className={`h-9 px-4 transition-all duration-300 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-blue-700 text-white shadow-[0_0_15px_rgba(29,78,216,0.8)] hover:shadow-[0_0_25px_rgba(29,78,216,1)] animate-[pulse_3s_ease-in-out_infinite]'}`}
  data-testid="login-button"
>
  {t('login')}
</Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="mobile-menu-trigger">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
         <SheetContent 
  side={isRTL ? 'right' : 'left'} 
  className={`w-80 border-none p-0 shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-[#0A0A0A] text-white' : 'bg-white text-gray-900'}`}
>
  <div className="flex flex-col h-full py-6 px-2">                  {/* Mobile Header */}
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

                  {/* Mobile Nav Items */}
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
                            data-testid={`mobile-nav-${item.to.replace('/', '') || 'home'}`}
                          >
                            <div 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                location.pathname === item.to ? 'bg-white/20' : ''
                              }`}
                              style={{ 
                                backgroundColor: location.pathname === item.to ? undefined : item.color + '20'
                              }}
                            >
                              {/* عرض الإيموجي في الجوال أيضاً */}
                              {item.emoji ? (
                                <span className="text-2xl drop-shadow-sm">{item.emoji}</span>
                              ) : item.icon ? (
                                <item.icon 
                                  className="w-5 h-5" 
                                  style={{ 
                                    color: location.pathname === item.to ? 'white' : item.color 
                                  }} 
                                />
                              ) : null}
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Mobile Footer */}
                  {!isAuthenticated && (
                    <div className="p-4 border-t">
                      <Button
                        onClick={() => { navigate('/login'); setMobileOpen(false); }}
                        className={`w-full h-12 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
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