import React, { useState, useRef } from "react";
import { useWorkshops } from "../context/WorkshopContext";
import AtelierCard from "../components/AtelierCard"; // Import du composant

const Ateliers = () => {
  const { workshops } = useWorkshops();
  const [centerIndex, setCenterIndex] = useState(0);
  const scrollRef = useRef(null);

  const availableWorkshops = workshops.filter((w) => w.spots > 0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollPosition = container.scrollLeft;
      // Largeur de la carte (280px) + Gap (24px) = 304px
      setCenterIndex(Math.round(scrollPosition / 304));
    }
  };

  return (
    <div className="bg-[#F6F3E7] h-screen pb-24 relative flex flex-col overflow-hidden">
      {/* HEADER */}
      <div>
        <div className="w-full h-6 bg-[#F7AB42]" />
        <div className="px-6 my-8">
          <h1 className="font-schoolbell text-4xl font-bold text-gray-800">
            Nos Ateliers
          </h1>
        </div>
      </div>

      {/* CARROUSEL */}
      <div className="flex-1 flex flex-col justify-center">
        {availableWorkshops.length > 0 ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto py-12 snap-x snap-mandatory no-scrollbar items-center"
            style={{
              paddingLeft: "calc(50% - 140px)",
              paddingRight: "calc(50% - 140px)",
            }}
          >
            {availableWorkshops.map((workshop, index) => {
              const isCenter = index === centerIndex;

              return (
                <AtelierCard
                  key={workshop.id}
                  workshop={workshop}
                  // On passe les classes CSS spécifiques au carrousel ici
                  className={`snap-center shrink-0 w-[280px] ${
                    isCenter
                      ? "scale-110 z-10 opacity-100 shadow-2xl"
                      : "scale-90 opacity-60 blur-[1px]"
                  }`}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Aucun atelier disponible.
          </div>
        )}

        {/* POINTS INDICATEURS */}
        <div className="flex justify-center gap-3 mt-4">
          {availableWorkshops.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === centerIndex ? "bg-[#75BDBC] scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ateliers;
