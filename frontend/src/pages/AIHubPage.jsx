import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { SaduCard } from '../components/SaduPattern';
import { Brain, Send, Bot, User, Loader2, Sparkles, MessageSquare, Lock } from 'lucide-react';
import { toast } from 'sonner';

// 🚀 مفتاح الذكاء الاصطناعي الذي أرسلته (إذا لم يعمل تأكد أنه يبدأ بـ AIzaSy)
const GEMINI_API_KEY = "gen-lang-client-0453876994";

// --- مكون الرسائل ---
const ChatMessage = ({ message, isUser, isArabic }) => {
  const { isHeritage, darkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
        isUser
          ? isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'
          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
      }`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
        isUser
          ? isHeritage
            ? 'bg-[#8D1C1C] text-white rounded-tr-none'
            : 'bg-[#1D4ED8] text-white rounded-tr-none'
          : darkMode
            ? 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
      }`}>
        {/* دعم النصوص العريضة والمائلة من الذكاء الاصطناعي */}
        <div 
          className="whitespace-pre-wrap leading-relaxed font-medium"
          dangerouslySetInnerHTML={{ 
            __html: message
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
          }}
        />
      </div>
    </motion.div>
  );
};

const AIHubPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isArabic = language === 'ar';
  
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestMsgCount, setGuestMsgCount] = useState(0); 
  const MSG_LIMIT = 6; 
  const messagesEndRef = useRef(null);

  // الرسالة الترحيبية التلقائية (تم تغيير role إلى model ليتوافق مع Gemini)
  const initialBotMessage = {
    role: 'model',
    content: isArabic
      ? 'مرحباً بك في منصة "دروازة"! 🌟 أنا مساعدك الذكي ومستعد لمساعدتك في استكشاف تراثنا وتاريخنا، أو إرشادك حول كيفية استخدام الموقع. ما الذي تود معرفته اليوم؟'
      : 'Welcome to the "Darwaza" platform! 🌟 I am your AI assistant, ready to help you explore our heritage and history, or guide you on how to use the site. What would you like to know today?'
  };

  const [messages, setMessages] = useState([initialBotMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🚀 دالة الاتصال المباشر بـ Google Gemini
  const generateGeminiResponse = async (userText, chatHistory) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    // توجيهات ليكون المساعد ملائماً لدروازة
    const systemInstruction = isArabic 
      ? "أنت مساعد ذكي في منصة كويتية اسمها 'دروازة' متخصصة في التراث والتاريخ الكويتي. أجب بإيجاز، كن ودوداً، واستخدم بعض الكلمات الكويتية اللطيفة إذا كان مناسباً."
      : "You are an AI assistant for a Kuwaiti platform called 'Darwaza' focusing on heritage and history. Answer concisely, be friendly, and mention Kuwaiti culture when relevant.";

    // تجهيز تاريخ المحادثة
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    formattedHistory.push({
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\nسؤال المستخدم: ${userText}` }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: formattedHistory })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "API Error");
    }

    return data.candidates[0].content.parts[0].text;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    if (!isAuthenticated && guestMsgCount >= MSG_LIMIT) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    if (!isAuthenticated) {
      setGuestMsgCount(prev => prev + 1);
    }

    try {
      // الاتصال بالذكاء الاصطناعي
      const aiReply = await generateGeminiResponse(userMessage, messages);
      setMessages(prev => [...prev, { role: 'model', content: aiReply }]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error(isArabic ? 'حدث خطأ في الاتصال. تأكد من صحة مفتاح API' : 'Connection error. Check API key');
      setMessages(prev => [...prev, { role: 'model', content: isArabic ? 'عذراً، حدث خطأ في الاتصال. هل تأكدت من أن مفتاح API يبدأ بـ AIzaSy؟ 🗝️' : 'Sorry, a connection error occurred. Make sure your API key starts with AIzaSy. 🗝️' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = isArabic ? [
    'أخبرني عن تاريخ تأسيس الكويت',
    'ما هي أهم التقاليد الكويتية؟',
    'كيف أتعلم نسج السدو؟',
    'ما هي أشهر الأكلات الكويتية؟'
  ] : [
    'Tell me about Kuwaiti history',
    'What are important Kuwaiti traditions?',
    'How can I learn Sadu weaving?',
    'What are famous Kuwaiti dishes?'
  ];

  // ألوان النماذج وتأثيرات النيون
  const modelStyles = {
    'gpt-5.2': { color: '#10b981', glow: 'rgba(16, 185, 129, 0.8)', icon: Bot, name: 'ChatGPT' },
    'gemini': { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.8)', icon: Sparkles, name: 'Gemini' },
    'claude': { color: '#f97316', glow: 'rgba(249, 115, 22, 0.8)', icon: Brain, name: 'Claude' }
  };

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-gray-50')} transition-colors duration-500`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Models Neon Selector */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {t('ai_hub')}
          </h1>
          <p className="text-lg font-medium text-muted-foreground mb-8">
            {isArabic ? 'اختر نموذجك المفضل وابدأ المحادثة الذكية 🧠' : 'Choose your favorite model and start the smart chat 🧠'}
          </p>

          <div className="flex justify-center items-center gap-6">
            {Object.entries(modelStyles).map(([id, info]) => {
              const ModelIcon = info.icon;
              const isSelected = selectedModel === id;
              return (
                <div key={id} className="flex flex-col items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1, boxShadow: `0px 0px 20px ${info.glow}` }}
                    animate={{ boxShadow: isSelected ? `0px 0px 25px ${info.glow}` : '0px 0px 0px rgba(0,0,0,0)' }}
                    onClick={() => setSelectedModel(id)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'ring-4 ring-offset-2 ring-offset-transparent' : 'opacity-60 hover:opacity-100 grayscale-[30%]'}`}
                    style={{ backgroundColor: info.color, ringColor: info.color }}
                  >
                    <ModelIcon className="text-white w-7 h-7" />
                  </motion.button>
                  <span className={`text-xs font-bold ${isSelected ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-muted-foreground'}`}>{info.name}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
          <SaduCard className={`h-[650px] flex flex-col shadow-2xl border-0 overflow-hidden ${darkMode ? 'bg-[#1E293B] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'}`}>
            
            {/* Suggested Prompts */}
            <div className={`p-4 flex gap-2 overflow-x-auto custom-scrollbar border-b ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
              {suggestedPrompts.map((prompt, index) => (
                <Button key={index} variant="outline" size="sm"
                  className={`flex-shrink-0 font-bold border-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                  onClick={() => setInput(prompt)}
                >
                  <MessageSquare className="w-4 h-4 me-2 text-purple-500" />
                  {prompt}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 md:p-6">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg.content} isUser={msg.role === 'user'} isArabic={isArabic} />
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className={`p-4 rounded-2xl rounded-tl-none ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
                      <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className={`p-4 md:p-6 border-t-2 ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
              {!isAuthenticated && guestMsgCount >= MSG_LIMIT ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 text-center rounded-2xl border-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <Lock className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {isArabic ? 'انتهت رسائلك المجانية! 🌟' : 'Free messages exhausted! 🌟'}
                  </h3>
                  <p className="mb-6 font-medium text-muted-foreground">
                    {isArabic ? 'لقد استمتعت بتجربة الذكاء الاصطناعي. سجل دخولك الآن لمواصلة التحدث بلا حدود والاستفادة من كافة ميزات دروازة.' : 'You enjoyed the AI experience. Login now to continue chatting unlimitedly and use all Darwaza features.'}
                  </p>
                  <Link to="/login">
                    <Button className="w-full md:w-auto px-12 h-14 text-lg font-black rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      {isArabic ? 'تسجيل الدخول / إنشاء حساب' : 'Login / Register'}
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div>
                  {!isAuthenticated && (
                    <div className="flex justify-between items-center px-2 mb-2 text-xs font-bold text-muted-foreground">
                      <span>{isArabic ? 'مستخدم زائر' : 'Guest User'}</span>
                      <span className={guestMsgCount >= 4 ? 'text-red-500' : ''}>
                        {isArabic ? `الرسائل المتبقية: ${MSG_LIMIT - guestMsgCount}` : `Remaining messages: ${MSG_LIMIT - guestMsgCount}`}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                      className={`flex-1 h-14 text-lg rounded-xl border-2 px-4 shadow-sm focus-visible:ring-offset-0 focus-visible:ring-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500' : 'bg-white border-gray-200 focus-visible:ring-purple-500'}`}
                      disabled={loading}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      className="h-14 w-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-transform hover:scale-105"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
          </SaduCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AIHubPage;