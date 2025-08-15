import React from 'react';

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">J</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">Jen Gen AI</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Projects</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Marketplace</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Governance</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Discord</a>
          </div>
        </div>
        
        {/* Login Button */}
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Log in
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative px-8 py-20">
        {/* Decorative Icons */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
          <div className="w-8 h-8 border-2 border-purple-400 rounded-full"></div>
          <div className="w-8 h-8 bg-green-400 rounded-full"></div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
            Discover <span className="text-purple-600">Unique</span> NFT places
          </h1>
        </div>

        {/* Cards Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Left Donation Card */}
          <div className="absolute left-0 top-20 bg-white rounded-2xl p-4 shadow-lg z-10 w-48">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-800">Anna May</p>
                <p className="text-sm text-gray-500">Donated $100</p>
              </div>
            </div>
          </div>

          {/* Right Donation Card */}
          <div className="absolute right-0 top-32 bg-white rounded-2xl p-4 shadow-lg z-10 w-48">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-800">Jane Holand</p>
                <p className="text-sm text-gray-500">Donated $500</p>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-gradient-to-r from-purple-400 via-pink-300 to-orange-300 rounded-3xl p-8 shadow-2xl">
              {/* Abstract geometric shapes */}
              <div className="relative h-96 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-400 to-orange-300"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600 rounded-full opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-t from-yellow-300 to-orange-200 rounded-tl-full"></div>
                <div className="absolute center w-full h-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40"></div>
                
                {/* Landscape imagery overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-800 via-green-600 to-transparent opacity-70"></div>
                <div className="absolute bottom-8 left-8 right-8 h-16 bg-orange-200 opacity-60 rounded-lg"></div>
              </div>

              {/* Card Info */}
              <div className="absolute bottom-8 left-8 bg-white/90 rounded-lg p-4 max-w-xs">
                <p className="text-sm text-gray-600 leading-relaxed">
                  The Environmental Social Governance (ESG) DAO that rewards contributors
                  for supporting community.
                </p>
              </div>

              {/* Mint Button */}
              <div className="absolute bottom-8 right-8">
                <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg">
                  Mint now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;