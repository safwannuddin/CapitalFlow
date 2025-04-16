import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, PieChart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

export const PortfolioOverview: React.FC = () => {
  const { portfolioSummary, userProfile, generateMockData } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      generateMockData(userProfile || undefined);
      setIsRefreshing(false);
    }, 1000);
  };

  const cards = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(portfolioSummary.totalValue),
      icon: DollarSign,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Change',
      value: formatCurrency(portfolioSummary.totalChange),
      icon: portfolioSummary.totalChange >= 0 ? TrendingUp : TrendingDown,
      color: portfolioSummary.totalChange >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: portfolioSummary.totalChange >= 0 ? 'text-green-600' : 'text-red-600',
      borderColor: portfolioSummary.totalChange >= 0 ? 'border-green-200' : 'border-red-200',
    },
    {
      title: '24h Change',
      value: `${portfolioSummary.totalChangePercent.toFixed(2)}%`,
      icon: Percent,
      color: portfolioSummary.totalChangePercent >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: portfolioSummary.totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600',
      borderColor: portfolioSummary.totalChangePercent >= 0 ? 'border-green-200' : 'border-red-200',
    },
    {
      title: 'Asset Distribution',
      icon: PieChart,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      customContent: (
        <div className="space-y-1 mt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
              <span className="text-sm">Stocks</span>
            </div>
            <span className="text-sm font-medium">{portfolioSummary.stocksAllocation.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
              <span className="text-sm">Crypto</span>
            </div>
            <span className="text-sm font-medium">{portfolioSummary.cryptoAllocation.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
              <span className="text-sm">Bonds</span>
            </div>
            <span className="text-sm font-medium">{portfolioSummary.bondsAllocation.toFixed(1)}%</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Portfolio Overview</h2>
          {userProfile && (
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-500"
            >
              Welcome back, {userProfile.name}
            </motion.p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshData}
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-xs text-blue-600 font-medium">Refresh</span>
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              y: -4, 
              boxShadow: '0 12px 20px -5px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.2 }
            }}
            className={cn(
              'rounded-xl p-6 border shadow-sm transition-all duration-200',
              card.color,
              card.borderColor
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                {card.customContent ? (
                  card.customContent
                ) : (
                  <motion.p 
                    className="text-2xl font-bold"
                    key={card.value} // Forces re-animation when value changes
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {card.value}
                  </motion.p>
                )}
              </div>
              <motion.div 
                className={cn('p-2 rounded-lg', card.color)}
                whileHover={{ rotate: 10 }}
              >
                {React.createElement(card.icon, {
                  className: cn('h-5 w-5', card.iconColor),
                })}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};