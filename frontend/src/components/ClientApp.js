import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NotFound from "../pages/NotFound";
import "../assets/css/layout.css";
import DashboardRouting from "../pages/Dashboard/DashboardRouting";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";

class ClientApp extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
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
