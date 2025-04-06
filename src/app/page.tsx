import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Your Digital Presence, Simplified
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create a stunning portfolio in minutes. No coding required. Just your creativity and our powerful tools.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/create"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Create Your Portfolio
            </a>
            <a
              href="#features"
              className="px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project Showcase */}
          <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-6">
            <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Project Showcase</h3>
            <p className="text-gray-400">
              Highlight your best work with detailed project descriptions, technologies used, and links to GitHub and live demos.
            </p>
          </div>

          {/* Work Experience */}
          <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-6">
            <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Work Experience</h3>
            <p className="text-gray-400">
              Showcase your professional journey with detailed work experience, including company details, roles, and achievements.
            </p>
          </div>

          {/* Theme Customization */}
          <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-6">
            <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Theme Customization</h3>
            <p className="text-gray-400">
              Choose from multiple color themes to match your personal style. Preview your changes in real-time.
            </p>
          </div>

          {/* Social Integration */}
          <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-6">
            <div className="h-12 w-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Social Integration</h3>
            <p className="text-gray-400">
              Connect your GitHub, LinkedIn, and Twitter profiles to showcase your professional network.
            </p>
          </div>

          {/* One-Click Deployment */}
          <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-6">
            <div className="h-12 w-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">One-Click Deployment</h3>
            <p className="text-gray-400">
              Deploy your portfolio to Vercel with a single click. Get a professional domain and HTTPS included.
            </p>
          </div>

          {/* GitHub Integration */}
          <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-6">
            <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">GitHub Integration</h3>
            <p className="text-gray-400">
              Seamlessly create and manage your portfolio repository on GitHub. Edit your content anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-12 left-1/4 w-1/2 h-1 bg-gradient-to-r from-purple-500/50 to-indigo-500/50"></div>
          <div className="hidden md:block absolute top-12 right-1/4 w-1/2 h-1 bg-gradient-to-r from-indigo-500/50 to-green-500/50"></div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mr-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-white">Sign in with GitHub</h3>
                </div>
                <p className="text-gray-400 pl-16">
                  Connect your GitHub account to get started. This allows us to create your portfolio repository and handle deployments seamlessly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mr-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-white">Customize Your Portfolio</h3>
                </div>
                <p className="text-gray-400 pl-16">
                  Fill in your details, add projects, work experience, and choose your preferred theme. Preview your changes in real-time.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mr-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-white">Deploy & Share</h3>
                </div>
                <p className="text-gray-400 pl-16">
                  With one click, deploy your portfolio to Vercel. Get a professional domain and share your work with the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="backdrop-blur-md bg-white/5 rounded-3xl shadow-lg border border-white/10 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Portfolio?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who have created their professional portfolios with us.
          </p>
          <a
            href="/create"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
          >
            Get Started Now
          </a>
        </div>
      </div>

      {/* Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-300 mb-6">Created with ❤️ by</p>
          <div className="flex justify-center space-x-12">
            <a
              href="https://github.com/Pulko"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors text-lg"
            >
              @Pulko
            </a>
            <a
              href="https://www.linkedin.com/in/fedor-tkachenko/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors text-lg"
            >
              Fedor Tkachenko
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
