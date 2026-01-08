import React from "react";
import { BarChart3 } from "lucide-react";
import TrackWaveform from "./TrackWaveform";

const AudioCard = ({ track, isPlaying, isCurrentTrack, onClick, audioRef }) => {
  return (
    <div
      onClick={() => onClick(track)}
      className={`group bg-white p-3 rounded-full flex items-center gap-4 transition-all cursor-pointer shadow-lg ${
        isCurrentTrack ? "ring-2 ring-[#2CADA4]" : ""
      }`}
    >
      {/* Icône de lecture ou indicateur visuel */}
      <div className="w-12 h-12 rounded-full bg-[#333333] flex items-center justify-center shrink-0">
        {isCurrentTrack && isPlaying ? (
          <BarChart3 size={20} className="text-white animate-pulse" />
        ) : (
          <div className="w-4 h-4 rounded-full bg-white opacity-20" />
        )}
      </div>

      {/* Titre et Waveform */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <h4 className="font-poppins font-medium text-black text-sm">
          {track.title}
        </h4>
        <div className="h-6 w-full max-w-[200px]">
          <TrackWaveform
            isPlaying={isCurrentTrack && isPlaying}
            audioRef={audioRef}
            trackId={track.id}
            color="#2CADA4"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioCard;
