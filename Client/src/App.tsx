import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DetectionPage } from "./pages/DetectionPage";
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/detect" element={<DetectionPage />} />
        <Route path="*" element={<Navigate to="/detect" replace />} />
      </Routes>
    </BrowserRouter>
  );
}