
import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex justify-end items-center p-6 md:p-10 pointer-events-none">
      <button 
        onClick={onMenuToggle}
        className="mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:italic transition-all duration-300 pointer-events-auto mix-blend-difference bg-white/5 backdrop-blur-md md:bg-transparent md:backdrop-blur-none py-2 px-5 sm:px-6 rounded-full md:p-0 border border-white/10 md:border-none"
      >
        {isMenuOpen ? '[ CLOSE ]' : '[ MORE INFORMATION ]'}
      </button>
    </header>
  );
};

export default Header;
