import React from "react";
import { Play } from "lucide-react";

const AudioCardHome = ({ audio, onClick }) => {
  return (
    <div
      onClick={() => onClick(audio)}
      className="bg-white p-3 rounded-[25px] flex items-center justify-between shadow-sm cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0">
          <img
            src={audio.img}
            alt={audio.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="font-poppins font-bold text-gray-800 text-sm">
            {audio.title}
          </h4>
          <p className="text-gray-400 text-xs">{audio.duration}</p>
        </div>
      </div>
      <div className="w-10 h-10 bg-[#E8F4F4] rounded-full flex items-center justify-center text-[#2CADA4]">
        <Play size={18} fill="#2CADA4" />
      </div>
    </div>
  );
};

export default AudioCardHome;
