import { Octokit } from '@octokit/rest';
import { getToken } from 'next-auth/jwt';
import { NextApiRequest } from 'next';

interface Project {
  name: string;
  description: string;
  url: string;
}

interface PortfolioData {
  name: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  linkedin: string;
  projects: Project[];
}

export async function getAuthenticatedOctokit(req: NextApiRequest) {
  const token = await getToken({ req });
  if (!token?.accessToken) {
    throw new Error('No access token found');
  }
  return new Octokit({ auth: token.accessToken });
}

export async function createPortfolioRepo(
  octokit: Octokit,
  data: PortfolioData
): Promise<string> {
  const { name, bio, location, website, twitter, github, linkedin, projects } = data;

  // Create a new repository
  const repo = await octokit.repos.createForAuthenticatedUser({
    name: `${name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
    description: 'My personal portfolio',
    private: false,
    auto_init: true,
  });

  const repoName = repo.data.name;
  const owner = repo.data.owner.login;

  // Create README.md
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: 'README.md',
    message: 'Initial commit',
    content: Buffer.from(
      `# ${name}'s Portfolio\n\n${bio}\n\n## Projects\n\n${projects
        .map(
          (project) =>
            `### ${project.name}\n\n${project.description}\n\n[View Project](${project.url})`
        )
        .join('\n\n')}`
    ).toString('base64'),
  });

  // Create index.html
  const htmlContent = generatePortfolioPage(data);
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: 'index.html',
    message: 'Add portfolio page',
    content: Buffer.from(htmlContent).toString('base64'),
  });

  return `https://github.com/${owner}/${repoName}`;
}

function generatePortfolioPage(data: PortfolioData): string {
  const { name, bio, location, website, twitter, github, linkedin, projects } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name}'s Portfolio</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 2rem;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          color: #2d3748;
        }
        .social-links {
          margin: 2rem 0;
        }
        .social-links a {
          margin-right: 1rem;
          color: #4a5568;
          text-decoration: none;
        }
        .projects {
          margin-top: 2rem;
        }
        .project {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${name}</h1>
        <p>${bio}</p>
        ${location ? `<p>📍 ${location}</p>` : ''}
        
        <div class="social-links">
          ${website ? `<a href="${website}" target="_blank">🌐 Website</a>` : ''}
          ${twitter ? `<a href="${twitter}" target="_blank">🐦 Twitter</a>` : ''}
          ${github ? `<a href="${github}" target="_blank">💻 GitHub</a>` : ''}
          ${linkedin ? `<a href="${linkedin}" target="_blank">🔗 LinkedIn</a>` : ''}
        </div>

        <div class="projects">
          <h2>Projects</h2>
          ${projects
            .map(
              (project) => `
            <div class="project">
              <h3>${project.name}</h3>
              <p>${project.description}</p>
              <a href="${project.url}" target="_blank">View Project</a>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </body>
    </html>
  `;
} 