import ambiance1 from '../assets/ambiances/skz-chk-chk-boom.mp3'; 
import podcast1 from '../assets/podcast/kitten-skz.mp3';
import meme from '../assets/thumbnail/meme.png';

export const audioList = [
  { 
    id: 1, 
    title: "Bruit de la pluie", 
    category: "Ambiances", 
    src: ambiance1, 
    img : meme,
  },
  { 
    id: 2, 
    title: "Devenir Parent", 
    category: "Podcast", 
    src: podcast1, 
    img : meme,
  },
  { 
    id: 3, 
    title: "Devenir Parent", 
    category: "Podcast", 
    src: podcast1, 
    img : meme,
  },
  { 
    id: 4, 
    title: "Devenir Parent", 
    category: "Podcast", 
    src: podcast1, 
    img : meme,
  },
  { 
    id: 5, 
    title: "Podcast-Devenir Parent", 
    category: "Autre",
    src: podcast1, 
    img : meme,
  },
];


export const getPopularAudios = () => {
    return audioList.slice(0, 3);
};