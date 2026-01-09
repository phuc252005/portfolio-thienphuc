
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuProps {
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onClose, onNavigate }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const menuItems = [
    { label: 'ABOUT', id: 'about', num: '01', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000' },
    { label: 'STORY', id: 'story', num: '02', img: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=1000' },
    { label: 'PROJECTS', id: 'projects', num: '03', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000' },
    { label: 'STACK', id: 'releases', num: '04', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000' },
    { label: 'CONTACT', id: 'contact', num: '05', img: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1000' },
  ];

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[200] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* Background Hover Preview */}
      <AnimatePresence mode="wait">
        {hoveredIdx !== null && (
          <motion.div
            key={hoveredIdx}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <img 
              src={menuItems[hoveredIdx].img} 
              className="w-full h-full object-cover grayscale" 
              alt="preview"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={onClose}
        className="absolute top-10 right-10 z-10 mono text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase border border-white/10 px-8 py-2.5 rounded-full backdrop-blur-sm"
      >
        [ CLOSE ]
      </button>

      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <p className="mono text-[8px] tracking-[0.6em] opacity-20 uppercase">Navigation Menu</p>
      </div>

      <div className="relative z-10 flex flex-col space-y-4 md:space-y-6 text-center w-full max-w-4xl px-6">
        {menuItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative group cursor-pointer flex items-center justify-center gap-6 py-2"
            onClick={() => onNavigate(item.id)}
          >
            <span className="mono text-xs md:text-sm text-white/10 group-hover:text-white/40 transition-colors hidden sm:block">
              {item.num}
            </span>
            <button
              className="text-5xl sm:text-7xl md:text-9xl font-black transition-all duration-500 tracking-tighter uppercase text-white/20 group-hover:text-white group-hover:italic group-hover:tracking-normal"
            >
              {item.label}
            </button>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/20 group-hover:w-full transition-all duration-700" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Menu;
