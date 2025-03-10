"use client";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero 区域 */}
      <main className="relative pt-16">
        <div className="max-w-[1200px] mx-auto px-4 pt-20 pb-16 text-center relative z-10">
          <h1 className="text-6xl font-bold text-black mt-16">
            The platform for the web.
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            Vercel provides the developer tools and cloud infrastructure to
            build, scale, and secure a faster, more personalized web.
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
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="black" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
