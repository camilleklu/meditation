import React, { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from "../config"; // On importe l'URL de ton backend

const WorkshopContext = createContext();

export const WorkshopProvider = ({ children }) => {
  // 1. État initial vide (on attend les données du serveur)
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fonction pour charger les ateliers depuis Laravel
  const fetchWorkshops = () => {
    fetch(`${API_URL}/workshops`)
      .then((res) => res.json())
      .then((data) => {
        setWorkshops(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement ateliers:", err);
        setLoading(false);
      });
  };

  // 3. Au chargement de l'application, on appelle l'API
  useEffect(() => {
    fetchWorkshops();
  }, []);

  // 4. Fonction pour trouver un atelier spécifique dans la liste chargée
  const getWorkshop = (id) => {
    return workshops.find((w) => w.id === parseInt(id));
  };

  // 5. Action après inscription
  // Note : L'inscription réelle (POST) se fait dans le composant Inscription.jsx.
  // Ici, cette fonction sert juste à dire : "Hey, une place a été prise, recharge la liste !"
  const registerForWorkshop = () => {
    fetchWorkshops();
  };

  return (
    <WorkshopContext.Provider
      value={{ workshops, loading, registerForWorkshop, getWorkshop }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export const useWorkshops = () => useContext(WorkshopContext);
