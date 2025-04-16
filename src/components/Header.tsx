import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const { setSearchTerm, setSelectedType, selectedType } = useStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search stocks..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative inline-block text-left">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Assets</option>
                  <option value="stock">Stocks</option>
                  <option value="crypto">Crypto</option>
                  <option value="bond">Bonds</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};