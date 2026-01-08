import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";

const AtelierCard = ({ workshop, className = "" }) => {
  if (!workshop) return null;

  // --- FONCTIONS DE FORMATAGE (Pour que ce soit joli) ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    // On coupe les secondes (14:00:00 -> 14:00)
    return timeString.slice(0, 5);
  };

  return (
    <div
      className={`bg-white rounded-[30px] shadow-lg flex flex-col overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* --- IMAGE --- */}
      <div className="w-full h-40 relative shrink-0 bg-gray-100">
        {/* CORRECTION ICI : On utilise 'workshop.img' (Backend) au lieu de 'workshop.image' */}
        {workshop.img ? (
          <img
            src={workshop.img}
            alt={workshop.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          /* Fallback : Si pas d'image, on met une couleur par défaut */
          <div className="w-full h-full bg-[#75BDBC] opacity-80" />
        )}

        {/* Badge Places */}
        {workshop.spots !== undefined && (
          <div
            className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold shadow-sm bg-white/95 
            ${workshop.spots === 0 ? "text-red-500" : "text-[#FFB041]"}`}
          >
            {workshop.spots === 0 ? "Complet" : `${workshop.spots} places`}
          </div>
        )}
      </div>

      {/* --- CONTENU TEXTE --- */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-schoolbell text-2xl font-bold text-gray-800 mb-2 line-clamp-1">
          {workshop.title}
        </h3>

        <p className="font-poppins text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
          {workshop.description}
        </p>

        {/* Infos avec formatage */}
        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#2CADA4]" />
            <span className="font-poppins">{formatDate(workshop.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#2CADA4]" />
            <span className="font-poppins">{formatTime(workshop.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#2CADA4]" />
            <span className="font-poppins truncate">{workshop.location}</span>
          </div>
        </div>

        {/* Bouton */}
        <Link
          to={`/ateliers/${workshop.id}`}
          className="font-poppins w-full bg-[#F7AB42] text-gray-900 font-bold py-3 rounded-full text-center hover:bg-[#ffaa30] transition-colors shadow-md"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
};

export default AtelierCard;
