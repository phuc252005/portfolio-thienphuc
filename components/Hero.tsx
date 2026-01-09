
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoPlayer from './VideoPlayer';

const Hero: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Sử dụng ảnh từ folder components/img/
  const heroImageUrl = new URL('./img/avt.jpg', import.meta.url).href;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        yPercent: 15,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: -100,
        opacity: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom 20%',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Section */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <img 
          src={heroImageUrl} 
          alt="Hero Background" 
          className="w-full h-full object-cover grayscale opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-80" />
      </div>

      {/* Top Metadata */}
      <div className="absolute top-12 left-0 w-full px-6 md:px-12 z-20 flex justify-between items-start pointer-events-none">
        <div className="mono text-[7px] md:text-[9px] text-white/30 tracking-[0.5em] uppercase leading-relaxed">
           <p className="mb-1 text-white/10">PROJECT EDITION</p>
           <p className="font-bold">SYSTEM ARCHITECT ©2024</p>
        </div>
        <div className="mono text-[7px] md:text-[9px] text-white/30 tracking-[0.5em] uppercase text-right hidden md:block">
           <p>SCROLL TO EXPLORE</p>
           <p className="mt-1">HANOI, VN</p>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="relative z-10 w-full flex flex-col items-center mt-[35vh] md:mt-[40vh]">
        <p className="mono text-[8px] md:text-[11px] tracking-[0.7em] mb-6 opacity-40 uppercase font-black text-center">
          Creative Strategist / MIS Specialist
        </p>
        
        <div className="w-full overflow-hidden flex justify-center px-4">
          <h1 
            ref={titleRef}
            className="text-[13vw] sm:text-[14vw] md:text-[16vw] font-black tracking-[-0.08em] select-none uppercase text-center text-white leading-[0.75] whitespace-nowrap drop-shadow-2xl"
          >
            THIEN PHUC
            <span className="text-[2.5vw] opacity-10 italic ml-2 align-top font-light">®</span>
          </h1>
        </div>

        {/* Action Button */}
        <div 
          onClick={() => setIsVideoOpen(true)}
          className="mt-10 md:mt-16 flex flex-col items-center gap-4 group cursor-pointer pointer-events-auto"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/10 rounded-full group-hover:scale-110 group-hover:bg-white group-hover:border-white transition-all duration-700 ease-[0.23,1,0.32,1]" />
            <span className="mono text-[10px] font-black group-hover:text-black transition-colors duration-500 uppercase tracking-tighter">PLAY</span>
          </div>
          <p className="mono text-[8px] tracking-[0.4em] opacity-20 group-hover:opacity-100 uppercase transition-all duration-500 group-hover:tracking-[0.6em]">
            Discover Story
          </p>
        </div>
      </div>

      {/* Bottom status */}
      <div className="absolute bottom-12 right-12 z-20 hidden md:block">
         <div className="mono text-[8px] text-right text-white/10 tracking-widest uppercase">
            <p className="mb-1">STATUS</p>
            <p className="font-bold text-white/30">SENIOR STUDENT</p>
         </div>
      </div>

      <VideoPlayer 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl={new URL('./img/caythong.mp4', import.meta.url).href}
      />
    </div>
  );
};

export default Hero;
