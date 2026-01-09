
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const About: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (textRef.current) {
      const words = textRef.current.querySelectorAll('.word');
      gsap.fromTo(words, 
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.01,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 90%',
            once: true
          }
        }
      );
    }

    if (metadataRef.current) {
      gsap.fromTo(metadataRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: metadataRef.current,
            start: 'top 95%',
            once: true
          }
        }
      );
    }
  }, []);

  // Refined bio to avoid repetition of the specific degree name
  const bio = "Thien Phuc is a dedicated analyst at the Banking Academy of Vietnam. With a system analysis mindset and a passion for technology, Phuc focuses on optimizing business processes through data-driven insights and modern architectural solutions.";

  return (
    <div className="px-6 md:px-12 py-20 md:py-32 max-w-screen-2xl mx-auto border-t border-white/5 bg-[#0a0a0a]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-7">
           <p className="mono text-[8px] mb-8 opacity-20 tracking-[0.5em] uppercase flex items-center gap-4">
             <span className="w-6 h-[1px] bg-white/10"></span>
             CAPABILITY PROFILE
           </p>
           
           <div ref={textRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.4] tracking-tight text-white/90 mb-12">
              {bio.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-[0.25em] word opacity-0">{word}</span>
              ))}
           </div>

           {/* Education Metadata Section */}
           <div ref={metadataRef} className="border-l border-white/10 pl-8 py-2">
             <p className="mono text-[8px] opacity-20 tracking-[0.4em] uppercase mb-3 italic">Academic Background</p>
             <div className="space-y-1">
                <p className="mono text-[10px] md:text-xs font-bold text-white tracking-widest uppercase italic">
                  Management Information Systems (MIS)
                </p>
                <p className="mono text-[9px] md:text-[10px] text-white/40 tracking-[0.3em] uppercase">
                  Banking Academy of Vietnam // GPA: 3.4/4.0
                </p>
             </div>
           </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="aspect-[16/9] bg-white/5 overflow-hidden rounded-sm relative border border-white/5 group">
             <img 
               src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" 
               alt="Code" 
               className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
             <div className="absolute bottom-4 left-4">
               <span className="mono text-[7px] tracking-[0.6em] opacity-40 uppercase">System Intelligence</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
