import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-4 border-b border-[#342f52]/50 relative z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="./wgd-Light.svg" 
            alt="Web3 Games Graveyard Logo" 
            className="w-16 h-16"
          />
          <div className="flex flex-col leading-tight">
            <h1 className="text-xl font-bold text-white tracking-wider font-logo">Web3 Games</h1>
            <h2 className="text-lg font-medium text-gray-400 tracking-wider font-logo">Graveyard</h2>
          </div>
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScrRVspMxpfoFIBUoq474p-LzNSZyPt2CTqD34s9BmVqwdq5g/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-[#7373bc] text-white font-semibold rounded-full transition-all duration-300 hover:bg-gradient-to-t from-[#A47CF3] to-[#683FEA] hover:shadow-[0_0_20px_0px_#9917FF] text-sm tracking-wide"
        >
          Submit Game
        </a>
      </div>
    </header>
  );
};

export default Header;