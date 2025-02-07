import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignForm from "./components/SignForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignForm />} />
      </Routes>
    </Router>
  );
}

export default App;
