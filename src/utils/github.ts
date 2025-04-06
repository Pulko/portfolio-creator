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
  theme?: {
    background?: string;
    primary?: string;
    text?: string;
  };
  experience: {
    company: string;
    period: string;
    location: string;
    description: string;
  }[];
}

interface ThemeColors {
  background: {
    dark: string;
    light: string;
    purple: string;
    blue: string;
  };
  primary: {
    purple: string;
    blue: string;
    green: string;
    red: string;
  };
  text: {
    light: string;
    dark: string;
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
    // Validate required data
    if (!data.name || !data.description) {
      throw new Error('Name and description are required');
    }

    if (!Array.isArray(data.projects) || data.projects.length === 0) {
      throw new Error('At least one project is required');
    }

    // Validate each project
    data.projects.forEach((project, index) => {
      if (!project.name || !project.description) {
        throw new Error(`Project ${index + 1} is missing name or description`);
      }
      if (!Array.isArray(project.technologies)) {
        throw new Error(`Project ${index + 1} technologies must be an array`);
      }
    });

    // Generate a unique repository name with timestamp
    const timestamp = new Date().getTime();
    const baseName = `${data.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`;
    const repoName = `${baseName}-${timestamp}`;

    // Create the repository
    const repo = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: data.description,
      private: false,
      auto_init: true, // This will create an initial commit with a README
    });

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
  const themeColors: ThemeColors = {
    background: {
      dark: '#1a1a1a',
      light: '#ffffff',
      purple: '#2d1b69',
      blue: '#1a365d'
    },
    primary: {
      purple: '#8b5cf6',
      blue: '#3b82f6',
      green: '#10b981',
      red: '#ef4444'
    },
    text: {
      light: '#ffffff',
      dark: '#1a1a1a'
    }
  };

  const bgColor = themeColors.background[data.theme?.background as keyof ThemeColors['background'] || 'dark'];
  const primaryColor = themeColors.primary[data.theme?.primary as keyof ThemeColors['primary'] || 'purple'];
  const textColor = themeColors.text[data.theme?.text as keyof ThemeColors['text'] || 'light'];

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
            color: ${textColor};
            background-color: ${bgColor};
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
            color: ${textColor};
        }
        .description {
            color: ${textColor};
            font-size: 1.2em;
            opacity: 0.9;
        }
        .projects {
            margin-top: 40px;
        }
        .project {
            background: ${bgColor === themeColors.background.light ? '#f7fafc' : 'rgba(255, 255, 255, 0.05)'};
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid ${bgColor === themeColors.background.light ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'};
        }
        .technologies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
        }
        .tech-tag {
            background: ${primaryColor};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .links {
            margin-top: 10px;
        }
        .links a {
            margin-right: 15px;
            color: ${primaryColor};
            text-decoration: none;
        }
        .links a:hover {
            text-decoration: underline;
            opacity: 0.8;
        }
        .social-links {
            margin-top: 40px;
            text-align: center;
        }
        .social-links a {
            margin: 0 10px;
            color: ${textColor};
            text-decoration: none;
            opacity: 0.9;
        }
        .social-links a:hover {
            color: ${primaryColor};
            opacity: 1;
        }
        .experience {
            margin-top: 40px;
        }
        .experience-item {
            background: ${bgColor === themeColors.background.light ? '#f7fafc' : 'rgba(255, 255, 255, 0.05)'};
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid ${bgColor === themeColors.background.light ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'};
        }
        .experience-item h3 {
            color: ${textColor};
            margin-top: 0;
        }
        .experience-item .period {
            color: ${textColor};
            opacity: 0.7;
            font-size: 0.9em;
        }
        .experience-item .location {
            color: ${textColor};
            opacity: 0.7;
            font-size: 0.9em;
        }
        .experience-item .description {
            margin-top: 10px;
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
            <h2>Projects</h2>
            ${data.projects.map(project => `
            <div class="project">
                <h3>${project.name}</h3>
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

        <div class="experience">
            <h2>Work Experience</h2>
            ${data.experience.map(exp => `
            <div class="experience-item">
                <h3>${exp.company}</h3>
                <div class="period">${exp.period}</div>
                <div class="location">${exp.location}</div>
                <p class="description">${exp.description}</p>
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