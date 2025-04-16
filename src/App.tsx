import React from 'react';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { Charts } from './components/Charts';
import { StockList } from './components/StockList';
import { Welcome } from './components/Welcome';
import { useStore } from './store/useStore';

function App() {
  const { hasCompletedOnboarding, generateMockData } = useStore();

  if (!hasCompletedOnboarding) {
    return <Welcome />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PortfolioOverview />
        <Charts />
        <StockList />
      </main>
    </div>
  );
}

export default App;