import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  const { isHeritage, darkMode } = useTheme();
  const { t, isRTL } = useLanguage();

  return (
    <footer
      className={`w-full py-12 ${
        isHeritage
          ? darkMode
            ? 'bg-[#1A1A1A] border-t-4 border-[#8D1C1C]'
            : 'bg-[#E8DCCA] border-t-4 border-[#8D1C1C]'
          : darkMode
            ? 'bg-[#0F172A] border-t border-white/10'
            : 'bg-gray-100 border-t border-gray-200'
      }`}
      data-testid="main-footer"
    >
      {isHeritage && <div className="sadu-border w-full mb-8" />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'
              }`}>
                <span className="text-white font-bold text-2xl">د</span>
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isHeritage ? 'font-serif' : 'font-sans'}`}>
                  دروازة
                </h3>
                <p className="text-sm text-muted-foreground">Darwaza</p>
              </div>
            </div>
            <p className={`text-muted-foreground max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL
                ? 'بوابتك إلى التراث الكويتي الأصيل. نربط الأجيال بالتكنولوجيا الحديثة والذكاء الاصطناعي.'
                : 'Your gateway to authentic Kuwaiti heritage. Bridging generations through modern technology and AI.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{isRTL ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="space-y-2">
              <li><Link to="/seniors" className="text-muted-foreground hover:text-foreground transition-colors">{t('seniors')}</Link></li>
              <li><Link to="/youth" className="text-muted-foreground hover:text-foreground transition-colors">{t('youth')}</Link></li>
              <li><Link to="/kids" className="text-muted-foreground hover:text-foreground transition-colors">{t('kids')}</Link></li>
              <li><Link to="/tourists" className="text-muted-foreground hover:text-foreground transition-colors">{t('tourists')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{isRTL ? 'قانوني' : 'Legal'}</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">{t('about_us')}</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">{t('contact')}</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">{t('privacy')}</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{t('copyright')}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Youtube">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
