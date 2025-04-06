'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

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
    description: '',
    projects: [{
      name: '',
      description: '',
      technologies: [''],
      githubUrl: '',
      liveUrl: ''
    }],
    experience: [{
      company: '',
      location: '',
      description: '',
      period: '',
    }],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    },
    theme: {
      background: 'dark',
      primary: 'purple',
      text: 'light'
    }
  });
  const [openSections, setOpenSections] = useState({
    basic: true,
    projects: false,
    experience: false,
    social: false,
    theme: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [githubRepoUrl, setGithubRepoUrl] = useState<string | null>(null);
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

  const themeOptions = {
    background: [
      { value: 'dark', label: 'Dark', color: 'bg-gray-900', textColor: 'text-white' },
      { value: 'light', label: 'Light', color: 'bg-white', textColor: 'text-gray-900' },
      { value: 'purple', label: 'Purple', color: 'bg-purple-900', textColor: 'text-white' },
      { value: 'blue', label: 'Blue', color: 'bg-blue-900', textColor: 'text-white' },
    ],
    primary: [
      { value: 'purple', label: 'Purple', color: 'text-purple-500', bgColor: 'bg-purple-500' },
      { value: 'blue', label: 'Blue', color: 'text-blue-500', bgColor: 'bg-blue-500' },
      { value: 'green', label: 'Green', color: 'text-green-500', bgColor: 'bg-green-500' },
      { value: 'red', label: 'Red', color: 'text-red-500', bgColor: 'bg-red-500' },
    ],
    text: [
      { value: 'light', label: 'Light', color: 'text-white', bgColor: 'bg-gray-800' },
      { value: 'dark', label: 'Dark', color: 'text-gray-900', bgColor: 'bg-gray-100' },
    ]
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Add form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Basic info validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    // Projects validation
    formData.projects.forEach((project, index) => {
      if (!project.name.trim()) {
        errors[`project-${index}-name`] = 'Project name is required';
      }
      if (!project.description.trim()) {
        errors[`project-${index}-description`] = 'Project description is required';
      }
      if (!project.technologies.length || project.technologies.some(tech => !tech.trim())) {
        errors[`project-${index}-technologies`] = 'At least one technology is required';
      }
    });

    // URL validation
    if (formData.socialLinks.github && !isValidUrl(formData.socialLinks.github)) {
      errors.github = 'Please enter a valid GitHub URL';
    }
    if (formData.socialLinks.linkedin && !isValidUrl(formData.socialLinks.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    if (formData.socialLinks.twitter && !isValidUrl(formData.socialLinks.twitter)) {
      errors.twitter = 'Please enter a valid Twitter URL';
    }

    formData.projects.forEach((project, index) => {
      if (project.githubUrl && !isValidUrl(project.githubUrl)) {
        errors[`project-${index}-githubUrl`] = 'Please enter a valid GitHub URL';
      }
      if (project.liveUrl && !isValidUrl(project.liveUrl)) {
        errors[`project-${index}-liveUrl`] = 'Please enter a valid Live URL';
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

    if (!validateForm()) {
      return;
    }

    // Truncate description to 350 characters for GitHub repository
    const truncatedDescription = formData.description.length > 350 
      ? formData.description.substring(0, 347) + '...'
      : formData.description;

    setIsSubmitting(true);

    try {
      // Sanitize all inputs before sending
      const sanitizedData = {
        ...formData,
        name: sanitizeInput(formData.name),
        description: sanitizeInput(truncatedDescription), // Use truncated description
        projects: formData.projects.map(project => ({
          name: sanitizeInput(project.name),
          description: sanitizeInput(project.description),
          technologies: project.technologies.map(tech => sanitizeInput(tech)),
          githubUrl: sanitizeInput(project.githubUrl),
          liveUrl: sanitizeInput(project.liveUrl),
        })),
        experience: formData.experience.map(exp => ({
          company: sanitizeInput(exp.company),
          location: sanitizeInput(exp.location),
          description: sanitizeInput(exp.description),
          period: sanitizeInput(exp.period),
        })),
        socialLinks: {
          github: sanitizeInput(formData.socialLinks.github),
          linkedin: sanitizeInput(formData.socialLinks.linkedin),
          twitter: sanitizeInput(formData.socialLinks.twitter),
        },
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

      setGithubRepoUrl(data.url);
      // Generate Vercel deploy URL using import flow
      const vercelDeployUrl = `https://vercel.com/new/import?repository-url=${encodeURIComponent(data.url)}`;
      setDeployUrl(vercelDeployUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [''],
        githubUrl: '',
        liveUrl: ''
      }],
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const addTechnology = (projectIndex: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? { ...project, technologies: [...project.technologies, ''] }
          : project
      ),
    }));
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              technologies: project.technologies.filter((_, j) => j !== techIndex),
            }
          : project
      ),
    }));
  };

  const updateTechnology = (projectIndex: number, techIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              technologies: project.technologies.map((tech, j) =>
                j === techIndex ? value : tech
              ),
            }
          : project
      ),
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        location: '',
        description: '',
        period: '',
      }],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleInputChange = (field: string, value: string | { [key: string]: string }) => {
    if (typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
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
            <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio Created Successfully! 🎉</h2>
            <p className="mb-4 text-gray-300">Your portfolio has been created and is ready to be deployed.</p>
            <div className="space-y-4">
              <div className="mt-4 space-y-2">
                <p className="text-gray-400 text-sm">
                  Your portfolio repository has been created on GitHub. Click &quot;Deploy on Vercel&quot; to make it live!
                </p>
                <p className="text-gray-400 text-sm">
                  Want to make changes? You can edit your portfolio by updating the repository on GitHub.
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <a
                  href={githubRepoUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  View on GitHub
                </a>
                <a
                  href={githubRepoUrl ? `https://vercel.com/new/import?repository-url=${encodeURIComponent(githubRepoUrl)}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="https://vercel.com/button"
                    alt="Deploy with Vercel"
                    width={120}
                    height={32}
                    unoptimized
                  />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information Section */}
            <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('basic')}
                className="w-full px-6 py-4 flex justify-between items-center"
              >
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                <svg
                  className={`w-5 h-5 text-white transform transition-transform ${
                    openSections.basic ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.basic && (
                <div className="px-6 pb-6">
                  {error && (
                    <div className="backdrop-blur-md bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-400">
                      {error}
                    </div>
                  )}

                  {Object.keys(validationErrors).length > 0 && (
                    <div className="backdrop-blur-md bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <h3 className="text-red-400 font-semibold mb-2">Please fix the following errors:</h3>
                      <ul className="list-disc list-inside text-red-400">
                        {Object.entries(validationErrors).map(([field, message]) => (
                          <li key={field}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`mt-1 block w-full rounded-xl bg-white/5 border ${
                          validationErrors.name ? 'border-red-500/50' : 'border-white/10'
                        } text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                        required
                      />
                      {validationErrors.name && (
                        <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className={`mt-1 block w-full rounded-xl bg-white/5 border ${
                          validationErrors.description ? 'border-red-500/50' : 'border-white/10'
                        } text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                        required
                      />
                      {validationErrors.description && (
                        <p className="mt-1 text-sm text-red-400">{validationErrors.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('projects')}
                className="w-full px-6 py-4 flex justify-between items-center"
              >
                <h2 className="text-xl font-semibold text-white">Projects</h2>
                <svg
                  className={`w-5 h-5 text-white transform transition-transform ${
                    openSections.projects ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.projects && (
                <div className="px-6 pb-6">
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
                        <div className="backdrop-blur-md bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300">Project Name</label>
                              <input
                                type="text"
                                value={project.name}
                                onChange={(e) => updateProject(index, 'name', e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                placeholder="e.g., E-commerce Website"
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
                                placeholder="Describe your project and its key features"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300">Technologies</label>
                              <div className="space-y-2">
                                {project.technologies.map((tech, techIndex) => (
                                  <div key={techIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={tech}
                                      onChange={(e) => updateTechnology(index, techIndex, e.target.value)}
                                      className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                      placeholder="e.g., React, Node.js, MongoDB"
                                      required
                                    />
                                    {project.technologies.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeTechnology(index, techIndex)}
                                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addTechnology(index)}
                                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-colors"
                                >
                                  Add Technology
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300">GitHub URL</label>
                              <input
                                type="url"
                                value={project.githubUrl}
                                onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                placeholder="https://github.com/username/project"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300">Live URL</label>
                              <input
                                type="url"
                                value={project.liveUrl}
                                onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                placeholder="https://your-project.com"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center my-4">
                    <button
                      type="button"
                      onClick={addProject}
                      className="px-4 py-2 bg-indigo-400 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('experience')}
                className="w-full px-6 py-4 flex justify-between items-center"
              >
                <h2 className="text-xl font-semibold text-white">Work Experience</h2>
                <svg
                  className={`w-5 h-5 text-white transform transition-transform ${
                    openSections.experience ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.experience && (
                <div className="px-6 pb-6">
                  <div className="space-y-6">
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="space-y-4 relative">
                        {formData.experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                          >
                            ×
                          </button>
                        )}
                        <div className="backdrop-blur-md bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300">Company Name</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                placeholder="e.g., Google"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300">Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                placeholder="e.g., San Francisco, CA"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-300">Period</label>
                              <input
                                type="text"
                                value={exp.period}
                                onChange={(e) => updateExperience(index, 'period', e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                placeholder="e.g., Jan 2020 - Present"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-300">Description</label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                placeholder="Describe your role and achievements"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center my-4">
                    <button
                      type="button"
                      onClick={addExperience}
                      className="px-4 py-2 bg-indigo-400 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
                    >
                      Add Experience
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links Section */}
            <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">GitHub</label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, github: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Twitter</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleInputChange('socialLinks', { ...formData.socialLinks, twitter: e.target.value })}
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Theme Customization Section */}
            <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('theme')}
                className="w-full px-6 py-4 flex justify-between items-center"
              >
                <h2 className="text-xl font-semibold text-white">Theme Customization</h2>
                <svg
                  className={`w-5 h-5 text-white transform transition-transform ${
                    openSections.theme ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.theme && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
                      <div className="grid grid-cols-2 gap-2">
                        {themeOptions.background.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleInputChange('theme', { ...formData.theme, background: option.value })}
                            className={`p-2 rounded-lg border ${
                              formData.theme.background === option.value
                                ? 'border-purple-500 ring-2 ring-purple-500'
                                : 'border-white/10'
                            } ${option.color} transition-all duration-200`}
                          >
                            <span className={`text-xs ${option.textColor}`}>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                      <div className="grid grid-cols-2 gap-2">
                        {themeOptions.primary.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleInputChange('theme', { ...formData.theme, primary: option.value })}
                            className={`p-2 rounded-lg border ${
                              formData.theme.primary === option.value
                                ? 'border-purple-500 ring-2 ring-purple-500'
                                : 'border-white/10'
                            } bg-gray-800 transition-all duration-200`}
                          >
                            <span className={`text-xs ${option.color}`}>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
                      <div className="grid grid-cols-2 gap-2">
                        {themeOptions.text.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleInputChange('theme', { ...formData.theme, text: option.value })}
                            className={`p-2 rounded-lg border ${
                              formData.theme.text === option.value
                                ? 'border-purple-500 ring-2 ring-purple-500'
                                : 'border-white/10'
                            } ${option.bgColor} transition-all duration-200`}
                          >
                            <span className={`text-xs ${option.color}`}>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Theme Preview Section */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Preview</h3>
                    <div className={`p-6 rounded-3xl shadow-lg border border-white/10 ${
                      themeOptions.background.find(b => b.value === formData.theme.background)?.color
                    }`}>
                      <div className="space-y-4">
                        <h4 className={`text-xl font-semibold ${
                          themeOptions.text.find(t => t.value === formData.theme.text)?.color
                        }`}>
                          Your Name
                        </h4>
                        <p className={`${
                          themeOptions.text.find(t => t.value === formData.theme.text)?.color
                        }`}>
                          Brief description about yourself and your work.
                        </p>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            themeOptions.primary.find(p => p.value === formData.theme.primary)?.bgColor
                          } text-white`}>
                            React
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            themeOptions.primary.find(p => p.value === formData.theme.primary)?.bgColor
                          } text-white`}>
                            Node.js
                          </span>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                          <button className={`px-4 py-2 rounded-xl ${
                            themeOptions.primary.find(p => p.value === formData.theme.primary)?.bgColor
                          } text-white`}>
                            View Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Portfolio'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 