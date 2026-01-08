import React, { useEffect, useRef, useMemo } from 'react';

// Variables globales pour maintenir le contexte entre les rendus
let audioContext = null;
let analyser = null;
let mediaSource = null;

const TrackWaveform = ({ isPlaying, audioRef, trackId, color = '#75BDBC' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // On ne lance la logique que si la piste est active et que le canvas est prêt
    if (isPlaying && audioRef.current && canvasRef.current) {
      
      const initAudio = async () => {
        try {
          if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
          }

          // TRÈS IMPORTANT : Les navigateurs bloquent souvent l'audio au démarrage.
          // On force la reprise si le contexte est en pause.
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }

          if (!analyser) {
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 128;
          }

          // Re-connexion de la source si nécessaire
          if (!mediaSource) {
            mediaSource = audioContext.createMediaElementSource(audioRef.current);
            mediaSource.connect(analyser);
            analyser.connect(audioContext.destination);
          }
        } catch (e) {
          console.log("Audio node déjà connecté ou erreur d'init :", e.message);
        }
      };

      initAudio();

      const draw = () => {
        if (!canvasRef.current || !analyser) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5; 
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          // Normalisation de la hauteur
          barHeight = (dataArray[i] / 255) * canvas.height; 

          ctx.fillStyle = color;
          // Dessin avec bords arrondis (optionnel)
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

          x += barWidth;
        }

        animationRef.current = requestAnimationFrame(draw);
      };

      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, audioRef, color, trackId]); // Ajout de trackId pour trigger le changement

  // Rendu statique si la piste ne joue pas
  const staticBars = useMemo(() => {
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 30 }).map((_, i) => 
      Math.floor(pseudoRandom(trackId * 100 + i) * 80 + 10)
    );
  }, [trackId]);

  if (isPlaying) {
    return <canvas ref={canvasRef} width={200} height={50} className="w-full h-full" />;
  }

  return (
    <div className="flex items-end gap-[2px] h-full opacity-80">
      {staticBars.map((height, i) => (
        <div 
          key={i} 
          className="w-[3px] rounded-full" 
          style={{ height: `${height}%`, backgroundColor: color }} 
        />
      ))}
    </div>
  );
};

export default TrackWaveform;