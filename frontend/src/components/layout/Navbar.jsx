import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme, THEMES } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  Home,
  Brain,
  Users,
  Sparkles,
  Gamepad2,
  ChefHat,
  Globe,
  Map,
  CreditCard,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  Languages,
  Eye,
  Palette
} from 'lucide-react';

const NavLink = ({ to, icon: Icon, children, onClick }) => {
  const { isHeritage, darkMode } = useTheme();
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isHeritage
          ? `hover:bg-[#8D1C1C]/10 ${darkMode ? 'text-[#FDF6E3]' : 'text-[#1A1A1A]'}`
          : `hover:bg-white/10 ${darkMode ? 'text-[#F9FAFB]' : 'text-[#0F172A]'}`
      }`}
      data-testid={`nav-${to.replace('/', '') || 'home'}`}
    >
      <Icon className="w-5 h-5" strokeWidth={isHeritage ? 2.5 : 1.5} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export const Navbar = () => {
  const { theme, isHeritage, darkMode, toggleDarkMode, seniorMode, toggleSeniorMode, resetTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, languages, t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/ai-hub', icon: Brain, label: t('ai_hub') },
    { to: '/seniors', icon: Users, label: t('seniors') },
    { to: '/youth', icon: Sparkles, label: t('youth') },
    { to: '/kids', icon: Gamepad2, label: t('kids') },
    { to: '/cooking', icon: ChefHat, label: t('cooking') },
    { to: '/tourists', icon: Map, label: t('tourists') },
    { to: '/arab-world', icon: Globe, label: t('arab_world') },
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
            ? 'glass-modern bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-white/80 backdrop-blur-xl border-b border-gray-200'
      }`}
      data-testid="main-navbar"
    >
      {/* Sadu Border for Heritage Mode */}
      {isHeritage && <div className="sadu-border w-full" />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#0D9488]'
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
            {navItems.slice(0, 5).map((item) => (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2" data-testid="more-menu-trigger">
                  <Menu className="w-5 h-5" />
                  <span className="hidden xl:inline">{t('view_all')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
                {navItems.slice(5).map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/subscriptions" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {t('subscriptions')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="language-selector">
                  <Languages className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="me-2">{lang.flag}</span>
                    {lang.nativeName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              data-testid="dark-mode-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Senior Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSeniorMode}
              className={seniorMode ? 'bg-accent' : ''}
              data-testid="senior-mode-toggle"
            >
              <Eye className="w-5 h-5" />
            </Button>

            {/* Interface Switch */}
            <Button
              variant="ghost"
              size="icon"
              onClick={resetTheme}
              data-testid="interface-switch"
            >
              <Palette className="w-5 h-5" />
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2" data-testid="user-menu">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t('profile')}
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
                className={isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#0D9488] hover:bg-[#0B7A70]'}
                data-testid="login-button"
              >
                {t('login')}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="w-80">
                <div className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <NavLink to="/subscriptions" icon={CreditCard} onClick={() => setMobileOpen(false)}>
                    {t('subscriptions')}
                  </NavLink>
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
