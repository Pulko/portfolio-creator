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

export function generatePortfolioTemplate(data: PortfolioData): Record<string, string> {
  return {
    'index.html': generateHTMLPage(data),
    'README.md': generateReadme(data),
    'styles.css': generateStyles(),
  };
}

function generateHTMLPage(data: PortfolioData): string {
  const { name, bio, location, website, twitter, github, linkedin, projects } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}'s Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>${name}</h1>
      <p class="bio">${bio}</p>
      ${location ? `<p class="location">📍 ${location}</p>` : ''}
    </header>

    <section class="social-links">
      ${website ? `<a href="${website}" target="_blank" rel="noopener noreferrer">🌐 Website</a>` : ''}
      ${twitter ? `<a href="${twitter}" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>` : ''}
      ${github ? `<a href="${github}" target="_blank" rel="noopener noreferrer">💻 GitHub</a>` : ''}
      ${linkedin ? `<a href="${linkedin}" target="_blank" rel="noopener noreferrer">🔗 LinkedIn</a>` : ''}
    </section>

    <section class="projects">
      <h2>Projects</h2>
      ${projects.map(project => `
        <div class="project">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <a href="${project.url}" target="_blank" rel="noopener noreferrer">View Project</a>
        </div>
      `).join('')}
    </section>
  </div>
</body>
</html>`;
}

function generateReadme(data: PortfolioData): string {
  const { name, bio, projects } = data;

  return `# ${name}'s Portfolio

${bio}

## Projects

${projects.map(project => `
### ${project.name}

${project.description}

[View Project](${project.url})
`).join('\n\n')}`;
}

function generateStyles(): string {
  return `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 2rem;
  color: #333;
  background-color: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.bio {
  color: #4a5568;
  font-size: 1.1rem;
}

.location {
  color: #718096;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.social-links a {
  color: #4a5568;
  text-decoration: none;
  transition: color 0.2s;
}

.social-links a:hover {
  color: #2d3748;
}

.projects {
  margin-top: 2rem;
}

.project {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
}

.project h3 {
  margin-top: 0;
  color: #2d3748;
}

.project a {
  display: inline-block;
  margin-top: 1rem;
  color: #4299e1;
  text-decoration: none;
}

.project a:hover {
  text-decoration: underline;
}`;
} 