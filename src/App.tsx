import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { Charts } from './components/Charts';
import { StockList } from './components/StockList';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AIInsights } from './components/AIInsights';
import { useStore } from './store/useStore';

function App() {
  const { hasCompletedOnboarding } = useStore();
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PortfolioOverview />
        <Charts />
        <AIInsights />
        <StockList />
      </main>
    </div>
  );
}

export default App;