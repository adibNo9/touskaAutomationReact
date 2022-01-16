import Header from "./components/header/Header";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/aaa" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
