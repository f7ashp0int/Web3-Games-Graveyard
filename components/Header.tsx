import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-4 border-b border-[#342f52]/50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="/wgd-Light.svg" 
            alt="Web3 Games Graveyard Logo" 
            className="w-16 h-16"
          />
          <div className="flex flex-col leading-tight">
            <h1 className="text-xl font-bold text-white tracking-wider">Web3 Games</h1>
            <h2 className="text-lg font-medium text-gray-400 tracking-wider">Graveyard</h2>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;