import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 pt-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Your Digital Presence, Simplified
            </h1>
            <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Create a stunning portfolio in minutes. No coding required. Just your creativity and our powerful tools.
            </p>
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-16 py-6 rounded-2xl transition-all duration-200 transform hover:scale-105 text-2xl shadow-lg shadow-purple-500/30 mb-16"
            >
              Start Building Now →
            </Link>
            <div className="backdrop-blur-md bg-white/5 p-12 rounded-3xl shadow-lg border border-white/10">
              <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="text-3xl font-bold mb-4 text-white">Your Future Portfolio</h3>
                  <p className="text-gray-300 mb-8">A modern, responsive design that showcases your work</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-xl">
                      <div className="h-2 bg-purple-400/20 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-purple-400/20 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl">
                      <div className="h-2 bg-purple-400/20 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-purple-400/20 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-20 text-white">Everything You Need to Shine</h2>
            <div className="grid md:grid-cols-2 gap-12 mb-24">
              <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl shadow-lg border border-white/10">
                <h3 className="text-2xl font-semibold mb-6 text-white">Showcase Your Best Work</h3>
                <p className="text-gray-300 mb-6">Highlight your projects with beautiful cards, descriptions, and live demos. Add screenshots, links, and detailed explanations to impress potential employers and clients.</p>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 text-purple-400">✓</span>
                    Project descriptions and screenshots
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 text-purple-400">✓</span>
                    Live demo links and GitHub repositories
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 text-purple-400">✓</span>
                    Technology stack and key features
                  </li>
                </ul>
              </div>
              <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl shadow-lg border border-white/10">
                <h3 className="text-2xl font-semibold mb-6 text-white">Connect with Your Audience</h3>
                <p className="text-gray-300 mb-6">Make it easy for visitors to reach out and learn more about you. Add all your professional links and contact information in one place.</p>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 text-purple-400">✓</span>
                    Social media profiles
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 text-purple-400">✓</span>
                    Professional contact information
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 text-purple-400">✓</span>
                    Custom call-to-action buttons
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="pt-32">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-20 text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl shadow-lg border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-8 mx-auto">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-center text-white">Sign in with GitHub</h3>
              <p className="text-gray-300 text-center">Connect your GitHub account to get started. This allows us to create your portfolio repository and handle deployments seamlessly.</p>
            </div>
            <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl shadow-lg border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-8 mx-auto">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-center text-white">Fill in your details</h3>
              <p className="text-gray-300 text-center">Tell us about yourself, your skills, and showcase your best projects. Add your social links to help others connect with you.</p>
            </div>
            <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl shadow-lg border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-8 mx-auto">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-center text-white">Deploy instantly</h3>
              <p className="text-gray-300 text-center">With one click, your portfolio goes live on Vercel. Share your professional presence with the world in seconds.</p>
            </div>
          </div>
          <div className="text-center mt-20">
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-12 py-5 rounded-xl transition-all duration-200 transform hover:scale-105 text-lg shadow-lg shadow-purple-500/30"
            >
              Create Your Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
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
      </section>
    </main>
  );
}
