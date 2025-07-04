import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TechStackInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const POPULAR_TECH_STACKS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express.js',
  'Python', 'Django', 'Flask', 'FastAPI', 'JavaScript', 'TypeScript',
  'Java', 'Spring Boot', 'C#', '.NET', 'Go', 'Rust',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
  'TensorFlow', 'PyTorch', 'OpenAI', 'Machine Learning',
  'React Native', 'Flutter', 'Swift', 'Kotlin'
];

const TechStackInput: React.FC<TechStackInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = POPULAR_TECH_STACKS.filter(
    tech => 
      tech.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(tech)
  );

  const addTech = (tech: string) => {
    if (!value.includes(tech)) {
      onChange([...value, tech]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTech = (tech: string) => {
    onChange(value.filter(t => t !== tech));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTech(inputValue.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="input-field flex-1"
            placeholder="Type to add tech stack..."
          />
          <button
            type="button"
            onClick={() => inputValue.trim() && addTech(inputValue.trim())}
            className="btn-secondary"
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => addTech(tech)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
              >
                {tech}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
          >
            {tech}
            <button
              type="button"
              onClick={() => removeTech(tech)}
              className="ml-2 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select at least one technology
        </p>
      )}
    </div>
  );
};

export default TechStackInput;