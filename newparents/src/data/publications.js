export const articleList = [
  {
    id: 1,
    title: "Le sommeil de bébé",
    category: "Conseils",
    author: "Marie Martin",
    date: "Aujourd'hui, 10:30",
    excerpt: "Comment instaurer une routine de sommeil efficace dès les premières semaines...",
    content: "Le texte long complet de l'article sur le sommeil de bébé ira ici...",
    img: "https://i.pinimg.com/236x/d1/4b/c1/d14bc15248dd54711f9ceb5c023c4231.jpg"
  },
  {
    id: 2,
    title: "L'alimentation diversifiée",
    category: "Nutrition",
    author: "Dr. Jean Dupont",
    date: "Hier, 15:45",
    excerpt: "Les étapes clés pour introduire les morceaux en toute sécurité...",
    content: "Le texte long complet sur la nutrition...",
    img: "https://i.pinimg.com/474x/0e/41/e9/0e41e958f75299010e00e7adf796bcaf.jpg"
  },
  {
    id: 3,
    title: "Activités d'éveil à la maison",
    category: "Éveil",
    author: "Sophie Lucas",
    date: "2 Janv. 2026",
    excerpt: "5 jeux simples à fabriquer soi-même pour stimuler la motricité fine...",
    content: "Le texte long complet sur l'éveil...",
    img: "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/Bildschirmfoto_2024-03-27_um_11.01.34_168b9ee3-e724-41d4-b1ca-b67edc3787ff.png?v=1711533764"
  }
];

export const getLatestArticles = () => [...articleList].reverse().slice(0, 3);