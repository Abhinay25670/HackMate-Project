import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import CreateTeam from '../components/dashboard/CreateTeam';
import JoinTeam from '../components/dashboard/JoinTeam';

type TabType = 'create' | 'join';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('join');

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Dashboard
      </h1>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('join')}
              className={`py-4 px-6 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'join'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Join a Team</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-6 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Create a Team</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'create' ? <CreateTeam /> : <JoinTeam />}
      </div>
    </div>
  );
};

export default Dashboard;