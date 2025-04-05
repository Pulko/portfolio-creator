export function generatePortfolioTemplate(portfolioData: any) {
  const name = portfolioData.name || 'Portfolio';
  const bio = portfolioData.bio || 'Welcome to my portfolio website.';
  const location = portfolioData.location ? `Based in ${portfolioData.location}` : '';

  return {
    'README.md': `# ${name}'s Portfolio

${bio}

## About

This is my personal portfolio website showcasing my projects and skills.

## Technologies Used

- Next.js
- React
- Tailwind CSS

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Deployment

This portfolio is deployed on Vercel.`,

    'package.json': JSON.stringify({
      name: `${name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
      dependencies: {
        next: 'latest',
        react: 'latest',
        'react-dom': 'latest',
        'tailwindcss': 'latest',
        'autoprefixer': 'latest',
        'postcss': 'latest',
      },
    }, null, 2),

    'pages/index.js': `import React from 'react';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">${name}</h1>
          <p className="text-xl text-gray-600">${bio}</p>
          ${location ? `<p className="text-gray-500">${location}</p>` : ''}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-gray-700">${bio}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <div className="space-y-2">
              ${generateSocialLinks(portfolioData)}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${generateProjects(portfolioData.projects)}
          </div>
        </div>
      </div>
    </div>
  );
}`,

    'tailwind.config.js': `module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

    'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

    'styles/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`
  };
}

function generateSocialLinks(portfolioData: any) {
  const links = [];
  
  if (portfolioData.website) {
    links.push(`<a href="${portfolioData.website}" className="block text-blue-500 hover:underline">Website</a>`);
  }
  
  if (portfolioData.github) {
    links.push(`<a href="https://github.com/${portfolioData.github}" className="block text-blue-500 hover:underline">GitHub</a>`);
  }
  
  if (portfolioData.twitter) {
    links.push(`<a href="https://twitter.com/${portfolioData.twitter}" className="block text-blue-500 hover:underline">Twitter</a>`);
  }
  
  if (portfolioData.linkedin) {
    links.push(`<a href="https://linkedin.com/in/${portfolioData.linkedin}" className="block text-blue-500 hover:underline">LinkedIn</a>`);
  }

  // If no social links are provided, show a message
  if (links.length === 0) {
    return '<p className="text-gray-500">No social links provided</p>';
  }

  return links.join('\n');
}

function generateProjects(projects: any[]) {
  // Filter out empty projects
  const validProjects = projects.filter(project => 
    project.name && project.description && project.url
  );

  if (validProjects.length === 0) {
    return '<p className="text-gray-500">No projects added yet</p>';
  }

  return validProjects
    .map(
      (project) => `
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">${project.name}</h3>
      <p className="text-gray-600 mb-4">${project.description}</p>
      <a href="${project.url}" className="text-blue-500 hover:underline">View Project</a>
    </div>
  `
    )
    .join('\n');
} 