
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import Menu from './components/Menu';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import Projects from './components/Projects';
import Releases from './components/Releases';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Expose lenis instance to window for global access
    (window as any).lenis = lenis;

    function update(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);
    lenis.on('scroll', ScrollTrigger.update);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      (window as any).lenis = undefined;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigate = (id: string) => {
    const lenis = (window as any).lenis;
    if (lenis) {
      const target = id === 'home' ? 0 : `#${id}`;
      lenis.scrollTo(target, {
        offset: -80,
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Fallback if lenis is not ready
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="relative w-full bg-[#0a0a0a] text-white overflow-x-hidden">
      <CustomCursor />
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      
      <AnimatePresence>
        {isMenuOpen && (
          <Menu 
            onClose={() => {
              const lenis = (window as any).lenis;
              if (lenis) lenis.scrollTo(0);
              setIsMenuOpen(false);
            }} 
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>

      <main className="w-full">
        <section id="home"><Hero /></section>
        <section id="about" className="overflow-hidden"><About /></section>
        <section id="story"><Story /></section>
        <section id="projects" className="overflow-hidden"><Projects /></section>
        <section id="releases" className="py-20 md:py-32 overflow-hidden"><Releases /></section>
        <section id="contact"><Contact /></section>
      </main>

      <footer className="p-6 md:p-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-10 mono text-[10px] uppercase text-white/40 tracking-wider">
        <div className="space-y-2">
          <p>© 2024 THIEN PHUC® PORTFOLIO</p>
          <p>BUILT FOR IMPACT</p>
        </div>
        <div className="flex gap-16">
          <div className="space-y-2">
            <p className="text-white/20">LOCATIONS</p>
            <p>HANOI / VIETNAM</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
