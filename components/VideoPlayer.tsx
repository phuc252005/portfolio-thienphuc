
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, onClose, videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-over-a-dark-forest-4437-large.mp4" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play failed:", e));
      setIsPlaying(true);
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: 'circle(0% at 50% 80%)', opacity: 0 }}
          animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }}
          exit={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Top Progress Line (Full width) */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 z-[220]">
            <motion.div 
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              animate={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>

          {/* BACK Button - Top Left */}
          <div 
            className="absolute top-8 left-8 sm:top-12 sm:left-12 z-[210] cursor-pointer group pointer-events-auto"
            onClick={onClose}
          >
            <span className="mono text-[8px] sm:text-[10px] tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity uppercase">
              BACK
            </span>
          </div>

          {/* Logo - Center Left */}
          <div className="absolute top-20 left-12 sm:top-24 sm:left-12 z-[210] pointer-events-none">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white/90">
              THIEN PHUC
              <span className="text-lg opacity-50 italic ml-1 align-top font-light">®</span>
            </h2>
          </div>

          {/* INTRODUCTION & TIME - Bottom Left */}
          <div className="absolute bottom-12 left-12 z-[210] pointer-events-none flex flex-col gap-2">
            <span className="mono text-[8px] md:text-[10px] tracking-[0.4em] opacity-40 uppercase font-bold">
              INTRODUCTION
            </span>
            <div className="flex items-center gap-4">
              {/* Play/Pause indicator style */}
              <div className="flex gap-1.5 items-center cursor-pointer pointer-events-auto" onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play();
                  } else {
                    videoRef.current.pause();
                  }
                }
              }}>
                {!isPlaying ? (
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                ) : (
                  <>
                <div className="w-[1.5px] h-4 bg-white/80" />
                <div className="w-[1.5px] h-4 bg-white/80" />
                  </>
                )}
              </div>
              <span className="mono text-2xl sm:text-3xl md:text-4xl font-light tracking-tighter text-white">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>

          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover opacity-50 sm:opacity-60"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            loop
            muted
            playsInline
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 opacity-70" />
          
          {/* Subtle Center Label (Optional) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
             <h2 className="text-[15vw] font-black italic tracking-tighter uppercase">STORY</h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayer;
