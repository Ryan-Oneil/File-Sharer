import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NotFound from "../pages/NotFound";
import "../assets/css/layout.css";
import DashboardRouting from "../pages/Dashboard/DashboardRouting";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Auth/Login";
import SharedLinkPage from "../pages/FileShare/SharedLinkPage";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";
import PublicRoute from "./PublicRoute";
import Home from "../pages/Home";

class ClientApp extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <PublicRoute path="/login">
            <Route exact path="/login" component={Login} />
          </PublicRoute>
          <PublicRoute path="/register">
            <Route exact path="/register" component={Register} />
          </PublicRoute>
          <PublicRoute path="/resetPassword">
            <Route exact path="/resetPassword" component={ResetPassword} />
          </PublicRoute>
          <Route path="/shared/:id" component={SharedLinkPage} />
          <PrivateRoute path="/dashboard">
            <Route path="/dashboard" component={DashboardRouting} />
          </PrivateRoute>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
export default ClientApp;
