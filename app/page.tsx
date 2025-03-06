export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <nav className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center">
              <div className="text-black font-bold flex items-center">
                <span className="text-lg mr-1">▲</span>
                <span>Vercel</span>
              </div>
            </a>

            {/* 导航菜单 */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50 flex items-center">
                  Products
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 w-[400px] bg-white shadow-lg rounded-lg p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">DX Platform</h3>
                    <div className="grid gap-4">
                      <a href="#" className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                        <span className="text-xl">📋</span>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Previews</p>
                          <p className="text-xs text-gray-500">Helping teams ship 6x faster</p>
                        </div>
                      </a>
                      <a href="#" className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                        <span className="text-xl">🤖</span>
                        <div className="ml-3">
                          <p className="text-sm font-medium">AI</p>
                          <p className="text-xs text-gray-500">Powering breakthroughs</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 其他导航项 */}
              <button className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50">Solutions</button>
              <button className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50">Resources</button>
              <a href="#" className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50">Enterprise</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50">Docs</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50">Pricing</a>
            </div>
          </div>

          {/* 右侧按钮组 */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-600 hover:text-black">Log In</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">Contact</a>
            <a href="#" className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800">Sign Up</a>
          </div>
        </nav>
      </header>

      {/* Hero 区域 */}
      <main className="relative pt-16">
        <div className="max-w-[1200px] mx-auto px-4 pt-20 pb-16 text-center relative z-10">
          <h1 className="text-6xl font-bold text-black mt-16">
            The platform for the web.
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            Vercel provides the developer tools and cloud infrastructure
            to build, scale, and secure a faster, more personalized web.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="px-6 py-3 bg-black text-white rounded-lg flex items-center hover:bg-gray-800">
              <span className="mr-2">▲</span>
              Start Deploying
            </button>
            <button className="px-6 py-3 bg-white text-black border border-gray-200 rounded-lg hover:border-gray-400">
              Get a Demo
            </button>
          </div>
        </div>

        {/* 渐变背景 */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,228,230,0.7)_0%,rgba(204,251,241,0.7)_100%)]"></div>
          </div>
        </div>

        {/* Vercel Logo */}
        <div className="relative z-10 flex justify-center mt-20">
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 76 65" fill="none">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="black"/>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
