import type React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-900 text-neutral-100">
        <Routes>
            <Route path="*" element={<Navigate to="/" replace/>} />

        </Routes>

      </div>
    </BrowserRouter>
  );


};

export default App;