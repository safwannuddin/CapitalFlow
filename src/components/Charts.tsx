import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useStore } from '../store/useStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Charts: React.FC = () => {
  const { stocks, revenueData, portfolioSummary } = useStore();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: 'bold',
        },
        displayColors: false,
      },
    },
  };

  const stockPerformanceData = useMemo(() => ({
    labels: stocks.map(stock => stock.symbol),
    datasets: [
      {
        label: 'Stock Performance',
        data: stocks.map(stock => stock.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      },
    ],
  }), [stocks]);

  const revenueChartData = useMemo(() => ({
    labels: revenueData.map(data => data.date),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(data => data.revenue),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }), [revenueData]);

  const assetAllocationData = useMemo(() => ({
    labels: ['Stocks', 'Crypto', 'Bonds'],
    datasets: [
      {
        data: [
          portfolioSummary.stocksAllocation,
          portfolioSummary.cryptoAllocation,
          portfolioSummary.bondsAllocation,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  }), [portfolioSummary]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
        <h2 className="text-lg font-semibold mb-6">Stock Performance</h2>
        <div className="h-[300px]">
          <Line 
            data={stockPerformanceData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
        <h2 className="text-lg font-semibold mb-6">Revenue Insights</h2>
        <div className="h-[300px]">
          <Bar 
            data={revenueChartData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg lg:col-span-2">
        <h2 className="text-lg font-semibold mb-6">Asset Allocation</h2>
        <div className="h-[400px] flex items-center justify-center">
          <div className="w-[400px]">
            <Pie 
              data={assetAllocationData} 
              options={{
                ...chartOptions,
                cutout: '60%',
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};