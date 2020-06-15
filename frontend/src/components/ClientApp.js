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
import ChangePassword from "../pages/Auth/ChangePassword";
import EmailConfirmation from "../pages/Auth/EmailConfirmation";
import AdminRouting from "../pages/Admin/AdminRouting";

class ClientApp extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <PublicRoute path="/login">
            <Route exact path="/login" component={Login} />
          </PublicRoute>
          <PublicRoute path="/register">
            <Route exact path="/register" component={Register} />
          </PublicRoute>
          <PublicRoute path="/confirmEmail/:token">
            <Route
              exact
              path="/confirmEmail/:token"
              component={EmailConfirmation}
            />
          </PublicRoute>
          <PublicRoute path="/resetPassword">
            <Route exact path="/resetPassword" component={ResetPassword} />
          </PublicRoute>
          <PublicRoute path="/changePassword/:token">
            <Route
              exact
              path="/changePassword/:token"
              component={ChangePassword}
            />
          </PublicRoute>
          <Route path="/shared/:id" component={SharedLinkPage} />
          <PrivateRoute path="/dashboard">
            <Route path="/dashboard" component={DashboardRouting} />
          </PrivateRoute>
          <PrivateRoute path="/admin">
            <Route path="/admin" component={AdminRouting} />
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
