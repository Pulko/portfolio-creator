import { Octokit } from '@octokit/rest';
import { getToken } from 'next-auth/jwt';
import { NextApiRequest } from 'next';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface PortfolioData {
  name: string;
  description: string;
  projects: Project[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export async function getAuthenticatedOctokit(req: NextApiRequest) {
  const token = await getToken({ req });
  if (!token?.accessToken) {
    throw new Error('No access token found');
  }
  return new Octokit({ auth: token.accessToken });
}

export async function createPortfolioRepo(octokit: Octokit, data: PortfolioData) {
  try {
    // Create the repository
    const repo = await octokit.repos.createForAuthenticatedUser({
      name: `${data.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
      description: data.description,
      private: false,
      auto_init: true, // This will create an initial commit with a README
    });

    const repoName = repo.data.name;
    const owner = repo.data.owner.login;

    // Get the initial README content to get its SHA
    const readmeContent = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: 'README.md',
    });

    const readmeSha = Array.isArray(readmeContent.data) ? null : readmeContent.data.sha;

    // Update README.md
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: 'README.md',
      message: 'Update README with portfolio information',
      content: Buffer.from(`
# ${data.name}'s Portfolio

${data.description}

## Projects

${data.projects.map(project => `
### ${project.name}
${project.description}

**Technologies:** ${project.technologies.join(', ')}

${project.githubUrl ? `[GitHub](${project.githubUrl})` : ''} ${project.liveUrl ? `[Live Demo](${project.liveUrl})` : ''}
`).join('\n')}

## Connect with me

${data.socialLinks.github ? `- [GitHub](${data.socialLinks.github})` : ''}
${data.socialLinks.linkedin ? `- [LinkedIn](${data.socialLinks.linkedin})` : ''}
${data.socialLinks.twitter ? `- [Twitter](${data.socialLinks.twitter})` : ''}
      `).toString('base64'),
      sha: readmeSha || undefined,
    });

    // Create index.html
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: 'index.html',
      message: 'Add portfolio website',
      content: Buffer.from(generatePortfolioPage(data)).toString('base64'),
    });

    return repo.data.html_url;
  } catch (error) {
    console.error('Error creating portfolio repository:', error);
    throw error;
  }
}

function generatePortfolioPage(data: PortfolioData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name}'s Portfolio</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            margin-bottom: 40px;
        }
        h1 {
            color: #2d3748;
        }
        .description {
            color: #4a5568;
            font-size: 1.2em;
        }
        .projects {
            margin-top: 40px;
        }
        .project {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .technologies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
        }
        .tech-tag {
            background: #e2e8f0;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .links {
            margin-top: 10px;
        }
        .links a {
            margin-right: 15px;
            color: #3182ce;
            text-decoration: none;
        }
        .links a:hover {
            text-decoration: underline;
        }
        .social-links {
            margin-top: 40px;
            text-align: center;
        }
        .social-links a {
            margin: 0 10px;
            color: #4a5568;
            text-decoration: none;
        }
        .social-links a:hover {
            color: #3182ce;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.name}</h1>
            <p class="description">${data.description}</p>
        </header>

        <div class="projects">
            ${data.projects.map(project => `
            <div class="project">
                <h2>${project.name}</h2>
                <p>${project.description}</p>
                <div class="technologies">
                    ${project.technologies.map(tech => `
                    <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                <div class="links">
                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank">GitHub</a>` : ''}
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank">Live Demo</a>` : ''}
                </div>
            </div>
            `).join('')}
        </div>

        <div class="social-links">
            ${data.socialLinks.github ? `<a href="${data.socialLinks.github}" target="_blank">GitHub</a>` : ''}
            ${data.socialLinks.linkedin ? `<a href="${data.socialLinks.linkedin}" target="_blank">LinkedIn</a>` : ''}
            ${data.socialLinks.twitter ? `<a href="${data.socialLinks.twitter}" target="_blank">Twitter</a>` : ''}
        </div>
    </div>
</body>
</html>
  `;
} 