import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { Team } from '../types';
import TeamCard from '../components/common/TeamCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Heart } from 'lucide-react';

const Bookmarks: React.FC = () => {
  const { currentUser } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedTeams = async () => {
      if (!currentUser || bookmarksLoading || bookmarks.length === 0) {
        setTeams([]);
        setIsLoading(false);
        return;
      }

      try {
        const teamsData: Team[] = [];
        
        // Fetch team data for each bookmark
        for (const bookmark of bookmarks) {
          const teamDoc = await getDoc(doc(db, 'teams', bookmark.teamId));
          
          if (teamDoc.exists()) {
            const data = teamDoc.data();
            teamsData.push({
              id: teamDoc.id,
              ...data,
              hackathonDate: data.hackathonDate.toDate()
            } as Team);
          }
        }
        
        // Sort by hackathon date
        teamsData.sort((a, b) => a.hackathonDate.getTime() - b.hackathonDate.getTime());
        
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching bookmarked teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedTeams();
  }, [currentUser, bookmarks, bookmarksLoading]);

  if (isLoading || bookmarksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Please log in to view your bookmarks.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Heart className="h-8 w-8 text-red-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bookmarked Teams
        </h1>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't bookmarked any teams yet.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click the heart icon on teams you're interested in to save them here.
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You have {teams.length} bookmarked team{teams.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmarks;