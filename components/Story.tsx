
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Story: React.FC = () => {
  const img1Ref = useRef<HTMLImageElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (img1Ref.current) {
      gsap.to(img1Ref.current, {
        y: -60,
        scrollTrigger: {
          trigger: img1Ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    if (textContainerRef.current) {
      gsap.fromTo(textContainerRef.current.querySelectorAll('.reveal'), 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.2, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: textContainerRef.current,
            start: 'top 80%',
          }
        }
      );
    }
  }, []);

  return (
    <div id="story-content" className="px-6 md:px-12 py-24 md:py-48 bg-[#0a0a0a] border-t border-white/5 relative">
      {/* Background Text Decor - Ensure pointer-events-none to fix scroll issues */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none z-0">
        <h2 className="text-[25vw] font-black italic tracking-tighter uppercase whitespace-nowrap">BRIDGE</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-screen-2xl mx-auto relative z-10">
        <div className="lg:col-span-5 relative">
           <div className="aspect-[3/4] bg-white/5 overflow-hidden rounded-sm border border-white/5 shadow-2xl">
              <img 
                ref={img1Ref} 
                src="https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=2070" 
                className="w-full h-[130%] object-cover opacity-30 grayscale contrast-125" 
                alt="Analytical focus"
              />
           </div>
           {/* Floating Badge */}
           <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 hidden md:block rounded-sm shadow-xl">
              <p className="mono text-[8px] font-black tracking-[0.4em] uppercase">BA VISION 2024</p>
           </div>
        </div>

        <div ref={textContainerRef} className="lg:col-span-6 lg:col-start-7 space-y-12">
          <div className="space-y-4">
            <h3 className="reveal text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
              MY <br />STORY
            </h3>
            <p className="reveal mono text-[10px] tracking-[0.5em] text-white/30 uppercase italic">Exploring the gap between logic and human needs</p>
          </div>

          <div className="space-y-8 max-w-xl">
            <p className="reveal text-lg md:text-2xl text-white/70 leading-relaxed font-light">
              I perceive complex systems not merely as static lines of code, but as a continuous, vital dialogue between <span className="text-white italic font-medium">people</span> and <span className="text-white italic font-medium">solutions</span>. 
            </p>
            
            <p className="reveal text-lg md:text-2xl text-white/70 leading-relaxed font-light">
              With a foundation in the Banking sector, I have honed a meticulous approach to data analysis and a sharp eye for operational workflows. My mission is to decode intricate business challenges into <span className="underline decoration-white/20 underline-offset-8">streamlined and high-impact</span> technological blueprints.
            </p>
          </div>

          <div className="reveal pt-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-[1px] bg-white/20" />
              <span className="mono text-[9px] tracking-[0.5em] uppercase text-white/40">Core Mission</span>
            </div>
            <p className="text-sm md:text-base font-bold italic tracking-tight opacity-100 text-white/90">
              "Translating organizational chaos into absolute clarity, and business hurdles into technical innovation."
            </p>
          </div>

          {/* Quick Stats for BA Intern */}
          <div className="reveal grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
             <div>
                <p className="mono text-[8px] opacity-30 uppercase mb-2">Requirement Strategy</p>
                <p className="text-xs font-bold tracking-widest uppercase">Elicitation Focused</p>
             </div>
             <div>
                <p className="mono text-[8px] opacity-30 uppercase mb-2">Development Approach</p>
                <p className="text-xs font-bold tracking-widest uppercase italic">User-Centric Architecture</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
