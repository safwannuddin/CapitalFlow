import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, PieChart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

export const PortfolioOverview: React.FC = () => {
  const { portfolioSummary } = useStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={cn(
              "rounded-xl border p-6 transition-all duration-200 hover:shadow-lg",
              card.color,
              card.borderColor
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <card.icon className={cn("h-5 w-5", card.iconColor)} />
            </div>
            {card.customContent ? (
              card.customContent
            ) : (
              <p className={cn(
                "mt-2 text-2xl font-bold",
                card.iconColor
              )}>
                {card.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};