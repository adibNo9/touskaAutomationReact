import Header from "./components/header/Header";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Dashboard from "./components/dashboard/Dashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import AutoContextProvider from "./store/auto-context";

function App() {
  return (
    <AutoContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/aaa" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AutoContextProvider>
  );
}

export default App;
