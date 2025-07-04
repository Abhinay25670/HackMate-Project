import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Code, Heart, HeartOff, Send } from 'lucide-react';
import { Team } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../hooks/useBookmarks';
import ApplyModal from './ApplyModal';

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const { currentUser } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const spotsLeft = team.teamSize - team.currentMembers;
  const isTeamFull = spotsLeft <= 0;
  const isOwnTeam = currentUser?.uid === team.creatorId;
  const bookmarked = currentUser ? isBookmarked(team.id) : false;

  const handleBookmarkToggle = async () => {
    if (!currentUser) return;
    
    setIsBookmarking(true);
    try {
      await toggleBookmark(team.id);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {team.hackathonName}
          </h3>
          {currentUser && !isOwnTeam && (
            <button
              onClick={handleBookmarkToggle}
              disabled={isBookmarking}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? (
                <Heart className="h-5 w-5 text-red-500 fill-current" />
              ) : (
                <HeartOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            {format(team.hackathonDate, 'PPP')}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            {team.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 mr-2" />
            {team.currentMembers}/{team.teamSize} members
            {!isTeamFull && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                ({spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left)
              </span>
            )}
            {isTeamFull && (
              <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                (Team Full)
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Code className="h-4 w-4 mr-2" />
            Tech Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {team.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {team.description}
        </p>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Posted by {team.creatorName}
            </div>
            
            {currentUser && !isOwnTeam && !isTeamFull && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-primary text-sm flex items-center"
              >
                <Send className="h-4 w-4 mr-1" />
                Apply to Join
              </button>
            )}
            
            {isOwnTeam && (
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                Your Team
              </span>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          team={team}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
};

export default TeamCard;