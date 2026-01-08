import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
// On supprime l'import de "../data/audios"
import { API_URL } from "../config"; // On importe la config API
import PlayerModal from "../components/PlayerModal";
import AudioCard from "../components/AudioCard";

const Audio = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("Tout");

  // --- 1. NOUVEAU : ÉTATS POUR LES DONNÉES ---
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // États Audio
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // États UI
  const [centerIndex, setCenterIndex] = useState(0);
  const scrollRef = useRef(null);
  const audioRef = useRef(null);
  const fadeInterval = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

  const categories = ["Tout", "Podcast", "Ambiances", "Histoires", "Autre"];

  // --- 2. CHARGEMENT DES DONNÉES (API) ---
  useEffect(() => {
    fetch(`${API_URL}/audios`)
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement audio:", err);
        setLoading(false);
      });
  }, []);

  // --- LOGIQUE DE TRI ---
  // On prend les 5 premiers comme "Populaires" (tu pourras affiner côté backend plus tard)
  const popularTracks = tracks.slice(0, 5);

  const filteredTracks =
    activeCategory === "Tout"
      ? tracks
      : tracks.filter((track) => track.category === activeCategory);

  // --- LOGIQUE DE FADE (FONDU) ---
  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeInterval.current) clearInterval(fadeInterval.current);
    audio.volume = 0;

    // Petite sécurité pour éviter l'erreur "play() interrupted"
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => console.log("Playback prevented:", error));
    }

    fadeInterval.current = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(audio.volume + 0.05, 1);
      } else {
        clearInterval(fadeInterval.current);
      }
    }, 50);
  };

  const fadeOut = (callback) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeInterval.current) clearInterval(fadeInterval.current);
    fadeInterval.current = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(audio.volume - 0.05, 0);
      } else {
        clearInterval(fadeInterval.current);
        audio.pause();
        audio.volume = 1;
        if (callback) callback();
      }
    }, 50);
  };

  // --- EFFETS (Auto-play & Nettoyage) ---
  useEffect(() => {
    // On attend que les tracks soient chargées avant de lancer l'autoplay
    if (!loading && tracks.length > 0 && location.state?.autoPlayTrack) {
      const trackIdToPlay = location.state.autoPlayTrack.id;
      // On cherche le track correspondant dans les données fraîches du backend
      const trackToPlay = tracks.find((t) => t.id === trackIdToPlay);

      if (trackToPlay) {
        setCurrentTrack(trackToPlay);
        setIsPlaying(true);
        setIsModalOpen(true);
        // Nettoyage de l'historique pour ne pas relancer au refresh
        window.history.replaceState({}, document.title);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (fadeInterval.current) clearInterval(fadeInterval.current);
    };
  }, [location, loading, tracks]); // Ajout de 'tracks' et 'loading' aux dépendances

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.volume = 1;

      if (isPlaying) {
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Lecture bloquée, interaction requise:", error);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrack]);
  // --- GESTIONNAIRES D'ÉVÉNEMENTS ---
  const handleTrackClick = (track) => {
    if (currentTrack?.id === track.id) {
      setIsModalOpen(true);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsModalOpen(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      fadeOut();
      setIsPlaying(false);
    } else {
      fadeIn();
      setIsPlaying(true);
    }
  };

  const changeTrack = (direction) => {
    if (!currentTrack || tracks.length === 0) return; // Sécurité

    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % tracks.length;
    } else {
      newIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }

    setCurrentTrack(tracks[newIndex]);
    setIsPlaying(true);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      // Ajustement sensibilité scroll (180px carte + gap)
      setCenterIndex(Math.round(scrollRef.current.scrollLeft / 196));
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // --- RENDU ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3E7] flex items-center justify-center p-10">
        Chargement de votre bibliothèque...
      </div>
    );
  }

  return (
    <div className="pb-32 px-0 min-h-screen relative bg-[#F6F3E7]">
      {/* IMPORTANT : 
          1. src={...} directement ici pour que React le mette à jour instantanément
          2. crossOrigin="anonymous" pour que le Waveform (AudioCard) puisse analyser le son sans erreur CORS 
      */}
      <audio
        ref={audioRef}
        src={currentTrack ? currentTrack.src : undefined}
        crossOrigin="anonymous"
        onEnded={() => !isLooping && setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        loop={isLooping}
        preload="auto"
      />

      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={() => changeTrack("next")}
        onPrev={() => changeTrack("prev")}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        isLooping={isLooping}
        toggleLoop={() => setIsLooping(!isLooping)}
      />

      {/* Header Orange Déco */}
      <div className="w-full h-6 bg-[#F7AB42] mb-4" />

      <div className="px-6 my-8">
        <h1 className="font-schoolbell text-4xl font-bold text-gray-800">
          Audios
        </h1>
      </div>

      {/* Filtres Catégories */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-4 px-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-poppins px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap text-gray-800
              ${
                activeCategory === cat
                  ? "bg-[#FFD406] shadow-md scale-105"
                  : "bg-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Carrousel Populaire */}
      {popularTracks.length > 0 && (
        <div className="mb-8 mt-2">
          <h2 className="font-schoolbell text-2xl font-semibold text-black mb-8 px-6">
            Populaire
          </h2>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-8 pt-4 no-scrollbar snap-x snap-mandatory"
            style={{
              paddingLeft: "calc(50% - 90px)",
              paddingRight: "calc(50% - 90px)",
            }}
          >
            {popularTracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handleTrackClick(track)}
                className={`snap-center shrink-0 w-[180px] h-[220px] rounded-[30px] relative p-4 flex flex-col justify-end shadow-sm cursor-pointer transition-all duration-300 overflow-hidden 
                    ${
                      index === centerIndex
                        ? "scale-110 z-10 shadow-xl bg-[#75BDBC]"
                        : "scale-90 opacity-90 bg-[#90D6DD]"
                    }`}
              >
                {track.img && (
                  <>
                    <img
                      src={track.img}
                      alt={track.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </>
                )}
                <div
                  className={`relative z-10 transition-opacity ${
                    index === centerIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h3 className="font-poppins font-bold text-white leading-tight drop-shadow-md">
                    {track.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des Sons avec AudioCard */}
      <div className="px-6">
        <h2 className="font-schoolbell text-2xl font-semibold text-black mb-8">
          Sons
        </h2>

        {filteredTracks.length === 0 ? (
          <p className="text-gray-500 italic">Aucun son trouvé.</p>
        ) : (
          <div className="space-y-4">
            {filteredTracks.map((track) => (
              <AudioCard
                key={track.id}
                track={track}
                isPlaying={isPlaying}
                isCurrentTrack={currentTrack?.id === track.id}
                onClick={handleTrackClick}
                audioRef={audioRef}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Audio;
