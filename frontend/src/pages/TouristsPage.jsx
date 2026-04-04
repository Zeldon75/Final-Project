import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Heart, Utensils, Camera, Users, Info, Shirt, Moon, Search } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const TouristsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/content/tourists-guide`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0A0A0A] text-white' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* العناوين المترجمة */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">{t('tourist_title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('tourist_subtitle')}
          </p>
        </div>

        <div className="space-y-12">
          <Tabs defaultValue="etiquette" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="etiquette">{t('etiquette')}</TabsTrigger>
              <TabsTrigger value="cuisine">{t('cuisine')}</TabsTrigger>
              <TabsTrigger value="landmarks">{t('landmarks')}</TabsTrigger>
              <TabsTrigger value="social">{t('social')}</TabsTrigger>
            </TabsList>

            <TabsContent value="etiquette">
              {/* تأكد أن هذه المكونات موجودة تحت في ملفك أو مستوردة */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">{t('etiquette')}</h2>
                {/* محتوى القسم */}
              </div>
            </TabsContent>
            
            {/* باقي الـ TabsContent هنا بنفس الطريقة */}
          </Tabs>

          <div className="mt-12 p-6 border rounded-2xl">
             <h2 className="text-2xl font-bold mb-4">{isArabic ? 'عبارات مفيدة' : 'Useful Phrases'}</h2>
             {/* هنا نضع PhrasesSection */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristsPage;