import { Octokit } from '@octokit/rest';
import { generatePortfolioTemplate } from './portfolio-template';

export async function createPortfolioRepository(
  accessToken: string,
  username: string,
  portfolioData: any
) {
  const octokit = new Octokit({ auth: accessToken });

  // Create a new repository
  const repo = await octokit.repos.createForAuthenticatedUser({
    name: `${username}-portfolio`,
    description: 'Personal portfolio website',
    private: false,
    auto_init: true,
  });

  // Get the template files
  const template = generatePortfolioTemplate(portfolioData);

  // Create files in the repository
  for (const [path, content] of Object.entries(template)) {
    await octokit.repos.createOrUpdateFileContents({
      owner: username,
      repo: `${username}-portfolio`,
      path,
      message: `Add ${path}`,
      content: Buffer.from(content).toString('base64'),
    });
  }

  return repo.data;
}

function generatePortfolioPage(portfolioData: any) {
  return `
import React from 'react';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">${portfolioData.name}</h1>
          <p className="text-xl text-gray-600">${portfolioData.bio}</p>
          <p className="text-gray-500">${portfolioData.location}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-gray-700">${portfolioData.bio}</p>
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
}
  `;
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
  return links.join('\n');
}

function generateProjects(projects: any[]) {
  return projects
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