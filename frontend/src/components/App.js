import React from "react";

import ClientApp from "./ClientApp";
import { connect } from "react-redux";
import ErrorModal from "./ErrorModal";

class App extends React.Component {
  render() {
    const { error } = this.props.globalErrors;

    console.log(error);
    return (
      <>
        <ClientApp />
        {error && ErrorModal(error)}
      </>
    );
  }
}
const mapStateToProps = state => {
  return { globalErrors: state.globalErrors };
};
export default connect(mapStateToProps)(App);
