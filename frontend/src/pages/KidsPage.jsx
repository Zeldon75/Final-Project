import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { SaduCard, SaduDivider } from '../components/SaduPattern';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Gamepad2,
  Package,
  Trophy,
  Star,
  Gift,
  BookOpen,
  Mic,
  Puzzle,
  Lock,
  ChevronRight,
  Brain,
  Target,
  Lightbulb,
  RotateCcw,
  Check,
  X,
  Volume2
} from 'lucide-react';

// Memory Game Component
const MemoryGame = ({ isArabic, onClose }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const symbols = ['🏰', '⚓', '🐪', '🌴', '☕', '📿', '🎭', '🏺'];

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, isFlipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched(m => [...m, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm">
          <span className="font-bold">{isArabic ? 'المحاولات:' : 'Moves:'}</span> {moves}
        </div>
        <Button variant="outline" size="sm" onClick={initGame}>
          <RotateCcw className="w-4 h-4 me-1" />
          {isArabic ? 'إعادة' : 'Reset'}
        </Button>
      </div>
      
      {gameWon ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-bold mb-2">{isArabic ? 'أحسنت!' : 'Congratulations!'}</h3>
          <p className="text-muted-foreground mb-4">
            {isArabic ? `أكملت اللعبة في ${moves} محاولة` : `You completed it in ${moves} moves`}
          </p>
          <Button onClick={initGame}>{isArabic ? 'العب مرة أخرى' : 'Play Again'}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg cursor-pointer flex items-center justify-center text-3xl ${
                flipped.includes(card.id) || matched.includes(card.id)
                  ? 'bg-amber-100'
                  : 'bg-gradient-to-br from-amber-400 to-pink-500'
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              {(flipped.includes(card.id) || matched.includes(card.id)) ? card.symbol : '❓'}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Quiz Game Component
const QuizGame = ({ isArabic, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = isArabic ? [
    {
      question: "ما هو الاسم القديم للكويت؟",
      options: ["القرين", "البحرين", "عمان", "قطر"],
      correct: 0
    },
    {
      question: "متى تأسست دولة الكويت الحديثة؟",
      options: ["1752", "1850", "1961", "1990"],
      correct: 2
    },
    {
      question: "ما هو النشاط الاقتصادي الرئيسي في الكويت قديماً؟",
      options: ["الزراعة", "صيد اللؤلؤ", "التعدين", "الصناعة"],
      correct: 1
    },
    {
      question: "ما اسم السوق التقليدي الشهير في الكويت؟",
      options: ["سوق واقف", "سوق المباركية", "سوق الحميدية", "خان الخليلي"],
      correct: 1
    },
    {
      question: "ما هو نوع النسيج التقليدي الكويتي؟",
      options: ["الحرير", "السدو", "القطن", "الكتان"],
      correct: 1
    }
  ] : [
    {
      question: "What was the old name of Kuwait?",
      options: ["Al-Qurain", "Bahrain", "Oman", "Qatar"],
      correct: 0
    },
    {
      question: "When was modern Kuwait established?",
      options: ["1752", "1850", "1961", "1990"],
      correct: 2
    },
    {
      question: "What was the main economic activity in old Kuwait?",
      options: ["Agriculture", "Pearl Diving", "Mining", "Industry"],
      correct: 1
    },
    {
      question: "What is the famous traditional market in Kuwait?",
      options: ["Souq Waqif", "Souq Al-Mubarakiya", "Al-Hamidiyah", "Khan El-Khalili"],
      correct: 1
    },
    {
      question: "What is the traditional Kuwaiti weaving called?",
      options: ["Silk", "Sadu", "Cotton", "Linen"],
      correct: 1
    }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <div className="text-center py-8">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
          score >= 4 ? 'bg-green-500' : score >= 2 ? 'bg-yellow-500' : 'bg-red-500'
        }`}>
          <span className="text-3xl text-white">{score}/{questions.length}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">
          {score >= 4 ? (isArabic ? 'ممتاز!' : 'Excellent!') : 
           score >= 2 ? (isArabic ? 'جيد!' : 'Good!') : 
           (isArabic ? 'حاول مرة أخرى' : 'Try Again')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isArabic ? `أجبت على ${score} من ${questions.length} أسئلة بشكل صحيح` : 
           `You answered ${score} out of ${questions.length} questions correctly`}
        </p>
        <Button onClick={resetQuiz}>{isArabic ? 'إعادة الاختبار' : 'Retry Quiz'}</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>{isArabic ? `السؤال ${currentQuestion + 1}` : `Question ${currentQuestion + 1}`}</span>
          <span>{isArabic ? `النقاط: ${score}` : `Score: ${score}`}</span>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} />
      </div>

      <h3 className="text-lg font-bold mb-4">{questions[currentQuestion].question}</h3>

      <div className="space-y-2">
        {questions[currentQuestion].options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full justify-start h-auto py-3 ${
              selectedAnswer !== null
                ? index === questions[currentQuestion].correct
                  ? 'bg-green-100 border-green-500'
                  : selectedAnswer === index
                    ? 'bg-red-100 border-red-500'
                    : ''
                : ''
            }`}
            onClick={() => selectedAnswer === null && handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            {selectedAnswer !== null && index === questions[currentQuestion].correct && (
              <Check className="w-4 h-4 me-2 text-green-500" />
            )}
            {selectedAnswer === index && index !== questions[currentQuestion].correct && (
              <X className="w-4 h-4 me-2 text-red-500" />
            )}
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Word Scramble Game
const WordScrambleGame = ({ isArabic, onClose }) => {
  const words = isArabic 
    ? [
        { word: "الكويت", hint: "اسم البلد" },
        { word: "السدو", hint: "نسيج تقليدي" },
        { word: "الديوانية", hint: "مكان للتجمع" },
        { word: "المجبوس", hint: "طبق شهير" },
        { word: "اللؤلؤ", hint: "كنز البحر" }
      ]
    : [
        { word: "KUWAIT", hint: "Country name" },
        { word: "PEARL", hint: "Sea treasure" },
        { word: "SADU", hint: "Traditional weaving" },
        { word: "DHOW", hint: "Traditional boat" },
        { word: "DALLAH", hint: "Coffee pot" }
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  const scrambleWord = useCallback((word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  useEffect(() => {
    setScrambled(scrambleWord(words[currentIndex].word));
  }, [currentIndex, scrambleWord, words]);

  const checkGuess = () => {
    if (guess.toUpperCase() === words[currentIndex].word.toUpperCase() || guess === words[currentIndex].word) {
      setScore(s => s + 1);
      setMessage(isArabic ? 'صحيح! 🎉' : 'Correct! 🎉');
      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(c => c + 1);
          setGuess('');
          setMessage('');
        } else {
          setMessage(isArabic ? `انتهت اللعبة! النتيجة: ${score + 1}/${words.length}` : `Game Over! Score: ${score + 1}/${words.length}`);
        }
      }, 1500);
    } else {
      setMessage(isArabic ? 'حاول مرة أخرى' : 'Try again');
    }
  };

  return (
    <div className="p-4 text-center">
      <div className="mb-4">
        <span className="text-sm text-muted-foreground">
          {isArabic ? `الكلمة ${currentIndex + 1} من ${words.length}` : `Word ${currentIndex + 1} of ${words.length}`}
        </span>
      </div>

      <div className="text-4xl font-bold mb-4 tracking-widest text-amber-600">
        {scrambled}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {isArabic ? 'التلميح:' : 'Hint:'} {words[currentIndex].hint}
      </p>

      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
        className="w-full p-3 text-center text-lg border-2 rounded-lg mb-4"
        placeholder={isArabic ? 'اكتب الكلمة...' : 'Type the word...'}
        dir={isArabic ? 'rtl' : 'ltr'}
      />

      {message && (
        <p className={`mb-4 font-bold ${message.includes('صحيح') || message.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      <Button onClick={checkGuess} className="w-full bg-gradient-to-r from-amber-400 to-pink-500">
        {isArabic ? 'تحقق' : 'Check'}
      </Button>
    </div>
  );
};

const KidsPage = () => {
  const { isHeritage, darkMode, themeColors } = useTheme();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const [activeGame, setActiveGame] = useState(null);

  const kidsColors = {
    primary: '#F59E0B',
    secondary: '#EC4899',
    accent: '#8B5CF6',
    success: '#10B981'
  };

  const games = [
    {
      id: 'memory',
      title: isArabic ? 'لعبة الذاكرة' : 'Memory Game',
      description: isArabic ? 'اختبر ذاكرتك وجد الأزواج المتشابهة' : 'Test your memory and find matching pairs',
      icon: Brain,
      color: kidsColors.primary,
      component: MemoryGame
    },
    {
      id: 'quiz',
      title: isArabic ? 'اختبار التراث' : 'Heritage Quiz',
      description: isArabic ? 'اختبر معلوماتك عن تاريخ الكويت' : 'Test your knowledge about Kuwait history',
      icon: Lightbulb,
      color: kidsColors.secondary,
      component: QuizGame
    },
    {
      id: 'scramble',
      title: isArabic ? 'رتب الحروف' : 'Word Scramble',
      description: isArabic ? 'رتب الحروف لتكوين الكلمة الصحيحة' : 'Unscramble the letters to form the correct word',
      icon: Puzzle,
      color: kidsColors.accent,
      component: WordScrambleGame
    }
  ];

  const achievements = [
    { name: isArabic ? 'المستكشف الصغير' : 'Little Explorer', earned: true },
    { name: isArabic ? 'حافظ الأمثال' : 'Proverb Keeper', earned: true },
    { name: isArabic ? 'صديق التراث' : 'Heritage Friend', earned: false },
    { name: isArabic ? 'الحكواتي' : 'Storyteller', earned: false }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#1A1A2E]' : 'bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50'}`}>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='4' fill='%23F59E0B'/%3E%3Ccircle cx='10' cy='10' r='3' fill='%23EC4899'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%238B5CF6'/%3E%3C/svg%3E")`
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
          >
            <Gamepad2 className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            {isArabic ? 'عالم تراث الأطفال' : 'Kids Heritage World'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic
              ? 'تعلم واستمتع! اكتشف تراث الكويت من خلال الألعاب والمغامرات الممتعة.'
              : 'Learn and have fun! Discover Kuwait heritage through games and exciting adventures.'}
          </p>
        </motion.div>

        {/* Interactive Games Section */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isArabic ? '🎮 الألعاب التفاعلية' : '🎮 Interactive Games'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div 
                className={`p-6 rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-xl border-4 cursor-pointer`}
                style={{ borderColor: game.color }}
                onClick={() => setActiveGame(game.id)}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: game.color }}
                >
                  <game.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                <Button
                  className="w-full rounded-xl h-12"
                  style={{ backgroundColor: game.color }}
                  data-testid={`play-${game.id}-btn`}
                >
                  {isArabic ? 'العب الآن' : 'Play Now'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heritage Box & Achievements */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Heritage Box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-xl border-4 border-pink-400`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isArabic ? 'صندوق التراث' : 'Heritage Box'}</h2>
                <p className="text-sm text-muted-foreground">{isArabic ? 'اشتراك شهري' : 'Monthly subscription'}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              {isArabic
                ? 'صندوق شهري يطور آداب الطفل وخطابه. يتضمن أنشطة وقصص ومفاجآت!'
                : 'Monthly box developing children\'s etiquette and speech. Includes activities, stories, and surprises!'}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: BookOpen, label: isArabic ? 'قصص' : 'Stories' },
                { icon: Puzzle, label: isArabic ? 'أنشطة' : 'Activities' },
                { icon: Gift, label: isArabic ? 'مفاجآت' : 'Surprises' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-pink-100 rounded-xl flex items-center justify-center mb-2">
                    <item.icon className="w-6 h-6 text-pink-500" />
                  </div>
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              data-testid="subscribe-heritage-box-btn"
            >
              {isArabic ? 'اشترك الآن - 5 د.ك/شهر' : 'Subscribe Now - 5 KWD/month'}
            </Button>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-white'} shadow-xl border-4 border-purple-400`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isArabic ? 'صندوق الإنجازات' : 'Achievement Box'}</h2>
                <p className="text-sm text-muted-foreground">{isArabic ? 'اجمع النقاط واحصل على هدايا' : 'Collect points and get prizes'}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100'
                      : darkMode ? 'bg-white/5' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className={`w-5 h-5 ${achievement.earned ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    <span className={achievement.earned ? 'font-medium' : 'text-muted-foreground'}>{achievement.name}</span>
                  </div>
                  {achievement.earned && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {isArabic ? 'مكتمل' : 'Earned'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-purple-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{isArabic ? 'النقاط المجمعة' : 'Points Collected'}</span>
                <span className="font-bold text-purple-600">250 / 500</span>
              </div>
              <Progress value={50} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {isArabic ? '250 نقطة أخرى لفتح المستوى التالي!' : '250 more points to unlock the next level!'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* AI Mentor Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-12 p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white text-center`}
        >
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🤖</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {isArabic ? 'المرشد الذكي الكويتي' : 'Kuwaiti AI Mentor'}
          </h3>
          <p className="mb-6 max-w-lg mx-auto opacity-90">
            {isArabic
              ? 'صديقك الذكي يتحدث اللهجة الكويتية ويساعدك في الكتابة والقراءة والتعلم!'
              : 'Your smart friend speaks Kuwaiti dialect and helps you with writing, reading, and learning!'}
          </p>
          <Button
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-white/90 rounded-xl h-12 px-8"
            data-testid="meet-ai-mentor-btn"
          >
            {isArabic ? 'قابل المرشد' : 'Meet the Mentor'}
            <ChevronRight className={`w-5 h-5 ms-2 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
        </motion.div>
      </div>

      {/* Game Dialog */}
      <Dialog open={activeGame !== null} onOpenChange={() => setActiveGame(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {games.find(g => g.id === activeGame)?.title}
            </DialogTitle>
          </DialogHeader>
          {activeGame === 'memory' && <MemoryGame isArabic={isArabic} onClose={() => setActiveGame(null)} />}
          {activeGame === 'quiz' && <QuizGame isArabic={isArabic} onClose={() => setActiveGame(null)} />}
          {activeGame === 'scramble' && <WordScrambleGame isArabic={isArabic} onClose={() => setActiveGame(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KidsPage;
