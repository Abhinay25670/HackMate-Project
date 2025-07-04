import React from 'react';
import { format } from 'date-fns';
import { Team } from '../../types';
import { Calendar, MapPin, Users, Trash2, Power, Bell } from 'lucide-react';

interface TeamManagementCardProps {
  team: Team;
  applicationCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const TeamManagementCard: React.FC<TeamManagementCardProps> = ({
  team,
  applicationCount,
  isSelected,
  onSelect,
  onToggleStatus,
  onDelete
}) => {
  const spotsLeft = team.teamSize - team.currentMembers;
  const isTeamFull = spotsLeft <= 0;

  return (
    <div
      className={`card cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950'
          : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {team.hackathonName}
        </h3>
        <div className="flex items-center space-x-2">
          {applicationCount > 0 && (
            <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Bell className="h-3 w-3 mr-1" />
              {applicationCount}
            </span>
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              team.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {team.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-2" />
          {format(team.hackathonDate, 'MMM d, yyyy')}
        </div>
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-2" />
          {team.location}
        </div>
        <div className="flex items-center">
          <Users className="h-3 w-3 mr-2" />
          {team.currentMembers}/{team.teamSize} members
          {!isTeamFull && (
            <span className="ml-1 text-green-600 dark:text-green-400">
              ({spotsLeft} spots left)
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onToggleStatus}
          className={`flex-1 px-3 py-1 text-xs rounded font-medium transition-colors ${
            team.isActive
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800'
              : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
          }`}
        >
          <Power className="h-3 w-3 inline mr-1" />
          {team.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-xs rounded font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors"
        >
          <Trash2 className="h-3 w-3 inline" />
        </button>
      </div>
    </div>
  );
};

export default TeamManagementCard;