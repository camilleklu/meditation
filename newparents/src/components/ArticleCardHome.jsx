import React from "react";
import { Link } from "react-router-dom";

const ArticleCardHome = ({ article }) => {
  return (
    <Link
      to={`/publications/${article.id}`}
      className="block bg-white rounded-[30px] p-4 shadow-sm border border-gray-50"
    >
      <div className="flex gap-4">
        {/* Image à gauche */}
        <div className="w-24 h-24 shrink-0 rounded-[20px] overflow-hidden">
          <img
            src={article.img}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Contenu à droite */}
        <div className="flex flex-col justify-center">
          <span className="font-poppins bg-[#FFD406] text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-2">
            {article.category}
          </span>
          <h3 className="font-schoolbell font-bold text-gray-800 text-sm leading-tight mb-1">
            {article.title}
          </h3>
          <p className="font-poppins text-gray-400 text-[11px] line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCardHome;
