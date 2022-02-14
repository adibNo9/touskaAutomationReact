import React, { Suspense } from "react";

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/header/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const Login = React.lazy(() => import("./components/auth/Login"));
const Register = React.lazy(() => import("./components/auth/Register"));
const Dashboard = React.lazy(() => import("./components/dashboard/Dashboard"));

function App() {
  const token = localStorage.getItem("token");
  console.log("token", token === undefined);
  return (
    <Router>
      <Layout>
        <Suspense
          fallback={
            <div className="spinner">
              <LoadingSpinner />
            </div>
          }
        >
          <Switch>
            <Route path="/" exact>
              <Redirect to="/dashboard" />
            </Route>
            <Route path="/register">
              {!token ? <Register /> : <Dashboard />}
            </Route>
            <Route path="/login">{!token ? <Login /> : <Dashboard />}</Route>

            <Route path="/dashboard">
              {!token ? <Login /> : <Dashboard />}
            </Route>
          </Switch>
        </Suspense>
      </Layout>
      <h2>token: {token}</h2>
    </Router>
  );
}

export default App;
