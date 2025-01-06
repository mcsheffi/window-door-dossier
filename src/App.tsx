import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const session = useSession();

  return (
    <Router>
      <Routes>
        <Route 
          path="/app" 
          element={session ? <Index /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/app" replace />} 
        />
        <Route 
          path="/" 
          element={session ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;