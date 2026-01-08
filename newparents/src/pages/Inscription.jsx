import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useWorkshops } from "../context/WorkshopContext";
import { API_URL } from "../config"; // IMPORT DE LA CONFIG

const Inscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // On récupère registerForWorkshop qui sert maintenant à rafraîchir la liste globale
  const { getWorkshop, registerForWorkshop } = useWorkshops();

  const workshop = getWorkshop(id);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  // État pour savoir si on est en train d'envoyer (pour désactiver le bouton)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // On commence le chargement

    try {
      // --- 1. ENVOI AU BACKEND ---
      const response = await fetch(`${API_URL}/workshops/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // On combine Nom et Prénom pour le backend qui attend "name"
          name: `${formData.prenom} ${formData.nom}`,
          email: formData.email,
          phone: formData.telephone, // Le backend attend "phone"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- 2. SUCCÈS ---

        // On dit au Context de recharger la liste des ateliers (pour mettre à jour les places restantes)
        registerForWorkshop();

        alert(`Félicitations ${formData.prenom}, votre place est réservée !`);
        navigate("/ateliers");
      } else {
        // --- 3. ERREUR BACKEND (ex: Plus de place) ---
        alert(data.message || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur inscription:", error);
      alert("Impossible de joindre le serveur. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false); // On finit le chargement
    }
  };

  if (!workshop) return null;

  return (
    <div className="bg-[#F6F3E7] min-h-screen pb-10 relative">
      <div className="w-full h-6 bg-[#F7AB42] mb-4" />

      {/* Header Orange */}
      <div className="px-4 py-4 mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="font-schoolbell text-xl font-bold text-gray-900">
          Inscription
        </h1>
      </div>

      <div className="px-6">
        <div className="bg-[#FFFCF2] p-6 rounded-[30px] shadow-lg border border-orange-100">
          <h2 className="font-schoolbell text-2xl font-bold text-gray-900 mb-6">
            Inscription
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            pour :{" "}
            <span className="font-bold text-[#FFB041]">{workshop.title}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-poppins block text-sm font-bold text-gray-700 mb-1 ml-1">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                required
                className="w-full bg-[#F0EFE6] rounded-xl p-3 border-none shadow-inner focus:ring-2 focus:ring-[#FFB041] outline-none transition-all"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="font-poppins block text-sm font-bold text-gray-700 mb-1 ml-1">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                required
                className="w-full bg-[#F0EFE6] rounded-xl p-3 border-none shadow-inner focus:ring-2 focus:ring-[#FFB041] outline-none transition-all"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="font-poppins block text-sm font-bold text-gray-700 mb-1 ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#F0EFE6] rounded-xl p-3 border-none shadow-inner focus:ring-2 focus:ring-[#FFB041] outline-none transition-all"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="font-poppins block text-sm font-bold text-gray-700 mb-1 ml-1">
                Telephone
              </label>
              <input
                type="tel"
                name="telephone"
                required
                className="w-full bg-[#F0EFE6] rounded-xl p-3 border-none shadow-inner focus:ring-2 focus:ring-[#FFB041] outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting} // Désactivé pendant l'envoi
                className={`w-full bg-[#F7AB42] font-poppins text-gray-900 font-bold py-4 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 
                    ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
              >
                {isSubmitting
                  ? "Validation en cours..."
                  : "Confirmer l'inscription"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
