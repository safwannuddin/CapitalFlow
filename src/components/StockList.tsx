import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Stock } from '../types';

type SortField = 'symbol' | 'price' | 'change' | 'quantity' | 'value';
type SortDirection = 'asc' | 'desc';

export const StockList: React.FC = () => {
  const { filteredStocks } = useStore();
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'symbol':
        return direction * a.symbol.localeCompare(b.symbol);
      case 'price':
        return direction * (a.price - b.price);
      case 'change':
        return direction * (a.changePercent - b.changePercent);
      case 'quantity':
        return direction * (a.quantity - b.quantity);
      case 'value':
        return direction * (a.value - b.value);
      default:
        return 0;
    }
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const renderHeader = (field: SortField, label: string) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(field)}
      </div>
    </th>
  );

  const renderStockRow = (stock: Stock) => (
    <tr key={stock.id} className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
            <div className="text-sm text-gray-500">{stock.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{formatCurrency(stock.price)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {stock.change >= 0 ? (
            <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
        {stock.quantity.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formatCurrency(stock.value)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${stock.type === 'stock' ? 'bg-blue-100 text-blue-800' : 
            stock.type === 'crypto' ? 'bg-purple-100 text-purple-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {stock.type.charAt(0).toUpperCase() + stock.type.slice(1)}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 mt-8 overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Portfolio Assets</h2>
        <span className="text-sm text-gray-500">
          {sortedStocks.length} assets
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderHeader('symbol', 'Asset')}
              {renderHeader('price', 'Price')}
              {renderHeader('change', 'Change')}
              {renderHeader('quantity', 'Quantity')}
              {renderHeader('value', 'Value')}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStocks.map(renderStockRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
};