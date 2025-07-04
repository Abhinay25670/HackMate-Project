import React from 'react';
import { format } from 'date-fns';
import { Team, Application } from '../../types';
import { CheckCircle, XCircle, Clock, Github, Linkedin, Mail } from 'lucide-react';

interface ApplicationsListProps {
  team: Team;
  applications: Application[];
  onRespond: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ team, applications, onRespond }) => {
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const respondedApplications = applications.filter(app => app.status !== 'pending');

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadgeClass = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Applications for {team.hackathonName}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {applications.length} total application{applications.length !== 1 ? 's' : ''} • 
          {pendingApplications.length} pending
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No applications received yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pending Applications ({pendingApplications.length})
              </h3>
              <div className="space-y-4">
                {pendingApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {application.applicantName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {application.applicantEmail}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusBadgeClass(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">Pending</span>
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {application.message}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      {application.githubUrl && (
                        <a
                          href={application.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      )}
                      {application.linkedinUrl && (
                        <a
                          href={application.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                        >
                          <Linkedin className="h-4 w-4 mr-1" />
                          LinkedIn
                        </a>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                        Applied {format(application.createdAt, 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onRespond(application.id, 'accepted')}
                        className="flex-1 btn-primary text-sm"
                        disabled={team.currentMembers >= team.teamSize}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onRespond(application.id, 'rejected')}
                        className="flex-1 btn-secondary text-sm"
                      >
                        Reject
                      </button>
                    </div>

                    {team.currentMembers >= team.teamSize && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Team is full. Cannot accept more members.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responded Applications */}
          {respondedApplications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Responded Applications ({respondedApplications.length})
              </h3>
              <div className="space-y-4">
                {respondedApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-75"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {application.applicantName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {application.applicantEmail}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusBadgeClass(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {application.message}
                    </p>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Responded on {format(application.respondedAt!, 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;