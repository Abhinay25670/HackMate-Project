import React from 'react';
import { Filter, MapPin, Calendar } from 'lucide-react';
import TechStackInput from './TechStackInput';

interface Filters {
  searchQuery: string;
  techStack: string[];
  location: 'all' | 'online' | 'offline';
  dateRange: 'all' | 'week' | 'month' | 'quarter';
}

interface TeamFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const TeamFilters: React.FC<TeamFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleTechStackChange = (techStack: string[]) => {
    onFiltersChange({ ...filters, techStack });
  };

  const handleLocationChange = (location: 'all' | 'online' | 'offline') => {
    onFiltersChange({ ...filters, location });
  };

  const handleDateRangeChange = (dateRange: 'all' | 'week' | 'month' | 'quarter') => {
    onFiltersChange({ ...filters, dateRange });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
      </div>

      {/* Tech Stack Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tech Stack
        </label>
        <TechStackInput
          value={filters.techStack}
          onChange={handleTechStackChange}
        />
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Location
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleLocationChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.location === 'all'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleLocationChange('online')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.location === 'online'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => handleLocationChange('offline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.location === 'offline'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            In-Person
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Calendar className="inline h-4 w-4 mr-1" />
          Hackathon Date
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDateRangeChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.dateRange === 'all'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Dates
          </button>
          <button
            onClick={() => handleDateRangeChange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.dateRange === 'week'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Next 7 Days
          </button>
          <button
            onClick={() => handleDateRangeChange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.dateRange === 'month'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Next Month
          </button>
          <button
            onClick={() => handleDateRangeChange('quarter')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.dateRange === 'quarter'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Next 3 Months
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.techStack.length > 0 || filters.location !== 'all' || filters.dateRange !== 'all') && (
        <button
          onClick={() => onFiltersChange({
            searchQuery: filters.searchQuery,
            techStack: [],
            location: 'all',
            dateRange: 'all'
          })}
          className="w-full btn-secondary text-sm"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default TeamFilters;