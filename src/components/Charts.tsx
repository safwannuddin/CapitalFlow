import React, { useMemo, useState } from 'react';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { ChevronDown, TrendingUp, BarChart3, PieChart, CalendarDays } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

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

const timeRanges = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: 'all' },
];

const chartTypes = [
  { label: 'Line', value: 'line', icon: TrendingUp },
  { label: 'Bar', value: 'bar', icon: BarChart3 },
  { label: 'Doughnut', value: 'doughnut', icon: PieChart },
];

export const Charts: React.FC = () => {
  const { revenueData, portfolioSummary } = useStore();
  const [activeRange, setActiveRange] = useState('3m');
  const [chartType, setChartType] = useState('line');
  const [showDropdown, setShowDropdown] = useState(false);

  // Enhanced chart options with animations
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Inter', sans-serif",
        },        titleFont: {
          family: "'Inter', sans-serif",
          weight: 'bold' as const,
        },
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const
    },
    scales: chartType === 'line' || chartType === 'bar' ? {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value >= 1000 ? 
              `$${(value / 1000).toFixed(1)}K` : 
              `$${value}`;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    } : undefined
  };

  // Filter data based on selected time range
  const filteredRevenueData = useMemo(() => {
    let dataPoints;
    switch (activeRange) {
      case '1d':
        dataPoints = 24;
        break;
      case '1w':
        dataPoints = 7;
        break;
      case '1m':
        dataPoints = 30;
        break;
      case '3m':
        dataPoints = 90;
        break;
      case '1y':
        dataPoints = 12;
        break;
      default:
        dataPoints = revenueData.length;
    }
    
    return revenueData.slice(-dataPoints);
  }, [revenueData, activeRange]);

  // Chart data based on selected chart type
  const chartData = useMemo(() => {
    if (chartType === 'doughnut') {
      return {
        labels: ['Stocks', 'Crypto', 'Bonds'],
        datasets: [
          {
            data: [
              portfolioSummary.stocksAllocation,
              portfolioSummary.cryptoAllocation,
              portfolioSummary.bondsAllocation,
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',  // Blue
              'rgba(139, 92, 246, 0.8)',  // Purple
              'rgba(234, 179, 8, 0.8)',   // Yellow
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(234, 179, 8, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 15
          },
        ],
      };
    }
    
    if (chartType === 'bar') {
      return {
        labels: filteredRevenueData.map(item => item.date),
        datasets: [
          {
            label: 'Portfolio Value',
            data: filteredRevenueData.map(item => item.revenue),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 4,
            hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',
          },
        ],
      };
    }

    // Default line chart
    return {
      labels: filteredRevenueData.map(item => item.date),
      datasets: [
        {
          label: 'Portfolio Value',
          data: filteredRevenueData.map(item => item.revenue),
          tension: 0.3,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
          fill: true,
        },
      ],
    };
  }, [filteredRevenueData, portfolioSummary, chartType]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Portfolio Performance</h2>
        
        <div className="flex items-center space-x-3">
          {/* Chart Type Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {chartTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={cn(
                  "flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  chartType === type.value
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                <type.icon className="h-3.5 w-3.5" />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => setActiveRange(range.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeRange === range.value
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm font-medium">Custom Range</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200"
              >
                <div className="text-sm font-medium mb-2 text-gray-700">Custom Date Range</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full p-1.5 text-sm border border-gray-300 rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input 
                      type="date" 
                      className="w-full p-1.5 text-sm border border-gray-300 rounded" 
                    />
                  </div>
                </div>
                <button className="w-full mt-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors">
                  Apply
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="h-80 relative"
      >
        {chartType === 'line' && (
          <Line data={chartData} options={chartOptions} />
        )}
        
        {chartType === 'bar' && (
          <Bar data={chartData} options={chartOptions} />
        )}
        
        {chartType === 'doughnut' && (
          <div className="flex items-center justify-center h-full">
            <div className="w-64">
              <Doughnut data={chartData} options={{...chartOptions, cutout: '70%'}} />
            </div>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {activeRange === '1d' ? 'Today' : 
           activeRange === '1w' ? 'Last 7 days' : 
           activeRange === '1m' ? 'Last 30 days' :
           activeRange === '3m' ? 'Last 90 days' :
           activeRange === '1y' ? 'Last 12 months' : 'All time'}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <span className={portfolioSummary.totalChange >= 0 ? 'text-green-600' : 'text-red-600'}>
            {portfolioSummary.totalChange >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(portfolioSummary.totalChangePercent).toFixed(2)}%
          </span>
          <span className="mx-1">•</span>
          <span>Performance</span>
        </div>
      </motion.div>
    </motion.div>
  );
};