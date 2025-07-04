import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Team, Application } from '../../types';
import { X, Send, Github, Linkedin } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ApplyModalProps {
  team: Team;
  onClose: () => void;
}

interface ApplyFormData {
  message: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ team, onClose }) => {
  const { currentUser, userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ApplyFormData>();

  const onSubmit = async (data: ApplyFormData) => {
    if (!currentUser || !userData) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const applicationData: Omit<Application, 'id'> = {
        teamId: team.id,
        applicantId: currentUser.uid,
        applicantName: userData.displayName,
        applicantEmail: userData.email,
        message: data.message,
        githubUrl: data.githubUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        status: 'pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'applications'), applicationData);
      setSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Apply to Join Team
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {team.hackathonName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Team by {team.creatorName}
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Application Sent!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The team creator will review your application and get back to you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Why do you want to join this team?
                </label>
                <textarea
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 50,
                      message: 'Message must be at least 50 characters'
                    }
                  })}
                  rows={4}
                  className="input-field"
                  placeholder="Tell the team about yourself, your skills, and why you'd be a great addition..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Github className="inline h-4 w-4 mr-1" />
                  GitHub Profile (optional)
                </label>
                <input
                  {...register('githubUrl', {
                    pattern: {
                      value: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
                      message: 'Please enter a valid GitHub profile URL'
                    }
                  })}
                  type="url"
                  className="input-field"
                  placeholder="https://github.com/yourusername"
                />
                {errors.githubUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Linkedin className="inline h-4 w-4 mr-1" />
                  LinkedIn Profile (optional)
                </label>
                <input
                  {...register('linkedinUrl', {
                    pattern: {
                      value: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
                      message: 'Please enter a valid LinkedIn profile URL'
                    }
                  })}
                  type="url"
                  className="input-field"
                  placeholder="https://linkedin.com/in/yourusername"
                />
                {errors.linkedinUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : 'Send Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;