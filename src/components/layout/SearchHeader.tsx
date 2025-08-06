import React from 'react';
import { motion } from 'framer-motion';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange
}) => {
  const popularSearches = [
    { label: 'Internet Computer revenue', icon: '🌐' },
    { label: 'Solana token trading volume', icon: '☀️' },
    { label: 'Aave active loans', icon: '👻' },
    { label: 'Aave revenue', icon: '💰' }
  ];

  return (
    <motion.div 
      className="p-6 border-b border-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input w-full max-w-2xl pl-10 pr-4"
          placeholder="Search projects, metrics, datasets, etc."
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono text-gray-400 bg-gray-800 border border-gray-700 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 font-medium">Popular searches</span>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search, index) => (
            <motion.button
              key={index}
              className="nav-pill-inactive text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSearchChange(search.label)}
            >
              <span className="mr-1">{search.icon}</span>
              {search.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};