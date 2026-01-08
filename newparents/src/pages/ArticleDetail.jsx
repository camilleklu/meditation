import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, User, ChevronLeft } from "lucide-react";
import { API_URL } from "../config"; // Import de la config API

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États pour les données
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- CHARGEMENT DE L'ARTICLE ---
  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((res) => res.json())
      .then((data) => {
        // On cherche l'article qui correspond à l'ID de l'URL
        const found = data.find((art) => art.id === parseInt(id));
        setArticle(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement article:", err);
        setLoading(false);
      });
  }, [id]);

  // --- GESTION DES ÉTATS DE CHARGEMENT ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Chargement de l'article...
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Article introuvable
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-[#FFB041] underline font-bold"
        >
          Retourner aux publications
        </button>
      </div>
    );
  }

  // Formatage de la date (ex: 2024-06-12 -> 12/06/2024)
  const formattedDate = new Date(article.date).toLocaleDateString("fr-FR");

  return (
    <div className="pb-32 min-h-screen bg-[#F7F5EA]">
      {/* --- 1. BARRE ORANGE DU HAUT --- */}
      <div className="w-full h-6 bg-[#F7AB42] mb-4" />
      {/* BOUTON RETOUR & TITRE */}
      <div className="px-4 py-4 mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/50 p-2 rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="font-schoolbell text-2xl font-bold text-gray-900">
          Publications
        </h1>
      </div>
      {/* IMAGE DE COUVERTURE */}
      <div className="w-full h-72 relative bg-gray-200">
        <img
          src={article.img}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <div className="px-6 mt-6 z-10">
        <span className="font-poppins bg-[#FFD406] text-gray-800 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
          {article.category}
        </span>

        <h1 className="font-schoolbell text-4xl font-black mt-4 text-center">
          {article.title}
        </h1>

        <div className="flex justify-around mt-6 text-sm text-gray-600 font-medium border-b border-gray-300 pb-6">
          <div className="font-poppins flex items-center gap-2">
            <User size={18} className="text-[#2CADA4]" />
            {article.author || "Admin"}
          </div>
          <div className="font-poppins flex items-center gap-2">
            <Calendar size={18} className="text-[#2CADA4]" />
            {formattedDate}
          </div>
        </div>

        <div
          className="font-poppins mt-8 leading-relaxed text-lg pb-20 space-y-4 text-justify"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
