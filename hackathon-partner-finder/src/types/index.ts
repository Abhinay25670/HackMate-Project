export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  bio?: string;
  skills?: string[];
  createdAt: Date;
}

export interface Team {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  hackathonName: string;
  hackathonDate: Date;
  location: string; // "Online" or city name
  techStack: string[];
  teamSize: number;
  currentMembers: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Application {
  id: string;
  teamId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  message: string;
  githubUrl?: string;
  linkedinUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  respondedAt?: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  teamId: string;
  createdAt: Date;
}

export type Theme = 'light' | 'dark';