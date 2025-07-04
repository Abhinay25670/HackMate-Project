import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Team } from '../../types';
import TeamCard from '../common/TeamCard';
import TeamFilters from '../common/TeamFilters';
import LoadingSpinner from '../common/LoadingSpinner';
import { Search } from 'lucide-react';

interface Filters {
  searchQuery: string;
  techStack: string[];
  location: 'all' | 'online' | 'offline';
  dateRange: 'all' | 'week' | 'month' | 'quarter';
}

const JoinTeam: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    techStack: [],
    location: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    // Get current date
    const now = new Date();
    
    // Query for active teams with future hackathon dates
    const q = query(
      collection(db, 'teams'),
      where('isActive', '==', true),
      orderBy('hackathonDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData: Team[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const hackathonDate = data.hackathonDate.toDate();
        
        // Only include teams with future hackathon dates
        if (hackathonDate > now) {
          teamsData.push({
            id: doc.id,
            ...data,
            hackathonDate: hackathonDate
          } as Team);
        }
      });
      
      setTeams(teamsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...teams];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(team => 
        team.hackathonName.toLowerCase().includes(query) ||
        team.description.toLowerCase().includes(query) ||
        team.location.toLowerCase().includes(query)
      );
    }

    // Tech stack filter
    if (filters.techStack.length > 0) {
      filtered = filtered.filter(team =>
        filters.techStack.some(tech => team.techStack.includes(tech))
      );
    }

    // Location filter
    if (filters.location !== 'all') {
      if (filters.location === 'online') {
        filtered = filtered.filter(team => 
          team.location.toLowerCase() === 'online'
        );
      } else {
        filtered = filtered.filter(team => 
          team.location.toLowerCase() !== 'online'
        );
      }
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const endDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          endDate.setDate(now.getDate() + 7);
          break;
        case 'month':
          endDate.setMonth(now.getMonth() + 1);
          break;
        case 'quarter':
          endDate.setMonth(now.getMonth() + 3);
          break;
      }
      
      filtered = filtered.filter(team => 
        team.hackathonDate <= endDate
      );
    }

    setFilteredTeams(filtered);
  }, [teams, filters]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          placeholder="Search hackathons, teams, or locations..."
          className="input-field pl-10"
        />
      </div>

      {/* Filters */}
      <TeamFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Found {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} looking for members
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No teams found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinTeam;