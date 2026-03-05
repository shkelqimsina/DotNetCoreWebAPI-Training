import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import UserRoleBar from "./components/UserRoleBar";
import SignForm from "./screens/SignForm";
import Teacher from "./screens/Teacher";
import TeacherAdd from "./screens/TeacherAdd";
import TeacherEdit from "./screens/TeacherEdit";
import Class from "./screens/Class";
import ClassAdd from "./screens/ClassAdd";
import Student from "./screens/Student";
import StudentAdd from "./screens/StudentAdd";
import Missings from "./screens/Missings";
import MissingAdd from "./screens/MissingAdd";
import Settings from "./screens/Settings";

function App() {
  return (
    <Router>
      <UserRoleBar />
      <Routes>
        <Route path="/" element={<SignForm />} />
        <Route path="/dashboard" element={<SignForm />} />
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher-add" element={<TeacherAdd />} />
        <Route path="/teacher-edit/:id" element={<TeacherEdit />} />
        <Route path="/class" element={<Class />} />
        <Route path="/class-add" element={<ClassAdd />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student-add" element={<StudentAdd />} />
        <Route path="/missings" element={<Missings />} />
        <Route path="/missings-add" element={<MissingAdd />} />
        <Route path="/settings" element={<Settings />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
