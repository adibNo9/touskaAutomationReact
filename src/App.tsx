import Header from "./components/header/Header";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Dashboard from "./components/dashboard/Dashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import AutoContextProvider, { AutoContext } from "./store/auto-context";
import { useContext } from "react";
import Profile from "./components/dashboard/profile/Profile";
import Layout from "./components/header/Layout";

function App() {
  const token = localStorage.getItem("token");
  console.log("token", token === undefined);
  return (
    <AutoContextProvider>
      <Router>
        <Header />
        <Layout>
          <Switch>
            <Route path="/register">
              {!token ? <Register /> : <Dashboard />}
            </Route>
            <Route path="/login">{!token ? <Login /> : <Dashboard />}</Route>

            <Route path="/dashboard">
              {!token ? <Login /> : <Dashboard />}
            </Route>
          </Switch>
        </Layout>
        <h2>token: {token}</h2>
      </Router>
    </AutoContextProvider>
  );
}

export default App;
