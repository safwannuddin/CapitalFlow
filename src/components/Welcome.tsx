import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, Wallet, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

const slides = [
  {
    title: "Welcome to FinDash 2025",
    description: "The future of financial portfolio management is here. Let's set up your personalized dashboard.",
    icon: Rocket,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "What's Your Investment Goal?",
    description: "Help us understand your financial objectives better.",
    icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-50",
    options: [
      { id: 'growth', label: 'Wealth Growth', description: 'Focus on long-term capital appreciation' },
      { id: 'income', label: 'Regular Income', description: 'Generate steady income through dividends' },
      { id: 'balanced', label: 'Balanced Approach', description: 'Mix of growth and income' },
    ],
  },
  {
    title: "Investment Preferences",
    description: "Select your preferred investment types.",
    icon: Wallet,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    options: [
      { id: 'stocks', label: 'Stocks', description: 'Public company shares' },
      { id: 'crypto', label: 'Cryptocurrency', description: 'Digital assets' },
      { id: 'bonds', label: 'Bonds', description: 'Fixed-income securities' },
    ],
  },
];

export const Welcome: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const { completeOnboarding, generateMockData } = useStore();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      generateMockData(selections);
      completeOnboarding();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSelection = (slideIndex: number, optionId: string) => {
    setSelections(prev => {
      const key = `slide${slideIndex}`;
      const current = prev[key] || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      return { ...prev, [key]: updated };
    });
  };

  const isOptionSelected = (slideIndex: number, optionId: string) => {
    const key = `slide${slideIndex}`;
    return selections[key]?.includes(optionId) || false;
  };

  const canProceed = (slideIndex: number) => {
    if (!slides[slideIndex].options) return true;
    const key = `slide${slideIndex}`;
    return selections[key]?.length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className={cn("p-3 rounded-xl", slides[currentSlide].bg)}>
              {React.createElement(slides[currentSlide].icon, { className: cn("w-8 h-8", slides[currentSlide].color) })}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{slides[currentSlide].title}</h1>
              <p className="text-gray-500 mt-1">{slides[currentSlide].description}</p>
            </div>
          </div>

          {slides[currentSlide].options && (
            <div className="space-y-4 mb-8">
              {slides[currentSlide].options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelection(currentSlide, option.id)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                    isOptionSelected(currentSlide, option.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    {isOptionSelected(currentSlide, option.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    currentSlide === index ? "bg-blue-500" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!canProceed(currentSlide)}
              className={cn(
                "px-6 py-2 rounded-xl font-medium flex items-center space-x-2",
                canProceed(currentSlide)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <span>{currentSlide === slides.length - 1 ? "Get Started" : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};