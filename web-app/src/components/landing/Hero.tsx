import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">J</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">JenGen AI</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">About</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Projects</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Marketplace</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Governance</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Discord</a>
          </div>
        </div>
        
        {/* Login Button */}
        <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md font-medium">
          Log in
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative px-8 py-12">
        {/* Decorative Icons */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">$</span>
          </div>
          <div className="w-10 h-10 border-2 border-purple-400 rounded-full flex items-center justify-center bg-white">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-20 mt-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight">
            Discover <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Unique</span> NFT places
          </h1>
        </div>

        {/* Cards Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Left Donation Card - Anna May */}
          <div className="absolute left-0 top-24 md:top-32 bg-white rounded-2xl p-4 shadow-xl z-20 w-56 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-400 to-red-600">
                <div className="w-full h-full bg-red-500 rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Anna May</p>
                <p className="text-sm text-gray-600">Donated $100</p>
              </div>
            </div>
          </div>

          {/* Right Donation Card - Jane Holand */}
          <div className="absolute right-0 top-8 md:top-16 bg-white rounded-2xl p-4 shadow-xl z-20 w-56 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Jane Holand</p>
                <p className="text-sm text-gray-600">Donated $500</p>
              </div>
            </div>
          </div>

          {/* Main Card Complex */}
          <div className="relative mx-auto w-full max-w-6xl">
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
              {/* Complex layered background matching the design */}
              <div className="relative h-[500px] md:h-[600px]">
                {/* Base gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-orange-100"></div>
                
                {/* Left abstract purple section */}
                <div className="absolute left-0 top-0 bottom-0 w-[40%]">
                  <div className="relative h-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-r-[120px]">
                    {/* Large blue circle */}
                    <div className="absolute top-16 left-8 w-44 h-44 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-90"></div>
                    {/* Small orange accent */}
                    <div className="absolute bottom-20 left-6 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-80"></div>
                  </div>
                </div>
                
                {/* Center landscape panel */}
                <div className="absolute left-[38%] top-4 bottom-4 w-[28%]">
                  <div className="h-full bg-gradient-to-b from-yellow-200 via-yellow-100 to-orange-100 rounded-2xl overflow-hidden shadow-inner">
                    {/* Sky to mountain gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-yellow-100 to-blue-200"></div>
                    {/* Mountain silhouette */}
                    <div className="absolute bottom-1/3 left-0 right-0 h-1/3">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <polygon points="0,40 20,10 40,25 60,15 80,30 100,20 100,40" fill="rgba(99, 102, 241, 0.4)"/>
                      </svg>
                    </div>
                    {/* Water/lake */}
                    <div className="absolute bottom-1/4 left-0 right-0 h-1/6 bg-gradient-to-r from-blue-300 to-blue-400 opacity-70"></div>
                    {/* Grass/foreground */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-green-600 via-green-500 to-transparent opacity-80"></div>
                  </div>
                </div>
                
                {/* Right landscape panel */}
                <div className="absolute right-4 top-4 bottom-4 w-[30%]">
                  <div className="h-full bg-gradient-to-b from-orange-100 via-yellow-100 to-orange-200 rounded-2xl overflow-hidden shadow-inner">
                    {/* Mountain background */}
                    <div className="absolute top-1/4 left-0 right-0 h-1/2">
                      <svg viewBox="0 0 100 50" className="w-full h-full">
                        <polygon points="0,50 15,20 30,35 50,15 70,30 85,25 100,35 100,50" fill="rgba(139, 69, 19, 0.3)"/>
                      </svg>
                    </div>
                    {/* Foreground grass */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-700 via-green-600 to-transparent opacity-70"></div>
                  </div>
                </div>
                
                {/* Purple accent dots */}
                <div className="absolute right-20 bottom-20 w-6 h-6 bg-purple-500 rounded-full"></div>
                <div className="absolute left-1/2 top-24 w-4 h-4 bg-blue-400 rounded-full"></div>
                
                {/* Vertical accent bars */}
                <div className="absolute right-16 top-8 w-3 h-32 bg-gradient-to-b from-orange-300 to-pink-300 rounded-full opacity-60"></div>
                <div className="absolute right-8 top-16 w-2 h-24 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full opacity-70"></div>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0">
                {/* ESG Description */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-sm shadow-lg">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    The Environmental Social Governance (ESG) DAO that rewards contributors
                    for supporting community.
                  </p>
                </div>

                {/* Mint Button */}
                <div className="absolute bottom-8 right-8">
                  <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
                    Mint now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;