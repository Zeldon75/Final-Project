import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { SaduCard } from '../components/SaduPattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Brain, Send, Bot, User, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AIModelCard = ({ model, isSelected, onClick, isArabic }) => {
  const { isHeritage, darkMode } = useTheme();
  
  const models = {
    'gpt-5.2': {
      name: 'ChatGPT',
      nameAr: 'شات جي بي تي',
      color: '#10A37F',
      description: 'OpenAI GPT-5.2',
      descriptionAr: 'أوبن إيه آي جي بي تي 5.2'
    },
    'gemini': {
      name: 'Gemini',
      nameAr: 'جيميني',
      color: '#4285F4',
      description: 'Google Gemini 3',
      descriptionAr: 'جوجل جيميني 3'
    },
    'claude': {
      name: 'Claude',
      nameAr: 'كلود',
      color: '#CC785C',
      description: 'Anthropic Claude',
      descriptionAr: 'أنثروبيك كلود'
    }
  };

  const info = models[model];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? `border-[${info.color}] bg-[${info.color}]/10`
          : isHeritage
            ? 'border-[#8D1C1C]/20 hover:border-[#8D1C1C]/50'
            : 'border-white/10 hover:border-white/30'
      } ${darkMode ? 'bg-white/5' : 'bg-white'}`}
      data-testid={`ai-model-${model}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: info.color }}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold">{isArabic ? info.nameAr : info.name}</h4>
          <p className="text-xs text-muted-foreground">{isArabic ? info.descriptionAr : info.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ChatMessage = ({ message, isUser, isArabic }) => {
  const { isHeritage, darkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser
          ? isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'
          : 'bg-purple-600'
      }`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={`max-w-[80%] p-4 rounded-2xl ${
        isUser
          ? isHeritage
            ? 'bg-[#8D1C1C] text-white'
            : 'bg-[#1D4ED8] text-white'
          : darkMode
            ? 'bg-white/10'
            : 'bg-gray-100'
      }`}>
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </motion.div>
  );
};

const AIHubPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, token } = useAuth();
  const isArabic = language === 'ar';
  
  const [selectedModel, setSelectedModel] = useState('gpt-5.2');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    if (!isAuthenticated) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        { content: userMessage, model: selectedModel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error(isArabic ? 'حدث خطأ في الاتصال بالذكاء الاصطناعي' : 'Error connecting to AI');
      setMessages(prev => [...prev, { role: 'assistant', content: isArabic ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = isArabic ? [
    'أخبرني عن تاريخ الكويت',
    'ما هي أهم التقاليد الكويتية؟',
    'كيف أتعلم نسج السدو؟',
    'ما هي أشهر الأكلات الكويتية؟'
  ] : [
    'Tell me about Kuwaiti history',
    'What are important Kuwaiti traditions?',
    'How can I learn Sadu weaving?',
    'What are famous Kuwaiti dishes?'
  ];

  return (
    <div className={`min-h-screen ${darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-[#F8FAFC]')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 ${isRTL ? 'text-right' : ''}`}
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isHeritage ? 'font-serif' : ''}`} style={{ color: themeColors.primary }}>
            {t('ai_hub')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isArabic
              ? 'تحدث مع 3 نماذج ذكاء اصطناعي مختلفة. اسأل عن التراث، التاريخ، أو أي شيء آخر.'
              : 'Chat with 3 different AI models. Ask about heritage, history, or anything else.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Model Selection */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold mb-4">{t('select_model')}</h3>
            {['gpt-5.2', 'gemini', 'claude'].map(model => (
              <AIModelCard
                key={model}
                model={model}
                isSelected={selectedModel === model}
                onClick={() => setSelectedModel(model)}
                isArabic={isArabic}
              />
            ))}

            {/* Suggested Prompts */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {isArabic ? 'اقتراحات' : 'Suggestions'}
              </h4>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => setInput(prompt)}
                    data-testid={`suggested-prompt-${index}`}
                  >
                    <MessageSquare className="w-4 h-4 me-2 flex-shrink-0" />
                    <span className="truncate">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <SaduCard className="h-[600px] flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-[#1D4ED8]'}`}>
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isHeritage ? 'font-serif' : ''}`}>
                      {t('ai_mentor')}
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      {isArabic
                        ? 'مرحباً! أنا مرشدك الذكي. اسألني عن التراث الكويتي والعربي، التاريخ، الثقافة، أو أي شيء آخر.'
                        : 'Hello! I am your AI mentor. Ask me about Kuwaiti and Arab heritage, history, culture, or anything else.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <ChatMessage
                        key={index}
                        message={msg.content}
                        isUser={msg.role === 'user'}
                        isArabic={isArabic}
                      />
                    ))}
                    {loading && (
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className={`p-4 border-t ${isHeritage ? 'border-[#8D1C1C]/20' : 'border-white/10'}`}>
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('type_message')}
                    className={`flex-1 h-12 ${isHeritage ? 'border-[#8D1C1C]/30' : ''}`}
                    disabled={loading}
                    data-testid="ai-chat-input"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className={`h-12 px-6 ${isHeritage ? 'bg-[#8D1C1C] hover:bg-[#6D1515]' : 'bg-[#1D4ED8] hover:bg-[#0B7A70]'}`}
                    data-testid="ai-send-btn"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </SaduCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHubPage;
