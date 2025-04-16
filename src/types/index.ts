export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  quantity: number;
  value: number;
  type: 'stock' | 'crypto' | 'bond';
}

export interface PortfolioSummary {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  stocksAllocation: number;
  cryptoAllocation: number;
  bondsAllocation: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}