import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, Wallet, User, DollarSign, BarChart4, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

interface UserProfile {
  name: string;
  monthlyBudget: string;
  investmentExperience: string;
  riskTolerance: string;
  goals: string[];
  preferredAssets: string[];
}

const slides = [
  {
    id: 'welcome',
    title: "Welcome to CapitalFlow",
    description: "The future of financial portfolio management is here. Let's personalize your dashboard.",
    icon: Rocket,
    color: "text-blue-500",
    bg: "bg-blue-50",
    type: 'info'
  },
  {
    id: 'personal',
    title: "Let's Get to Know You",
    description: "We'll use your information to personalize your experience.",
    icon: User,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    type: 'form',
    fields: [
      { id: 'name', label: 'Your Name', placeholder: 'Enter your name', type: 'text' },
      { id: 'monthlyBudget', label: 'Monthly Investment Budget ($)', placeholder: '500', type: 'number' }
    ]
  },
  {
    id: 'experience',
    title: "Your Investment Experience",
    description: "This helps us tailor our recommendations to your expertise level.",
    icon: BarChart4,
    color: "text-amber-500",
    bg: "bg-amber-50",
    type: 'options',
    options: [
      { id: 'beginner', label: 'Beginner', description: 'New to investing' },
      { id: 'intermediate', label: 'Intermediate', description: 'Some experience with markets' },
      { id: 'advanced', label: 'Advanced', description: 'Experienced investor' }
    ]
  },
  {
    id: 'risk',
    title: "Risk Tolerance",
    description: "How much risk are you comfortable taking with your investments?",
    icon: Target,
    color: "text-rose-500",
    bg: "bg-rose-50",
    type: 'options',
    options: [
      { id: 'conservative', label: 'Conservative', description: 'Focus on stability, minimize losses' },
      { id: 'moderate', label: 'Moderate', description: 'Balance between growth and stability' },
      { id: 'aggressive', label: 'Aggressive', description: 'Prioritize growth, accept volatility' }
    ]
  },
  {
    id: 'goals',
    title: "Investment Goals",
    description: "What are you looking to achieve with your investments?",
    icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    type: 'multi-select',
    options: [
      { id: 'retirement', label: 'Retirement', description: 'Building a nest egg for the future' },
      { id: 'house', label: 'House Purchase', description: 'Saving for a down payment' },
      { id: 'education', label: 'Education', description: 'College or university funds' },
      { id: 'income', label: 'Passive Income', description: 'Generate regular income from investments' },
      { id: 'wealth', label: 'Wealth Building', description: 'Long-term growth of assets' }
    ]
  },
  {
    id: 'assets',
    title: "Investment Preferences",
    description: "Select your preferred investment types.",
    icon: Wallet,
    color: "text-violet-500",
    bg: "bg-violet-50",
    type: 'multi-select',
    options: [
      { id: 'stocks', label: 'Stocks', description: 'Public company shares' },
      { id: 'etf', label: 'ETFs', description: 'Exchange-traded funds' },
      { id: 'crypto', label: 'Cryptocurrency', description: 'Digital assets' },
      { id: 'bonds', label: 'Bonds', description: 'Fixed-income securities' },
      { id: 'realestate', label: 'Real Estate', description: 'Property investments' }
    ]
  }
];

export const OnboardingFlow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    monthlyBudget: '',
    investmentExperience: '',
    riskTolerance: '',
    goals: [],
    preferredAssets: []
  });
  
  const { completeOnboarding, generateMockData, setUserProfile } = useStore();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      // Complete onboarding and generate initial dashboard
      setUserProfile(profile);
      generateMockData(profile);
      completeOnboarding();
    } else {
      // Animated transition to next slide
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelection = (field: string, value: string, isMulti = false) => {
    setProfile(prev => {
      if (isMulti) {
        const currentValues = prev[field as keyof UserProfile] as string[] || [];
        const updated = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        
        return {
          ...prev,
          [field]: updated
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const isOptionSelected = (field: string, value: string) => {
    const fieldValue = profile[field as keyof UserProfile];
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(value);
    }
    return fieldValue === value;
  };

  const canProceed = () => {
    const slide = slides[currentSlide];
    
    if (slide.type === 'info') return true;
    
    if (slide.type === 'form') {
      return slide.fields?.every(field => {
        const value = profile[field.id as keyof UserProfile];
        return value !== undefined && value !== '';
      }) || false;
    }
    
    if (slide.type === 'options') {
      const fieldId = slide.id === 'experience' ? 'investmentExperience' : 'riskTolerance';
      return !!profile[fieldId as keyof UserProfile];
    }
    
    if (slide.type === 'multi-select') {
      const fieldId = slide.id === 'goals' ? 'goals' : 'preferredAssets';
      return (profile[fieldId as keyof UserProfile] as string[])?.length > 0;
    }
    
    return true;
  };

  const renderSlideContent = () => {
    const slide = slides[currentSlide];
    
    if (slide.type === 'form') {
      return (
        <div className="space-y-6 mb-8">
          {slide.fields?.map(field => (
            <div key={field.id} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                value={profile[field.id as keyof UserProfile] as string}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          ))}
        </div>
      );
    }
    
    if (slide.type === 'options' || slide.type === 'multi-select') {
      const isMulti = slide.type === 'multi-select';
      const fieldId = 
        slide.id === 'experience' ? 'investmentExperience' :
        slide.id === 'risk' ? 'riskTolerance' :
        slide.id === 'goals' ? 'goals' : 'preferredAssets';
      
      return (
        <div className="space-y-4 mb-8">
          {slide.options?.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelection(fieldId, option.id, isMulti)}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                isOptionSelected(fieldId, option.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{option.label}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                {isOptionSelected(fieldId, option.id) && (
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
      );
    }
    
    // Default info slide
    return <div className="h-40 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className="text-xl text-gray-600">Let's set up your personalized investment dashboard.</p>
      </motion.div>
    </div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center"
        >
          <DollarSign className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            CapitalFlow
          </span>
        </motion.div>
      </div>
      
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
              {React.createElement(slides[currentSlide].icon, { 
                className: cn("w-8 h-8", slides[currentSlide].color) 
              })}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{slides[currentSlide].title}</h1>
              <p className="text-gray-500 mt-1">{slides[currentSlide].description}</p>
            </div>
          </div>

          {renderSlideContent()}

          <div className="flex justify-between items-center mt-8">
            <div className="flex space-x-3">
              {slides.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: currentSlide === index ? 1.2 : 1,
                    opacity: currentSlide === index ? 1 : 0.6,
                  }}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    currentSlide === index ? "bg-blue-500" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
            <div className="flex space-x-3">
              {currentSlide > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  className="px-4 py-2 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "px-6 py-2 rounded-xl font-medium flex items-center space-x-2",
                  canProceed()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                <span>{currentSlide === slides.length - 1 ? "Get Started" : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
