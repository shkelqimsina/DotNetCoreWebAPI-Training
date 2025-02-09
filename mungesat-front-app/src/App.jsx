import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignForm from "./screens/SignForm";
import Dashboard from "./screens/Dashboard";
import Teacher from "./screens/Teacher";
import TeacherAdd from "./screens/TeacherAdd";
import Class from "./screens/Class";
import Student from "./screens/Student";
import StudentAdd from "./screens/StudentAdd";
import Missings from "./screens/Missings";
import Profile from "./screens/Profile";
import Settings from "./screens/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher-add" element={<TeacherAdd />} />
        <Route path="/class" element={<Class />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student-add" element={<StudentAdd />} />
        <Route path="/missings" element={<Missings />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
