import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useWorkshops } from "../context/WorkshopContext";
import { API_URL } from "../config"; // Import de la config API

import ArticleCardHome from "../components/ArticleCardHome";
import AudioCardHome from "../components/AudioCardHome";
import AtelierCard from "../components/AtelierCard";

const Home = () => {
  const navigate = useNavigate();

  // 1. On récupère les ateliers via le Context (qui gère déjà le fetch)
  const { workshops } = useWorkshops();

  // 2. On crée des états pour les Articles et les Audios
  const [articles, setArticles] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. On charge les données API au démarrage
  useEffect(() => {
    // On utilise Promise.all pour charger les deux en même temps proprement
    Promise.all([
      fetch(`${API_URL}/articles`).then((res) => res.json()),
      fetch(`${API_URL}/audios`).then((res) => res.json()),
    ])
      .then(([articlesData, audiosData]) => {
        setArticles(articlesData);
        setAudios(audiosData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement Home:", err);
        setLoading(false);
      });
  }, []);

  // 4. On prépare les données à afficher (Les 2 plus récents)
  // Note : Idéalement, ton API devrait renvoyer les données triées par date (orderBy desc)
  // Sinon, on prend juste les deux premiers de la liste.
  const recentArticles = articles.slice(0, 2);
  const recentAudios = audios.slice(0, 2);

  // Pour les ateliers, on filtre ceux qui ont des places (optionnel) et on en prend 2
  const featuredWorkshops = workshops
    .filter((w) => w.spots > 0) // On affiche en priorité ceux où il reste de la place
    .slice(0, 2);

  // Redirige vers /audios en passant l'objet audio
  const handleAudioClick = (audio) => {
    navigate("/audios", { state: { autoPlayTrack: audio } });
  };

  if (loading) {
    return (
      <div className="bg-[#F7F5EA] min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Chargement de l'accueil...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EA] min-h-screen pb-32">
      <div className="bg-[#F7AB42] rounded-b-[50px] px-6 pt-8 pb-10 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div>
            <p className="font-schoolbell text-white/80 text-2xl font-medium">
              Bonjour,
            </p>
            <h1 className="font-schoolbell text-gray-800 text-4xl font-bold">
              Comment allez-vous ?
            </h1>
          </div>
        </div>

        <div className="bg-[#FFD406] rounded-[40px] p-8 shadow-inner relative overflow-hidden">
          <h2 className="font-schoolbell text-gray-800 text-2xl font-black mb-3">
            Conseil du jour
          </h2>
          <p className="font-poppins text-gray-700 font-medium leading-relaxed mb-6">
            Prenez 5 minutes pour respirer profondément. Vous le méritez.
          </p>
          <Link
            to="/audios"
            className="font-poppins bg-[#2CADA4] flex items-center justify-center text-white text-center font-bold px-8 py-3 rounded-2xl shadow-md"
          >
            Commencer
          </Link>
        </div>
      </div>

      {/* --- SECTION PUBLICATIONS --- */}
      <div className="mt-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-schoolbell text-2xl font-bold text-gray-800">
            Publications
          </h2>
          <Link
            to="/publications"
            className="font-poppins text-[#2CADA4] text-sm font-bold flex items-center gap-1"
          >
            Voir tout <ChevronRight size={16} />
          </Link>
        </div>
        <div className="space-y-4">
          {recentArticles.length > 0 ? (
            recentArticles.map((art) => (
              <ArticleCardHome key={art.id} article={art} />
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              Aucune publication récente.
            </p>
          )}
        </div>
      </div>

      {/* --- SECTION AUDIOS --- */}
      <div className="mt-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-schoolbell text-2xl font-bold text-gray-800">
            Audios relaxants
          </h2>
          <Link
            to="/audios"
            className="font-poppins text-[#2CADA4] text-sm font-bold flex items-center gap-1"
          >
            Voir tout <ChevronRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentAudios.length > 0 ? (
            recentAudios.map((audio) => (
              <AudioCardHome
                key={audio.id}
                audio={audio}
                onClick={() => handleAudioClick(audio)}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              Aucun audio disponible.
            </p>
          )}
        </div>
      </div>

      {/* --- SECTION ATELIERS --- */}
      <div className="mt-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-schoolbell text-2xl font-bold text-gray-800">
            Nos Ateliers
          </h2>
          <Link
            to="/ateliers"
            className="font-poppins text-[#2CADA4] text-sm font-bold flex items-center gap-1"
          >
            Voir tout <ChevronRight size={16} />
          </Link>
        </div>
        <div className="space-y-6">
          {featuredWorkshops.length > 0 ? (
            featuredWorkshops.map((workshop) => (
              <AtelierCard key={workshop.id} workshop={workshop} />
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              Aucun atelier prévu prochainement.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
