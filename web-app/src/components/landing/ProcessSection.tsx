import React from 'react';

const ProcessSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-20">
      {/* Header Section */}
      <div className="text-center mb-20 px-8">
        {/* Decorative elements */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
            <div className="w-8 h-8 bg-purple-300 rounded-full self-end"></div>
          </div>
          <div className="ml-12 text-4xl">✨</div>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8 leading-tight">
          Let's make <span className="text-orange-500">your art</span><br />
          <span className="text-gray-800">into digital assets</span>
        </h2>
      </div>

      {/* Donation Cards */}
      <div className="relative max-w-7xl mx-auto px-8">
        {/* Top Left Card */}
        <div className="absolute top-0 left-8 bg-white rounded-2xl p-4 shadow-lg z-10 w-52">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-gray-800">Anna May</p>
              <p className="text-sm text-gray-500">Donated $100</p>
            </div>
          </div>
        </div>

        {/* Top Right Card */}
        <div className="absolute top-16 right-8 bg-white rounded-2xl p-4 shadow-lg z-10 w-52">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-gray-800">Jane Holand</p>
              <p className="text-sm text-gray-500">Donated $500</p>
            </div>
          </div>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {/* Create Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            <div className="absolute top-8 right-8 w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-400 rounded-lg"></div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Create</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Click My Collections and set up your collection. Add a description, 
                profile & banner images, and set a secondary sales fee.
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors w-full">
                Create
              </button>
            </div>
          </div>

          {/* Instant Payment Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl relative">
            {/* Connection lines */}
            <div className="absolute -left-4 top-16 w-8 h-px bg-purple-300"></div>
            <div className="absolute -right-4 top-16 w-8 h-px bg-purple-300"></div>
            
            {/* Decorative elements */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Connection dots */}
            <div className="absolute left-8 top-8 w-3 h-3 bg-orange-400 rounded-full"></div>
            <div className="absolute right-8 top-8 w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="absolute left-16 bottom-32 w-2 h-2 bg-purple-400 rounded-full"></div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Instant payment</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Put NFTs on sale or on auction. Get paid for your digital collectables
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Sale now
              </button>
            </div>
          </div>

          {/* Set up Wallet Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
            <div className="absolute top-8 left-8 w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-pink-400 rounded-lg"></div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Set up your wallet</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Once you've set up your wallet of choice, connect it by clicking 
                the wallet icon in the top right corner.
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors w-full">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;