import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 border-t border-[#342f52]/50 mt-16 relative z-10">
      <div className="container mx-auto px-4 text-center text-gray-500">

        <div className="mb-10 flex flex-col items-center">
          <p className="text-lg text-gray-400 mb-4">What else is dying?</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScrRVspMxpfoFIBUoq474p-LzNSZyPt2CTqD34s9BmVqwdq5g/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 w-48 h-16 bg-[#7373bc] rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:bg-gradient-to-t from-[#A47CF3] to-[#683FEA] hover:shadow-[0_0_0_4px_rgba(104,63,234,0.4),0_0_60px_0px_#9917FF] hover:-translate-y-1"
          >
            <svg
              className="w-5 h-5 fill-white transition-all duration-500 ease group-hover:fill-white group-hover:scale-125"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <span className="text-white font-semibold text-lg transition-colors duration-300 group-hover:text-white">
              Update
            </span>
          </a>
        </div>
        
        <p>&copy; {new Date().getFullYear()} Web3 Games Graveyard. All rights reserved.</p>
        <p className="text-sm mt-2">A memorial to the fleeting nature of digital worlds.</p>
      </div>
    </footer>
  );
};

export default Footer;