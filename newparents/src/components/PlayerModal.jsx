import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  ChevronDown,
  SkipBack,
  SkipForward,
  Repeat,
} from "lucide-react";

const formatTime = (time) => {
  if (!time) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

const PlayerModal = ({
  isOpen,
  onClose,
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  isLooping,
  toggleLoop,
}) => {
  // --- LOGIQUE DU SWIPE (Suivi du doigt) ---
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    if (isOpen) setDragY(0);
  }, [isOpen]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 150) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  if (!track) return null;
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-[60] flex flex-col bg-black overflow-hidden`}
      style={{
        transform: isOpen ? `translateY(${dragY}px)` : "translateY(100%)",
        transition: isDragging
          ? "none"
          : "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      {/* --- FOND (VIDÉO ou IMAGE) --- */}
      <div className="absolute inset-0 z-0">
        {track.video ? (
          // 1. SI VIDÉO EXISTE : On joue la vidéo en boucle
          <video
            src={track.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-70"
          />
        ) : track.img ? (
          // 2. SINON SI IMAGE EXISTE : On affiche l'image
          <img
            src={track.img}
            alt={track.title}
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
        ) : (
          // 3. SINON : Fond de couleur
          <div className="w-full h-full bg-teal-900" />
        )}

        {/* Calque noir par dessus pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90" />
      </div>

      {/* --- CONTENU --- */}
      <div className="relative z-10 flex flex-col h-full text-white">
        {/* Header avec bouton fermer */}
        <div className="pt-12 pb-6 px-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronDown size={36} />
          </button>
          <span className="font-poppins text-xs font-bold tracking-widest text-white/60 uppercase">
            En lecture
          </span>
          <div className="w-8"></div>
        </div>

        {/* Espace flexible */}
        <div className="flex-1" />

        {/* Partie Basse */}
        <div className="px-8 pb-16">
          <div className="mb-8">
            <h2 className="font-schoolbell text-4xl font-bold mb-2 leading-tight text-white drop-shadow-lg">
              {track.title}
            </h2>
            <p className="text-lg text-white/70 font-medium">{track.author}</p>
            <p className="font-poppins text-lg text-white/70 font-medium">
              {track.category}
            </p>
          </div>

          {/* Barre de lecture */}
          <div className="mb-8 group relative">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime || 0}
              onChange={onSeek}
              className="absolute w-full h-6 opacity-0 cursor-pointer z-50 -top-2"
            />
            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-white/60 mt-2 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* --- CONTRÔLES --- */}
          <div className="flex justify-between items-center">
            {/* BOUTON LOOP */}
            <button
              onClick={toggleLoop}
              className={`transition-colors ${
                isLooping ? "text-[#FFEF63]" : "text-white/40 hover:text-white"
              }`}
            >
              <Repeat size={24} />
              {isLooping && (
                <div className="mx-auto w-1 h-1 bg-[#FFEF63] rounded-full mt-1" />
              )}
            </button>

            {/* PREV */}
            <button
              onClick={onPrev}
              className="text-white/80 hover:text-white transition-colors"
            >
              <SkipBack size={32} fill="currentColor" />
            </button>

            {/* PLAY / PAUSE */}
            <button
              onClick={onPlayPause}
              className="w-20 h-20 bg-white text-[#2CADA4] rounded-full flex items-center justify-center shadow-2xl transform active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1" />
              )}
            </button>

            {/* NEXT */}
            <button
              onClick={onNext}
              className="text-white/80 hover:text-white transition-colors"
            >
              <SkipForward size={32} fill="currentColor" />
            </button>

            <div className="w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
