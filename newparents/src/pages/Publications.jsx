import React, { useState, useEffect } from "react";
import ArticleCard from "../components/ArticleCard";
import { API_URL } from "../config"; // On importe la config API

const Publications = () => {
  // 1. On remplace l'import statique par un état vide
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("Tout");
  const categories = ["Tout", "Conseils", "Nutrition", "Éveil", "Témoignages"];

  // 2. On charge les données depuis Laravel
  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement articles:", err);
        setLoading(false);
      });
  }, []);

  // 3. Filtrage sur les données reçues (API)
  const filteredArticles =
    activeCategory === "Tout"
      ? articles
      : articles.filter((art) => art.category === activeCategory);

  // 4. État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EA] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Chargement des publications...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-32 min-h-screen bg-[#F7F5EA]">
      {/* --- 1. BARRE ORANGE DU HAUT --- */}
      <div className="w-full h-6 bg-[#F7AB42] mb-4" />

      {/* --- 2. HEADER --- */}
      <div className="flex justify-between items-center px-6 my-8">
        <h1 className="font-schoolbell text-3xl font-bold text-gray-800">
          Publications
        </h1>
      </div>

      {/* --- 3. FILTRES --- */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-6 px-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-poppins px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap
              ${
                activeCategory === cat
                  ? "bg-[#FFD406] shadow-md transform scale-105 text-gray-800"
                  : "bg-[rgba(252,251,248,1)]"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- 4. LISTE DES ARTICLES --- */}
      <div className="px-6 space-y-6 ">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            Aucun article dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Publications;
