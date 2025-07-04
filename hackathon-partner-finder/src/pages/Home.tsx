import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Rocket, Search, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Find Your Perfect
            <span className="text-primary-600 dark:text-primary-400"> Hackathon Team</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            Connect with talented developers, designers, and innovators for your next hackathon. 
            Build amazing projects together and win big!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Hackathon Partner Finder?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Find Teammates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with skilled developers, designers, and project managers for your team.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Filtering
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Filter teams by tech stack, location, and hackathon dates to find the perfect match.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Quick Applications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Apply to join teams with a simple message and optional portfolio links.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built with Firebase for secure authentication and real-time updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Find Your Dream Team?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of developers who have found their perfect hackathon partners.
          </p>
          {!currentUser && (
            <Link to="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Journey
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;