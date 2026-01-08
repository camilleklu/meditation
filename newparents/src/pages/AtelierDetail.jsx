import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronLeft } from "lucide-react";
import { useWorkshops } from "../context/WorkshopContext";

const AtelierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkshop } = useWorkshops();

  const workshop = getWorkshop(id);

  // Sécurité si l'atelier n'existe pas ou est complet entre temps
  if (!workshop || workshop.spots === 0) {
    return (
      <div className="font-schoolbell p-10 text-center">
        Cet atelier n'est plus disponible.
      </div>
    );
  }

  return (
    <div className="bg-[#F6F3E7] min-h-screen pb-24 relative">
      <div className="w-full h-6 bg-[#F7AB42] mb-4" />

      {/* Header Orange avec retour */}
      <div className="px-4 py-4 mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/20 p-2 rounded-full"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="font-schoolbell text-2xl font-bold text-gray-900">
          Nos Ateliers
        </h1>
      </div>

      <div className="px-6 pb-24">
        {/* Titre */}
        <h2 className="font-schoolbell text-3xl font-bold text-gray-900 mb-4">
          {workshop.title}
        </h2>

        {/* Description */}
        <p className="font-poppins text-gray-600 mb-6 leading-relaxed">
          {workshop.description}
          <br />
        </p>

        {/* Bloc Informations */}
        <div className="mb-6">
          <h3 className="font-schoolbell font-bold text-xl mb-3">
            Informations
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="#2CADA4" />
              <span className="font-poppins">{workshop.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="#2CADA4" />
              <span className="font-poppins">{workshop.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="#2CADA4" />
              <span className="font-poppins">{workshop.location}</span>
            </div>
          </div>
        </div>

        {/* --- GOOGLE MAP DYNAMIQUE --- */}
        <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden mb-8 shadow-inner relative z-0">
          <iframe
            title="map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              workshop.location
            )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        </div>

        {/* Bouton S'inscrire */}
        <Link
          to={`/ateliers/${id}/inscription`}
          className="font-poppins block w-full bg-[#F7AB42] text-gray-900 font-bold py-4 rounded-full text-center shadow-lg hover:shadow-xl transition-all"
        >
          S'inscrire à l'atelier
        </Link>
        <p className="font-poppins text-center text-sm text-gray-500 mt-2">
          Plus que {workshop.spots} places disponibles !
        </p>
      </div>
    </div>
  );
};

export default AtelierDetail;
