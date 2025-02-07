import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignForm from "./screens/SignForm.jsx";
import Dashboard from "./screens/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign" element={<SignForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
