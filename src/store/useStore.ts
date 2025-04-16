import { create } from 'zustand';
import { faker } from '@faker-js/faker';
import { format, subDays } from 'date-fns';
import type { Stock, PortfolioSummary, RevenueData, MarketInsight, UserProfile } from '../types';

interface StoreState {
  stocks: Stock[];
  filteredStocks: Stock[];
  portfolioSummary: PortfolioSummary;
  revenueData: RevenueData[];
  searchTerm: string;
  selectedType: string;
  hasCompletedOnboarding: boolean;
  userProfile: UserProfile | null;
  marketInsights: MarketInsight[];
  aiRecommendations: Stock[];
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: string) => void;
  generateMockData: (profile: any) => void;
  completeOnboarding: () => void;
  setUserProfile: (profile: UserProfile) => void;
  refreshMarketInsights: () => void;
}

const generateStocks = (preferences?: Record<string, string[]>): Stock[] => {
  const investmentTypes = preferences?.slide2 || ['stocks', 'crypto', 'bonds'];
  const stockCount = Math.floor(12 / investmentTypes.length);
  
  return investmentTypes.flatMap(type => 
    Array.from({ length: stockCount }, () => ({
      id: faker.string.uuid(),
      symbol: faker.finance.currencyCode(),
      name: faker.company.name(),
      price: parseFloat(faker.finance.amount(10, 1000, 2)),
      change: parseFloat(faker.finance.amount(-50, 50, 2)),
      changePercent: parseFloat(faker.finance.amount(-10, 10, 2)),
      quantity: parseInt(faker.finance.amount(1, 1000, 0)),
      value: parseFloat(faker.finance.amount(1000, 100000, 2)),
      type: type as 'stock' | 'crypto' | 'bond',
    }))
  );
};

const generateRevenueData = (): RevenueData[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    date: format(subDays(new Date(), i * 30), 'MMM yyyy'),
    revenue: parseFloat(faker.finance.amount(50000, 150000, 2)),
  })).reverse();
};

const calculatePortfolioSummary = (stocks: Stock[]): PortfolioSummary => {
  const totalValue = stocks.reduce((sum, stock) => sum + stock.value, 0);
  const totalChange = stocks.reduce((sum, stock) => sum + stock.change, 0);
  const totalChangePercent = (totalChange / totalValue) * 100;

  const stocksValue = stocks.filter(s => s.type === 'stock').reduce((sum, s) => sum + s.value, 0);
  const cryptoValue = stocks.filter(s => s.type === 'crypto').reduce((sum, s) => sum + s.value, 0);
  const bondsValue = stocks.filter(s => s.type === 'bond').reduce((sum, s) => sum + s.value, 0);

  return {
    totalValue,
    totalChange,
    totalChangePercent,
    stocksAllocation: (stocksValue / totalValue) * 100,
    cryptoAllocation: (cryptoValue / totalValue) * 100,
    bondsAllocation: (bondsValue / totalValue) * 100,
  };
};

export const useStore = create<StoreState>((set, get) => ({
  stocks: [],
  filteredStocks: [],
  portfolioSummary: {
    totalValue: 0,
    totalChange: 0,
    totalChangePercent: 0,
    stocksAllocation: 0,
    cryptoAllocation: 0,
    bondsAllocation: 0,
  },
  revenueData: [],
  searchTerm: '',
  selectedType: 'all',
  hasCompletedOnboarding: false,
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    const { stocks, selectedType } = get();
    const filtered = stocks.filter(stock => 
      (stock.name.toLowerCase().includes(term.toLowerCase()) ||
       stock.symbol.toLowerCase().includes(term.toLowerCase())) &&
      (selectedType === 'all' || stock.type === selectedType)
    );
    set({ filteredStocks: filtered });
  },
  setSelectedType: (type) => {
    set({ selectedType: type });
    const { stocks, searchTerm } = get();
    const filtered = stocks.filter(stock => 
      (stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (type === 'all' || stock.type === type)
    );
    set({ filteredStocks: filtered });
  },
  generateMockData: (preferences) => {
    const stocks = generateStocks(preferences);
    set({
      stocks,
      filteredStocks: stocks,
      portfolioSummary: calculatePortfolioSummary(stocks),
      revenueData: generateRevenueData(),
    });  },
  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true });
  },
  userProfile: null,
  marketInsights: [],
  aiRecommendations: [],
  setUserProfile: (profile) => {
    set({ userProfile: profile });
  },
  refreshMarketInsights: () => {
    // Generate random market insights based on user preferences
    const { userProfile } = get();
    const assetClasses = userProfile?.preferredAssets || ['stocks', 'crypto', 'bonds'];
    
    const newInsights = Array.from({ length: 5 }, () => {
      const impact = ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral';
      const assetClass = assetClasses[Math.floor(Math.random() * assetClasses.length)];
      
      return {
        id: faker.string.uuid(),
        title: faker.finance.transactionDescription(),
        description: faker.lorem.sentence(),
        impact,
        assetClass,
        date: faker.date.recent().toISOString(),
        source: faker.company.name() + ' Research'
      };
    });
    
    set({ marketInsights: newInsights });
    
    // Generate AI recommendations based on user profile and market insights
    const { stocks } = get();
    
    // Select a few stocks for recommendations
    const recommendedStocks = [...stocks]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    set({ aiRecommendations: recommendedStocks });
  }
}));