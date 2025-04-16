import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Lightbulb, LineChart, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

export const AIInsights: React.FC = () => {
  const { stocks, userProfile, refreshMarketInsights } = useStore();
  const [activeTab, setActiveTab] = useState<'recommendations' | 'insights'>('recommendations');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  // Simulate AI thinking process and loading of new insights
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      refreshMarketInsights();
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Hide the initial animation after 5 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter top opportunities
  const topOpportunities = [...stocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h2>
        </div>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={cn(
              "px-4 py-1 rounded-md text-sm font-medium transition-all",
              activeTab === 'recommendations'
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-600 hover:text-gray-800"
            )}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={cn(
              "px-4 py-1 rounded-md text-sm font-medium transition-all",
              activeTab === 'insights'
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-600 hover:text-gray-800"
            )}
          >
            Market Insights
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showAnimation && (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <LineChart className="h-4 w-4" />
              </div>
              <div className="text-blue-800 font-medium">AI Analysis in Progress</div>
            </div>
            <div className="flex items-center">
              <div className="text-blue-600 font-medium mr-2">Analyzing your portfolio</div>
              <div className="flex space-x-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.2, delay: 0 }}
                  className="w-1 h-1 bg-blue-600 rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.2, delay: 0.3 }}
                  className="w-1 h-1 bg-blue-600 rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.2, delay: 0.6 }}
                  className="w-1 h-1 bg-blue-600 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                <h3 className="text-indigo-800 font-medium mb-1">Personalized Recommendation</h3>
                <p className="text-gray-700 mb-3">
                  {userProfile?.name ? `Based on your ${userProfile.riskTolerance} risk profile and investment goals, we recommend diversifying across these top opportunities:` : 
                  'Based on your investment profile, we recommend exploring these opportunities:'}
                </p>
                <div className="space-y-3">
                  {topOpportunities.map((stock) => (
                    <motion.div
                      key={stock.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`text-sm font-medium ${stock.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                          <button className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
                <h3 className="text-emerald-800 font-medium mb-1">AI Investment Strategy</h3>
                <p className="text-gray-700 mb-2">Your optimal asset allocation based on current market conditions:</p>
                <div className="flex space-x-1">
                  <div className="bg-blue-500 h-3 rounded-l-full" style={{ width: '45%' }}></div>
                  <div className="bg-purple-500 h-3" style={{ width: '30%' }}></div>
                  <div className="bg-yellow-500 h-3 rounded-r-full" style={{ width: '25%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                    <span>Stocks (45%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
                    <span>Crypto (30%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1" />
                    <span>Bonds (25%)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-8 w-8 text-blue-500" />
                  </motion.div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">Latest Market Updates</h3>
                    <button 
                      onClick={handleRefresh}
                      className="text-blue-600 text-sm flex items-center space-x-1 hover:text-blue-800 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Sample market insights */}
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-400 border-t border-r border-b border-gray-100"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 mb-1">Tech Sector Showing Strong Recovery</h4>
                        <span className="text-xs text-gray-500">1h ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Technology stocks are rebounding after last week's selloff, presenting potential buying opportunities.
                      </p>
                      <div className="flex items-center text-green-600 text-xs font-medium">
                        <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        <span>Positive impact on tech-heavy portfolios</span>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-400 border-t border-r border-b border-gray-100"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 mb-1">Fed Signals Potential Rate Hike</h4>
                        <span className="text-xs text-gray-500">3h ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Federal Reserve minutes indicate considerations for rates increase in response to inflation concerns.
                      </p>
                      <div className="flex items-center text-red-600 text-xs font-medium">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        <span>Negative impact on growth stocks and bonds</span>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-400 border-t border-r border-b border-gray-100"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 mb-1">Cryptocurrency Market Volatility</h4>
                        <span className="text-xs text-gray-500">5h ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Major cryptocurrencies experiencing fluctuations amid regulatory discussions in key markets.
                      </p>
                      <div className="flex items-center text-amber-600 text-xs font-medium">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        <span>Mixed impact depending on specific assets</span>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
