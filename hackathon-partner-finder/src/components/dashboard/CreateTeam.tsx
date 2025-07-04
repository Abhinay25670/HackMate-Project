import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Team } from '../../types';
import { Calendar, MapPin, Users, Code, FileText } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import TechStackInput from '../common/TechStackInput';

interface CreateTeamFormData {
  hackathonName: string;
  hackathonDate: string;
  location: string;
  techStack: string[];
  teamSize: number;
  description: string;
}

const CreateTeam: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTeamFormData>();

  const onSubmit = async (data: CreateTeamFormData) => {
    if (!currentUser || !userData) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const teamData: Omit<Team, 'id'> = {
        creatorId: currentUser.uid,
        creatorName: userData.displayName,
        creatorEmail: userData.email,
        hackathonName: data.hackathonName,
        hackathonDate: new Date(data.hackathonDate),
        location: data.location,
        techStack: selectedTechStack,
        teamSize: Number(data.teamSize),
        currentMembers: 1,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      await addDoc(collection(db, 'teams'), teamData);
      reset();
      setSelectedTechStack([]);
      navigate('/my-teams');
    } catch (error: any) {
      setError(error.message || 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create a New Team
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Calendar className="inline h-4 w-4 mr-1" />
            Hackathon Name
          </label>
          <input
            {...register('hackathonName', { required: 'Hackathon name is required' })}
            type="text"
            className="input-field"
            placeholder="e.g., HackMIT 2024"
          />
          {errors.hackathonName && (
            <p className="mt-1 text-sm text-red-600">{errors.hackathonName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Calendar className="inline h-4 w-4 mr-1" />
            Hackathon Date
          </label>
          <input
            {...register('hackathonDate', { required: 'Date is required' })}
            type="date"
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.hackathonDate && (
            <p className="mt-1 text-sm text-red-600">{errors.hackathonDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location
          </label>
          <input
            {...register('location', { required: 'Location is required' })}
            type="text"
            className="input-field"
            placeholder="e.g., Online or San Francisco, CA"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Code className="inline h-4 w-4 mr-1" />
            Tech Stack Required
          </label>
          <TechStackInput
            value={selectedTechStack}
            onChange={setSelectedTechStack}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Users className="inline h-4 w-4 mr-1" />
            Team Size
          </label>
          <input
            {...register('teamSize', { 
              required: 'Team size is required',
              min: { value: 2, message: 'Team size must be at least 2' },
              max: { value: 10, message: 'Team size cannot exceed 10' }
            })}
            type="number"
            className="input-field"
            placeholder="e.g., 4"
          />
          {errors.teamSize && (
            <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FileText className="inline h-4 w-4 mr-1" />
            Team/Project Description
          </label>
          <textarea
            {...register('description', { 
              required: 'Description is required',
              minLength: { value: 50, message: 'Description must be at least 50 characters' }
            })}
            rows={4}
            className="input-field"
            placeholder="Describe your team, project idea, and what kind of teammates you're looking for..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || selectedTechStack.length === 0}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Create Team'}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;