# Portfolio Creator

A web application that helps developers create and deploy their personal portfolio websites in minutes. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- GitHub authentication
- Easy-to-use form for portfolio information
- Automatic GitHub repository creation
- One-click deployment to Vercel
- Modern and responsive design
- Customizable portfolio template

## Prerequisites

- Node.js 18+ and npm
- GitHub account
- Vercel account (for deployment)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-creator.git
   cd portfolio-creator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a GitHub OAuth application:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Set the following:
     - Application name: Portfolio Creator
     - Homepage URL: http://localhost:3000
     - Authorization callback URL: http://localhost:3000/api/auth/callback/github

4. Create a `.env` file in the root directory:
   ```env
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/callback/github
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_key
   DEV_MODE=false
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Mode

To run the application without GitHub authentication (for development purposes), set `DEV_MODE=true` in your `.env` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
