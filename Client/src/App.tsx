import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { DetectionPage } from "./pages/DetectionPage";
import { SibiInfoPage } from "./pages/SibiInfoPage";
import { QuizPage } from "./pages/QuizPage";
 
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/detect" element={<DetectionPage />} />
            <Route path="/sibi-info" element={<SibiInfoPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="*" element={<Navigate to="/sibi-info" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}