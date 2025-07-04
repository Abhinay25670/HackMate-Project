import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Team, Application } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TeamManagementCard from '../components/teams/TeamManagementCard';
import ApplicationsList from '../components/teams/ApplicationsList';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTeams: React.FC = () => {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [applications, setApplications] = useState<{ [teamId: string]: Application[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    // Query for teams created by the current user
    const teamsQuery = query(
      collection(db, 'teams'),
      where('creatorId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTeams = onSnapshot(teamsQuery, (snapshot) => {
      const teamsData: Team[] = [];
      const teamIds: string[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        teamsData.push({
          id: doc.id,
          ...data,
          hackathonDate: data.hackathonDate.toDate()
        } as Team);
        teamIds.push(doc.id);
      });
      
      setTeams(teamsData);
      
      // If there are teams, fetch applications for them
      if (teamIds.length > 0) {
        fetchApplicationsForTeams(teamIds);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribeTeams();
  }, [currentUser]);

  const fetchApplicationsForTeams = (teamIds: string[]) => {
    // Query for applications for all teams
    const applicationsQuery = query(
      collection(db, 'applications'),
      where('teamId', 'in', teamIds),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeApplications = onSnapshot(applicationsQuery, (snapshot) => {
      const applicationsData: { [teamId: string]: Application[] } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const application = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          respondedAt: data.respondedAt?.toDate()
        } as Application;
        
        if (!applicationsData[application.teamId]) {
          applicationsData[application.teamId] = [];
        }
        applicationsData[application.teamId].push(application);
      });
      
      setApplications(applicationsData);
    });

    return () => unsubscribeApplications();
  };

  const handleToggleTeamStatus = async (teamId: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'teams', teamId), {
        isActive: !isActive,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating team status:', error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'teams', teamId));
      setSelectedTeamId(null);
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleApplicationResponse = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status,
        respondedAt: new Date()
      });
      
      // If accepted, update team member count
      if (status === 'accepted') {
        const application = Object.values(applications).flat().find(app => app.id === applicationId);
        if (application) {
          const team = teams.find(t => t.id === application.teamId);
          if (team) {
            await updateDoc(doc(db, 'teams', application.teamId), {
              currentMembers: team.currentMembers + 1,
              updatedAt: new Date()
            });
          }
        }
      }
    } catch (error) {
      console.error('Error responding to application:', error);
    }
  };

  if (isLoading) {
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
          Please log in to view your teams.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Teams
        </h1>
        <Link to="/dashboard" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't created any teams yet.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Create Your First Team
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Teams ({teams.length})
            </h2>
            {teams.map((team) => (
              <TeamManagementCard
                key={team.id}
                team={team}
                applicationCount={applications[team.id]?.filter(app => app.status === 'pending').length || 0}
                isSelected={selectedTeamId === team.id}
                onSelect={() => setSelectedTeamId(team.id)}
                onToggleStatus={() => handleToggleTeamStatus(team.id, team.isActive)}
                onDelete={() => handleDeleteTeam(team.id)}
              />
            ))}
          </div>

          {/* Applications View */}
          <div className="lg:col-span-2">
            {selectedTeamId ? (
              <ApplicationsList
                team={teams.find(t => t.id === selectedTeamId)!}
                applications={applications[selectedTeamId] || []}
                onRespond={handleApplicationResponse}
              />
            ) : (
              <div className="card h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a team to view applications
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeams;