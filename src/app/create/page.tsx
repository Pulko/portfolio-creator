'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

// URL validation function
const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Empty URLs are allowed
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Sanitize input to prevent XSS attacks
const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export default function CreatePortfolio() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    projects: [{ name: '', description: '', url: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // In development mode, we'll use a mock session
  const isDevMode = process.env.NODE_ENV === 'development';
  const mockSession = {
    user: {
      name: 'Dev User',
      email: 'dev@example.com',
    }
  };
  const currentSession = isDevMode ? mockSession : session;

  // Validate URLs
  const validateUrls = () => {
    const errors: Record<string, string> = {};
    
    if (formData.website && !isValidUrl(formData.website)) {
      errors.website = 'Please enter a valid website URL';
    }
    if (formData.twitter && !isValidUrl(formData.twitter)) {
      errors.twitter = 'Please enter a valid Twitter URL';
    }
    if (formData.github && !isValidUrl(formData.github)) {
      errors.github = 'Please enter a valid GitHub URL';
    }
    if (formData.linkedin && !isValidUrl(formData.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    formData.projects.forEach((project, index) => {
      if (project.url && !isValidUrl(project.url)) {
        errors[`project-${index}-url`] = 'Please enter a valid project URL';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (status === 'loading' && !isDevMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' && !isDevMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/5 p-8 rounded-3xl shadow-lg border border-white/10 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white">Sign In Required</h2>
          <p className="text-gray-300 mb-6">Please sign in with GitHub to create your portfolio.</p>
          <button
            onClick={() => signIn('github')}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
          >
            Sign in with GitHub
          </button>
          <p className="mt-4 text-gray-400">
            Don&apos;t have a GitHub account?{' '}
            <Link href="https://github.com/signup" className="text-purple-400 hover:text-purple-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!validateUrls()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all inputs before sending
      const sanitizedData = {
        ...formData,
        name: sanitizeInput(formData.name),
        bio: sanitizeInput(formData.bio),
        location: sanitizeInput(formData.location),
        website: sanitizeInput(formData.website),
        twitter: sanitizeInput(formData.twitter),
        github: sanitizeInput(formData.github),
        linkedin: sanitizeInput(formData.linkedin),
        projects: formData.projects.map(project => ({
          name: sanitizeInput(project.name),
          description: sanitizeInput(project.description),
          url: sanitizeInput(project.url),
        })),
      };

      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portfolio');
      }

      setDeployUrl(data.deployUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', url: '' }],
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Your Portfolio</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Signed in as {currentSession?.user?.name}</span>
            {!isDevMode && (
              <button
                onClick={() => signIn('github')}
                className="text-purple-400 hover:text-purple-300"
              >
                Switch Account
              </button>
            )}
          </div>
        </div>
        
        {deployUrl ? (
          <div className="backdrop-blur-md bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio Created!</h2>
            <p className="mb-4 text-gray-300">Your portfolio has been created successfully. Click the button below to deploy it on Vercel:</p>
            <a
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Deploy on Vercel
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="backdrop-blur-md bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            <div className="backdrop-blur-md bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={`mt-1 block w-full rounded-xl bg-white/5 border ${
                      validationErrors.website ? 'border-red-500/50' : 'border-white/10'
                    } text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                  />
                  {validationErrors.website && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.website}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Twitter</label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className={`mt-1 block w-full rounded-xl bg-white/5 border ${
                      validationErrors.twitter ? 'border-red-500/50' : 'border-white/10'
                    } text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                  />
                  {validationErrors.twitter && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.twitter}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">GitHub</label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className={`mt-1 block w-full rounded-xl bg-white/5 border ${
                      validationErrors.github ? 'border-red-500/50' : 'border-white/10'
                    } text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                  />
                  {validationErrors.github && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.github}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className={`mt-1 block w-full rounded-xl bg-white/5 border ${
                      validationErrors.linkedin ? 'border-red-500/50' : 'border-white/10'
                    } text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                  />
                  {validationErrors.linkedin && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.linkedin}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Projects</h2>
                <button
                  type="button"
                  onClick={addProject}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
                >
                  Add Project
                </button>
              </div>
              <div className="space-y-6">
                {formData.projects.map((project, index) => (
                  <div key={index} className="space-y-4 relative">
                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                      >
                        ×
                      </button>
                    )}
                    <div className={`backdrop-blur-md bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10 ${
                      formData.projects.length > 1 && index < formData.projects.length - 1 ? 'mb-8 border-b border-white/10' : ''
                    }`}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300">Project Name</label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300">Description</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            rows={2}
                            className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300">URL</label>
                          <input
                            type="url"
                            value={project.url}
                            onChange={(e) => updateProject(index, 'url', e.target.value)}
                            className={`mt-1 block w-full rounded-xl bg-white/5 border ${
                              validationErrors[`project-${index}-url`] ? 'border-red-500/50' : 'border-white/10'
                            } text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                            required
                          />
                          {validationErrors[`project-${index}-url`] && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors[`project-${index}-url`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? 'Creating...' : 'Create Portfolio'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 