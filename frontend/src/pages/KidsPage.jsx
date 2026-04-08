import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Gamepad2, Package, Trophy, Star, Gift, BookOpen, Puzzle, Brain, Target,
  Lightbulb, RotateCcw, Check, X, Palette, ChevronRight, Sparkles, Bot, Lock, Unlock,
  ListOrdered
} from 'lucide-react';

// --- مكونات الألعاب ---

const MemoryGame = ({ isArabic, onScore, gameColor, darkMode }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const symbols = ['🏰', '⚓', '🐪', '🌴', '☕', '📿', '🎭', '🏺'];

  useEffect(() => { initGame(); }, []);

  const initGame = () => {
    const shuffled = [...symbols, ...symbols].sort(() => Math.random() - 0.5).map((symbol, index) => ({ id: index, symbol, isFlipped: false }));
    setCards(shuffled); setFlipped([]); setMatched([]); setMoves(0); setGameWon(false);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id]; setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched); setFlipped([]);
        if (newMatched.length === cards.length) { setGameWon(true); onScore?.(Math.max(100 - moves * 2, 50)); }
      } else { setTimeout(() => setFlipped([]), 1000); }
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-2xl`}>
      <div className="flex justify-between items-center mb-6">
        <div className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <span className="font-bold">{isArabic ? 'المحاولات:' : 'Moves:'}</span> <span className="ms-1" style={{color: gameColor}}>{moves}</span>
        </div>
        <Button variant="outline" size="sm" onClick={initGame} style={{ borderColor: gameColor, color: gameColor }} className="font-bold border-2">
          <RotateCcw className="w-4 h-4 me-1" /> {isArabic ? 'إعادة' : 'Reset'}
        </Button>
      </div>
      
      {gameWon ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500 drop-shadow-md" />
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{isArabic ? 'أحسنت يا بطل!' : 'Congratulations!'}</h3>
          <p className="text-muted-foreground mb-6 font-bold">{isArabic ? `أكملت اللعبة في ${moves} محاولة` : `Completed in ${moves} moves`}</p>
          <Button onClick={initGame} style={{ backgroundColor: gameColor }} className="text-white font-bold px-8 h-12 rounded-xl">{isArabic ? 'العب مرة أخرى' : 'Play Again'}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <motion.div key={card.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-2xl cursor-pointer flex items-center justify-center text-3xl shadow-md border-b-4 ${flipped.includes(card.id) || matched.includes(card.id) ? 'bg-amber-100 border-amber-300' : 'bg-gradient-to-br text-white'}`}
              style={!(flipped.includes(card.id) || matched.includes(card.id)) ? { backgroundColor: gameColor, borderColor: 'rgba(0,0,0,0.1)' } : {}} onClick={() => handleCardClick(card.id)}
            >
              {(flipped.includes(card.id) || matched.includes(card.id)) ? card.symbol : '❓'}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuizGame = ({ isArabic, onScore, gameColor, darkMode }) => {
  const [q, setQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = isArabic ? [
    { question: "ما هو الاسم القديم للكويت؟", options: ["القرين", "البحرين", "عمان"], correct: 0 },
    { question: "ما هو نسيج الكويت التقليدي؟", options: ["الحرير", "السدو", "الكتان"], correct: 1 },
    { question: "حيوان يلقب بسفينة الصحراء؟", options: ["الجمل", "الحصان", "الذئب"], correct: 0 }
  ] : [
    { question: "Old name of Kuwait?", options: ["Al-Qurain", "Bahrain", "Oman"], correct: 0 },
    { question: "Traditional Kuwaiti weaving?", options: ["Silk", "Sadu", "Linen"], correct: 1 },
    { question: "Animal called ship of the desert?", options: ["Camel", "Horse", "Wolf"], correct: 0 }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[q].correct) setScore(s => s + 1);
    setTimeout(() => {
      if (q < questions.length - 1) { setQ(q + 1); setSelectedAnswer(null); } 
      else { setShowResult(true); onScore?.(score * 20 + 20); } // +20 as base score
    }, 1000);
  };

  if (showResult) return (
    <div className={`text-center py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-2xl`}>
      <Star className="w-20 h-20 mx-auto mb-6 text-yellow-500 fill-yellow-500 drop-shadow-md" />
      <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{score}/{questions.length}</h3>
      <Button onClick={() => { setQ(0); setScore(0); setShowResult(false); setSelectedAnswer(null); }} style={{ backgroundColor: gameColor }} className="text-white font-bold h-12 px-8 rounded-xl">{isArabic ? 'إعادة الاختبار' : 'Retry Quiz'}</Button>
    </div>
  );

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-2xl`}>
      <div className={`p-6 rounded-2xl mb-8 shadow-inner border-2 ${darkMode ? 'bg-black/40 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-xl font-bold text-center leading-relaxed ${darkMode ? 'text-white' : 'text-gray-900'}`}>{questions[q].question}</h3>
      </div>
      <div className="space-y-3">
        {questions[q].options.map((opt, i) => (
          <Button key={i} variant="outline" className={`w-full py-6 text-lg font-bold rounded-xl transition-all border-2 ${selectedAnswer !== null ? (i === questions[q].correct ? 'bg-green-100 border-green-500 text-green-900' : selectedAnswer === i ? 'bg-red-100 border-red-500 text-red-900' : '') : `${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} hover:scale-[1.02]`}`} onClick={() => selectedAnswer === null && handleAnswer(i)} disabled={selectedAnswer !== null}>
            {selectedAnswer !== null && i === questions[q].correct && <Check className="w-5 h-5 me-3 text-green-600" />}
            {selectedAnswer === i && i !== questions[q].correct && <X className="w-5 h-5 me-3 text-red-600" />}
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};

const WordScrambleGame = ({ isArabic, onScore, gameColor, darkMode }) => {
  const words = isArabic ? [{ word: "الكويت", hint: "اسم البلد" }, { word: "السدو", hint: "نسيج تقليدي" }] : [{ word: "KUWAIT", hint: "Country name" }, { word: "SADU", hint: "Traditional weaving" }];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');

  const scrambleWord = useCallback((word) => word.split('').sort(() => Math.random() - 0.5).join(''), []);
  useEffect(() => { setScrambled(scrambleWord(words[currentIndex].word)); }, [currentIndex, scrambleWord, words]);

  const checkGuess = () => {
    if (guess.toUpperCase() === words[currentIndex].word.toUpperCase() || guess === words[currentIndex].word) {
      setMessage(isArabic ? 'صحيح! 🎉' : 'Correct! 🎉');
      setTimeout(() => {
        if (currentIndex < words.length - 1) { setCurrentIndex(c => c + 1); setGuess(''); setMessage(''); } 
        else { setMessage(isArabic ? 'انتهت اللعبة! بطل!' : 'Game Over! Hero!'); onScore?.(50); }
      }, 1500);
    } else { setMessage(isArabic ? 'حاول مرة أخرى' : 'Try again'); setTimeout(() => setMessage(''), 1500); }
  };

  return (
    <div className={`p-6 text-center ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-2xl`}>
      <div className={`inline-block px-6 py-2 rounded-full mb-6 font-bold text-sm ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{isArabic ? `كلمة ${currentIndex + 1}/${words.length}` : `Word ${currentIndex + 1}/${words.length}`}</div>
      <div className="text-5xl font-black mb-6 tracking-widest drop-shadow-sm" style={{ color: gameColor }}>{scrambled}</div>
      <div className={`inline-block p-4 rounded-xl mb-6 shadow-inner ${darkMode ? 'bg-black/40' : 'bg-gray-50'}`}>
         <p className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><Lightbulb className="w-5 h-5 inline me-2 text-yellow-500"/> {isArabic ? 'تلميح:' : 'Hint:'} <span className={darkMode ? 'text-white' : 'text-gray-900'}>{words[currentIndex].hint}</span></p>
      </div>
      <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && checkGuess()} className={`w-full p-4 text-center text-2xl font-bold border-2 rounded-2xl mb-6 shadow-sm focus:outline-none transition-colors ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} placeholder={isArabic ? 'اكتب الكلمة...' : 'Type word...'} dir={isArabic ? 'rtl' : 'ltr'} />
      {message && <p className={`mb-6 font-bold text-xl ${message.includes('🎉') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      <Button onClick={checkGuess} className="w-full text-white font-black text-xl h-14 rounded-2xl shadow-lg transition-transform hover:scale-[1.02]" style={{ backgroundColor: gameColor }}>{isArabic ? 'تحقق' : 'Check'}</Button>
    </div>
  );
};

const PatternMatchGame = ({ isArabic, onScore, gameColor, darkMode }) => {
  const patterns = [{ name: isArabic ? 'دلة القهوة' : 'Coffee Pot', emoji: '☕', pairs: ['⚱️', '☕', '🫖', '🍵'] }, { name: isArabic ? 'الجمل' : 'Camel', emoji: '🐪', pairs: ['🐴', '🐪', '🦙', '🐑'] }];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSelect = (emoji) => {
    if (emoji === patterns[idx].emoji) {
      setScore(score + 1); setFeedback('✓');
      setTimeout(() => { if (idx < patterns.length - 1) { setIdx(idx + 1); setFeedback(''); } else { onScore?.(50); setFeedback('انتهت!'); } }, 1000);
    } else { setFeedback('✗'); setTimeout(() => setFeedback(''), 800); }
  };

  return (
    <div className={`p-6 text-center ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-2xl`}>
      <div className={`p-6 rounded-3xl mb-8 border-4 border-dashed ${darkMode ? 'bg-black/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
         <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{isArabic ? 'أين الرمز المطابق لـ:' : 'Find matching symbol for:'}</h3>
         <p className="text-4xl font-black" style={{ color: gameColor }}>{patterns[idx].name}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {patterns[idx].pairs.sort(() => Math.random() - 0.5).map((emoji, i) => (
          <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(emoji)} className={`text-6xl p-8 rounded-2xl shadow-sm border-b-4 transition-all ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-400'}`}>{emoji}</motion.button>
        ))}
      </div>
      {feedback && <p className={`font-bold text-2xl ${feedback === '✓' ? 'text-green-500' : 'text-red-500'}`}>{feedback}</p>}
    </div>
  );
};

const ColoringGame = ({ isArabic, onScore, darkMode }) => {
  const [selectedColor, setSelectedColor] = useState('#8D1C1C');
  const [coloredBlocks, setColoredBlocks] = useState(0);
  const colors = ['#8D1C1C', '#D4A574', '#1E3A5F', '#2E7D32', '#F9A825', '#6A1B9A', '#D84315', '#ffffff'];
  
  const handleColor = (e) => {
    if (e.currentTarget.style.backgroundColor !== selectedColor) {
      e.currentTarget.style.backgroundColor = selectedColor;
      setColoredBlocks(prev => {
        if (prev + 1 === 64) onScore?.(30); // يعطيه 30 نقطة إذا أكمل التلوين
        return prev + 1;
      });
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-2xl`}>
      <div className={`p-4 rounded-xl mb-6 text-center shadow-inner ${darkMode ? 'bg-black/40 text-white' : 'bg-gray-100 text-gray-900'}`}>
         <h3 className="text-xl font-black">{isArabic ? 'اختر لوناً ولون السدو!' : 'Choose a color and paint!'}</h3>
      </div>
      <div className={`flex justify-center flex-wrap gap-3 mb-8 p-4 rounded-2xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {colors.map(color => (
          <button key={color} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full border-4 transition-transform ${selectedColor === color ? 'border-gray-500 scale-110' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className="flex justify-center mb-6">
         <div className={`grid grid-cols-8 gap-1 p-4 rounded-2xl shadow-inner ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
           {Array.from({ length: 64 }).map((_, i) => (
             <motion.div key={i} whileHover={{ scale: 1.1, zIndex: 10 }} className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer bg-white border border-gray-300" onClick={handleColor} />
           ))}
         </div>
      </div>
    </div>
  );
};

const StoryTime = ({ isArabic, onScore, gameColor, darkMode }) => {
  const stories = [
    { title: isArabic ? 'الغواص الشجاع' : 'The Brave Pearl Diver', content: isArabic ? 'في قديم الزمان، كان هناك غواص شجاع اسمه أحمد. يغوص في أعماق البحر بحثاً عن اللؤلؤ الثمين. في أحد الأيام، وجد لؤلؤة كبيرة ونادرة جداً تضيء في الظلام...' : 'Long ago, a brave diver named Ahmed dived deep searching for pearls. One day, he found a rare glowing pearl...', image: '⚓' },
    { title: isArabic ? 'نسّاجة السدو' : 'The Sadu Weaver', content: isArabic ? 'كانت جدتي فاطمة أمهر نسّاجة في القبيلة. علمتني كيف أنسج أجمل الأنماط باستخدام الصوف الملون. كل نمط يحكي قصة من قصص أجدادنا...' : 'Grandma Fatima was the best weaver. She taught me to weave beautiful patterns using colored wool. Each pattern tells a story...', image: '🧶' }
  ];

  const [currentStory, setCurrentStory] = useState(0);

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-b-2xl`}>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {stories.map((_, i) => (
          <Button key={i} size="sm" className={`font-bold rounded-xl border-2 transition-colors px-4 ${currentStory === i ? 'text-white' : 'bg-transparent'}`} style={currentStory === i ? { backgroundColor: gameColor, borderColor: gameColor } : { borderColor: gameColor, color: gameColor }} 
            onClick={() => { setCurrentStory(i); onScore?.(10); }}>
            {isArabic ? `قصة ${i + 1}` : `Story ${i + 1}`}
          </Button>
        ))}
      </div>
      <motion.div key={currentStory} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-8 text-center rounded-3xl border ${darkMode ? 'bg-black/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
         <div className="text-7xl mb-6 drop-shadow-md">{stories[currentStory].image}</div>
         <h3 className={`text-2xl font-black mb-6 pb-4 border-b ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>{stories[currentStory].title}</h3>
         <p className={`text-lg leading-loose font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} dir={isArabic ? 'rtl' : 'ltr'}>{stories[currentStory].content}</p>
      </motion.div>
    </div>
  );
};

// --- مكون المرشد الذكي 🐱 ---
const AIMentorChat = ({ isArabic, onClose, darkMode, isHeritage }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: isArabic ? 'يا هلا بالبطل! 🐱🇰🇼 أنا مرشدك الذكي، تبيني أعطيك معلومة عن ديرتنا ولا أذكرك بواجباتك؟' : 'Hello Hero! 🐱🇰🇼 I am your AI Mentor. Need a Kuwait fact or a homework reminder?', sender: 'ai' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const chatRef = useRef(null);

  const themeColor = isHeritage ? '#8D1C1C' : '#F59E0B';

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 1500); 
  };

  const handleAction = (type) => {
    const userMsgText = type === 'fact' ? (isArabic ? 'أبي معلومة عن الكويت' : 'Tell me a fact') : (isArabic ? 'ذكرني بواجباتي' : 'Remind me of homework');
    setMessages(prev => [...prev, { id: Date.now(), text: userMsgText, sender: 'user' }]);
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = '';
      if (type === 'fact') {
        const facts = isArabic 
          ? ['هل تعلم أن أبراج الكويت تم افتتاحها عام 1979؟ 🗼✨', 'هل تعلم أن ألوان علم الكويت ترمز للسلام والدم والصحراء والبحر؟ 🇰🇼']
          : ['Did you know Kuwait Towers opened in 1979? 🗼✨', 'Did you know the flag colors represent peace, blood, desert, and sea? 🇰🇼'];
        aiReply = facts[Math.floor(Math.random() * facts.length)];
      } else {
        aiReply = isArabic ? 'شاطر إنك تذكرت! روح حل واجباتك الحين وراجع دروسك عشان تصير نجم 🌟📚' : 'Smart to remember! Go do your homework to be a star student 🌟📚';
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiReply, sender: 'ai' }]);
      setIsTyping(false);
    }, 1200);
  };

  if (isClosing) {
    return (
      <div className={`p-12 text-center rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-6">👋🐱</motion.div>
        <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{isArabic ? 'مع السلامة يا بطل! أشوفك قريب..' : 'Goodbye Hero! See you soon..'}</h2>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[500px] rounded-b-2xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatRef}>
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl font-bold leading-relaxed shadow-sm ${msg.sender === 'user' ? `text-white rounded-tr-none` : `rounded-tl-none border-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}`} style={msg.sender === 'user' ? { backgroundColor: themeColor } : {}}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className={`p-4 rounded-2xl rounded-tl-none border-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>
      <div className={`p-4 border-t-2 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} rounded-b-2xl flex flex-col gap-3`}>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" className={`flex-1 font-bold border-2 hover:bg-opacity-10 ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`} style={{ color: themeColor, borderColor: themeColor }} onClick={() => handleAction('fact')} disabled={isTyping}>
            <Lightbulb className="w-4 h-4 me-2" /> {isArabic ? 'عطني معلومة' : 'Tell me a fact'}
          </Button>
          <Button variant="outline" className={`flex-1 font-bold border-2 hover:bg-opacity-10 ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`} style={{ color: themeColor, borderColor: themeColor }} onClick={() => handleAction('hw')} disabled={isTyping}>
            <BookOpen className="w-4 h-4 me-2" /> {isArabic ? 'الواجبات' : 'Homework'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- المكون الرئيسي ---

const KidsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const [activeGame, setActiveGame] = useState(null);
  const [activeTab, setActiveTab] = useState('games');
  const [totalPoints, setTotalPoints] = useState(250); 
  const [isMentorOpen, setIsMentorOpen] = useState(false); 
  
  // سجل الإنجازات (فهرس التتبع)
  const [scoreHistory, setScoreHistory] = useState([
    { id: 1, activity: isArabic ? 'مكافأة الدخول اليومي' : 'Daily Login Bonus', points: 200, time: isArabic ? 'منذ ساعة' : '1 hour ago', icon: '🎁' },
    { id: 2, activity: isArabic ? 'استكشاف التراث' : 'Exploring Heritage', points: 50, time: isArabic ? 'منذ ساعتين' : '2 hours ago', icon: '🌟' }
  ]);

  const kidsColors = { primary: '#F59E0B', secondary: '#EC4899', accent: '#8B5CF6', success: '#10B981', info: '#3B82F6', danger: '#EF4444' };

  const games = [
    { id: 'memory', title: isArabic ? 'لعبة الذاكرة' : 'Memory Game', description: isArabic ? 'اختبر ذاكرتك وجد الأزواج' : 'Test your memory and find pairs', icon: Brain, color: kidsColors.primary, component: MemoryGame },
    { id: 'quiz', title: isArabic ? 'اختبار التراث' : 'Heritage Quiz', description: isArabic ? 'اختبر معلوماتك' : 'Test your knowledge', icon: Lightbulb, color: kidsColors.secondary, component: QuizGame },
    { id: 'scramble', title: isArabic ? 'رتب الحروف' : 'Word Scramble', description: isArabic ? 'رتب الحروف لتكوين الكلمة' : 'Unscramble the letters', icon: Puzzle, color: kidsColors.accent, component: WordScrambleGame },
    { id: 'pattern', title: isArabic ? 'مطابقة الأنماط' : 'Pattern Match', description: isArabic ? 'جد الرمز المطابق' : 'Find the matching symbol', icon: Target, color: kidsColors.success, component: PatternMatchGame },
    { id: 'coloring', title: isArabic ? 'تلوين السدو' : 'Sadu Coloring', description: isArabic ? 'لون نمط السدو' : 'Color the Sadu pattern', icon: Palette, color: kidsColors.info, component: ColoringGame },
    { id: 'story', title: isArabic ? 'وقت القصة' : 'Story Time', description: isArabic ? 'استمع لقصص التراث' : 'Listen to heritage stories', icon: BookOpen, color: kidsColors.danger, component: StoryTime }
  ];

  const rewardBoxes = [
    { id: 'tabbab', title: isArabic ? 'صندوق التبَّاب' : 'The Tabbab Box', pointsReq: 1500, icon: '🎁', color: '#F59E0B', desc: isArabic ? 'التباب هو الصبي الذي يرافق البحارة ليتعلم. خطوة البداية!' : 'The young boy who accompanies sailors. The beginning!', items: [{ text: isArabic ? '"بقشة" حلويات تراثية كويتية' : 'Traditional Sweets Bag', icon: '🍬' }, { text: isArabic ? 'كراسة "السنع" لآداب المجلس' : 'Etiquette Coloring Book', icon: '🖍️' }, { text: isArabic ? 'وسام "بطل دروازة" الحقيقي' : 'Real Darwaza Hero Pin', icon: '🏅' }, { text: isArabic ? 'لعبة الدامة أو الدوامة الخشبية' : 'Traditional Wooden Game', icon: '🎲' }] },
    { id: 'nokhadha', title: isArabic ? 'صندوق النوخذة' : 'The Nokhadha Box', pointsReq: 4500, icon: '📦', color: '#3B82F6', desc: isArabic ? 'النوخذة هو قائد السفينة. الوصول لهذا الصندوق يعني أنك بطل!' : 'The ship captain. Reaching this means you are a hero!', items: [{ text: isArabic ? '👦 دشداشة وسديري | 👧 دراعة وبخنق' : '👦 Traditional Boy Outfit | 👧 Traditional Girl Dress', icon: '👕' }, { text: isArabic ? 'نموذج خشبي لسفينة "البوم" للتركيب' : 'DIY Wooden Dhow Ship Model', icon: '🛠️' }, { text: isArabic ? 'شهادة "السنع والذرابة" المعتمدة' : 'Official Etiquette Certificate', icon: '📜' }, { text: isArabic ? 'لعبة بطاقات تحدي العائلة التراثية' : 'Family Challenge Card Game', icon: '🃏' }] },
    { id: 'danah', title: isArabic ? 'صندوق الدانة الفاخر' : 'Premium Danah Box', pointsReq: 10000, icon: '👑', color: '#8B5CF6', desc: isArabic ? 'الدانة هي أندر اللؤلؤ. هذا هو الحلم الأكبر ومحتوياته قيمة!' : 'The most precious pearl. This is the ultimate dream box!', items: [{ text: isArabic ? '👦 بشت فاخر | 👧 ثوب نشل ملكي' : '👦 Royal Bisht | 👧 Royal Nashal Dress', icon: '✨' }, { text: isArabic ? 'قطعة أثرية (عملة قديمة أو لؤلؤة)' : 'Real Antique Piece (Coin or Pearl)', icon: '🏺' }, { text: isArabic ? 'درع "سفير التراث" محفور باسمك' : 'Heritage Ambassador Trophy', icon: '🏆' }, { text: isArabic ? 'البطاقة الذهبية للتجارب الحية السياحية' : 'Golden VIP Experience Ticket', icon: '🎟️' }] }
  ];

  const handleScore = (points, gameTitle) => {
    setTotalPoints(p => p + points);
    // إضافة الإنجاز للفهرس تلقائياً
    setScoreHistory(prev => [{
      id: Date.now(),
      activity: isArabic ? `لعبت ${gameTitle}` : `Played ${gameTitle}`,
      points: points,
      time: isArabic ? 'الآن' : 'Just now',
      icon: '🎮'
    }, ...prev]);
  };

  const pageBg = darkMode ? (isHeritage ? 'bg-[#1A1A1A]' : 'bg-[#0F172A]') : (isHeritage ? 'bg-[#FDF6E3]' : 'bg-gray-50');

  const tabBtnStyle = `flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-black transition-all border-b-[6px] ` + 
    (isHeritage 
      ? "data-[state=active]:bg-[#8D1C1C] data-[state=active]:text-white data-[state=active]:border-[#D97706] text-[#8D1C1C] border-transparent" 
      : (darkMode ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-400 text-gray-400 border-transparent" : "data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-pink-500 text-gray-600 border-transparent")
    );

  return (
    <div className={`min-h-screen ${pageBg} relative pb-20 transition-colors duration-500`}>
      <div className="relative max-w-7xl mx-auto px-4 pt-12 relative z-10 text-center">
        
        <div className={`w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-amber-400'}`}>
          <Gamepad2 className="w-12 h-12 text-white" />
        </div>
        <div className={`inline-block px-8 py-2 rounded-full mb-4 ${darkMode ? 'bg-black/40' : 'bg-white/80 shadow-sm'}`}>
          <h1 className={`text-4xl md:text-5xl font-black ${isHeritage ? 'text-[#8D1C1C]' : 'text-blue-600'}`}>{isArabic ? 'عالم تراث الأطفال' : 'Kids Heritage World'}</h1>
        </div>
        <br/>
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-white px-8 py-3 rounded-full font-black shadow-lg border-2 border-white/50">
          <Star className="w-6 h-6 fill-white" /> <span className="text-xl">{totalPoints} {isArabic ? 'نقطة بطل' : 'Points'}</span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-10">
          <TabsList className={`w-full grid grid-cols-3 gap-3 mb-12 p-2 rounded-2xl h-auto border-2 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
            <TabsTrigger value="games" className={tabBtnStyle}><Gamepad2 className="w-5 h-5" /> {isArabic ? 'الألعاب' : 'Games'}</TabsTrigger>
            <TabsTrigger value="box" className={tabBtnStyle}><Package className="w-5 h-5" /> {isArabic ? 'الصندوق' : 'Box'}</TabsTrigger>
            <TabsTrigger value="achievements" className={tabBtnStyle}><ListOrdered className="w-5 h-5" /> {isArabic ? 'الإنجازات' : 'Awards'}</TabsTrigger>
          </TabsList>

          {/* 1. قسم الألعاب */}
          <TabsContent value="games">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((g) => (
                <motion.div key={g.id} whileHover={{ y: -10 }} className={`p-8 rounded-[2.5rem] shadow-2xl border-b-[10px] flex flex-col h-full cursor-pointer transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ borderColor: g.color }} onClick={() => setActiveGame(g.id)}>
                   <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner mx-auto" style={{ backgroundColor: g.color }}><g.icon className="text-white w-10 h-10" /></div>
                   <div className={`inline-block px-5 py-1.5 rounded-lg mb-3 mx-auto ${darkMode ? 'bg-black/30' : 'bg-gray-100'}`}>
                      <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{g.title}</h3>
                   </div>
                   <p className="text-muted-foreground mb-8 flex-1 font-bold">{g.description}</p>
                   <Button className="w-full font-black py-7 rounded-2xl text-white text-xl shadow-lg hover:scale-[1.02] transition-transform" style={{ backgroundColor: g.color }}>{isArabic ? 'العب الآن!' : 'Play Now!'}</Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* 2. قسم الصندوق */}
          <TabsContent value="box">
            <div className="grid lg:grid-cols-3 gap-8">
              {rewardBoxes.map((box, index) => {
                const progress = Math.min((totalPoints / box.pointsReq) * 100, 100);
                const isUnlocked = totalPoints >= box.pointsReq;
                
                return (
                  <motion.div key={box.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} 
                    className={`p-8 rounded-[2.5rem] shadow-xl border-4 flex flex-col h-full transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'} ${isUnlocked ? 'ring-4 ring-offset-4 ring-offset-transparent' : 'opacity-90'}`}
                    style={{ borderColor: box.color, ringColor: isUnlocked ? box.color : 'transparent' }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner text-4xl" style={{ backgroundColor: `${box.color}20` }}>
                        {box.icon}
                      </div>
                      {isUnlocked ? <Unlock className="w-8 h-8" style={{color: box.color}} /> : <Lock className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />}
                    </div>
                    
                    <div className={`inline-block px-4 py-1.5 rounded-lg mb-3 w-fit mx-auto ${darkMode ? 'bg-black/30' : 'bg-gray-100'}`}>
                      <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{box.title}</h2>
                    </div>
                    <p className={`text-sm font-bold mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{box.desc}</p>
                    
                    <div className={`p-4 rounded-2xl mb-6 border-2 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex justify-between text-sm font-black mb-2" style={{ color: box.color }}>
                        <span>{isArabic ? 'نقاطك' : 'Your Points'}</span>
                        <span>{totalPoints} / {box.pointsReq}</span>
                      </div>
                      <Progress value={progress} className="h-3" indicatorColor={box.color} />
                    </div>

                    <div className="flex-1 space-y-3 mb-8 text-start">
                      <h4 className={`font-black text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{isArabic ? 'محتويات الصندوق:' : 'Box Contents:'}</h4>
                      {box.items.map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${darkMode ? 'bg-black/20 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                          <span className="text-2xl bg-white/50 p-1.5 rounded-lg shadow-sm">{item.icon}</span>
                          <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full font-black py-7 rounded-2xl text-xl shadow-lg transition-transform ${isUnlocked ? 'text-white hover:scale-[1.02] hover:shadow-xl animate-pulse' : 'opacity-50 cursor-not-allowed text-white'}`}
                      style={{ backgroundColor: box.color }} disabled={!isUnlocked}
                    >
                      {isUnlocked ? (isArabic ? 'افتح الصندوق!' : 'Open Box!') : (isArabic ? 'اجمع نقاط أكثر' : 'Collect more points')}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* 3. قسم الإنجازات (فهرس تتبع النقاط الجديد) */}
          <TabsContent value="achievements">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`p-8 md:p-12 rounded-[2.5rem] shadow-xl border-4 transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
              <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-8 border-b border-gray-200/20">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <ListOrdered className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-start flex-1">
                  <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{isArabic ? 'سجل الأبطال' : 'Heroes Log'}</h2>
                  <p className={`text-lg font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{isArabic ? 'تابع كل الألعاب والنقاط التي حصدتها هنا!' : 'Track all your games and collected points here!'}</p>
                </div>
                <div className={`p-6 rounded-2xl border-2 text-center min-w-[220px] ${darkMode ? 'bg-gray-900 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                   <span className="block text-sm font-bold mb-2 text-purple-600">{isArabic ? 'مجموع نقاطك الحالي' : 'Total Points Collected'}</span>
                   <div className="flex justify-center items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-xl font-black shadow-md mx-auto w-fit">
                     <Star className="w-5 h-5 fill-white" /> <span className="text-2xl">{totalPoints}</span>
                   </div>
                </div>
              </div>

              {/* القائمة (الفهرس) */}
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {scoreHistory.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                    className={`flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border-2 transition-all hover:scale-[1.01] ${darkMode ? 'bg-black/30 border-gray-700 hover:border-purple-500/50' : 'bg-gray-50 border-gray-100 hover:border-purple-300'}`}>
                    <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                      <span className="text-4xl bg-white/50 dark:bg-gray-800 p-3 rounded-2xl shadow-sm">{item.icon}</span>
                      <div className="text-start">
                        <span className={`block font-black text-xl mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.activity}</span>
                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.time}</span>
                      </div>
                    </div>
                    <div className="font-black text-xl text-green-600 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-2xl border-2 border-green-200 dark:border-green-800/50 shadow-sm w-full sm:w-auto text-center">
                      +{item.points} {isArabic ? 'نقطة' : 'pts'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* AI Mentor Teaser */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-16 p-10 rounded-[2.5rem] bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white text-center shadow-2xl border-4 border-white/20">
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-inner border-2 border-white/50">
            <span className="text-6xl drop-shadow-md">🐱</span>
          </div>
          <h3 className="text-4xl font-black mb-4 drop-shadow-sm">{isArabic ? 'المرشد الذكي الكويتي' : 'Kuwaiti AI Mentor'}</h3>
          <p className="mb-8 max-w-xl mx-auto font-bold text-xl opacity-95 leading-relaxed">{isArabic ? 'صديقك الذكي يتحدث اللهجة الكويتية، يجاوب على أسئلتك ويذكرك بواجباتك!' : 'Your smart friend speaks Kuwaiti dialect and helps you learn!'}</p>
          <Button onClick={() => setIsMentorOpen(true)} className="bg-white text-purple-600 font-black hover:bg-gray-100 hover:scale-105 transition-transform rounded-2xl h-16 px-12 text-xl shadow-xl">
            {isArabic ? 'تحدث مع القط المرشد 💬' : 'Chat with Mentor 💬'} 
          </Button>
        </motion.div>
      </div>

      {/* نافذة الألعاب */}
      <Dialog open={activeGame !== null} onOpenChange={() => setActiveGame(null)}>
        <DialogContent className={`max-w-2xl p-0 border-0 overflow-hidden shadow-2xl rounded-[2.5rem] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`} dir={isArabic ? 'rtl' : 'ltr'}>
          {activeGame && (() => {
            const g = games.find(x => x.id === activeGame);
            const GameComp = g.component;
            return (
              <>
                <div className="p-6 text-white flex justify-between items-center shadow-md relative z-10" style={{ backgroundColor: g.color }}>
                   <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-xl"><g.icon className="w-7 h-7" /></div>
                      <DialogTitle className="font-black text-2xl text-white m-0 border-0">{g.title}</DialogTitle>
                   </div>
                   <button onClick={() => setActiveGame(null)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"><X className="w-6 h-6"/></button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                   {/* تمرير اسم اللعبة (g.title) للدالة لكي تسجل في الفهرس */}
                   <GameComp isArabic={isArabic} onClose={() => setActiveGame(null)} onScore={(p) => { handleScore(p, g.title); setActiveGame(null); }} gameColor={g.color} darkMode={darkMode} />
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* نافذة القط المرشد */}
      <Dialog open={isMentorOpen} onOpenChange={() => setIsMentorOpen(false)}>
        <DialogContent className={`max-w-md p-0 border-0 overflow-hidden shadow-2xl rounded-[2.5rem] ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`} dir={isArabic ? 'rtl' : 'ltr'}>
           <div className={`p-6 text-white flex items-center justify-between shadow-md relative z-10 ${isHeritage ? 'bg-[#8D1C1C]' : 'bg-gradient-to-r from-amber-500 to-pink-500'}`}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl text-3xl">🐱</div>
                <DialogTitle className="font-black text-2xl text-white m-0 border-0">{isArabic ? 'المرشد الذكي' : 'AI Mentor'}</DialogTitle>
              </div>
              <button onClick={() => setIsMentorOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"><X className="w-6 h-6"/></button>
           </div>
           <AIMentorChat isArabic={isArabic} onClose={() => setIsMentorOpen(false)} darkMode={darkMode} isHeritage={isHeritage} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KidsPage;