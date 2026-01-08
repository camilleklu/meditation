import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Publications from "./pages/Publications.jsx";
import Audio from "./pages/Audio.jsx";
import Ateliers from "./pages/Ateliers.jsx";
import AtelierDetail from "./pages/AtelierDetail.jsx";
import Inscription from "./pages/Inscription.jsx";
import Navbar from "./components/Navbar.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import "./App.css";

function App() {
  return (
    <>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/publications/:id" element={<ArticleDetail />} />
        <Route path="/audios" element={<Audio />} />
        <Route path="/ateliers" element={<Ateliers />} />
        <Route path="/ateliers/:id" element={<AtelierDetail />} />
        <Route path="/ateliers/:id/inscription" element={<Inscription />} />
        
      </Routes>
      <Navbar />
    </>
  );
}

export default App;
