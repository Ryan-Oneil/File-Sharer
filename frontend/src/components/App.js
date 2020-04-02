import React from "react";

import ClientApp from "./ClientApp";
import { connect } from "react-redux";
import ErrorModal from "./ErrorModal";

class App extends React.Component {
  render() {
    const { error } = this.props.globalErrors;

    return (
      <>
        <ClientApp />
        {error && <ErrorModal message={error} />}
      </>
    );
  }
}
const mapStateToProps = state => {
  return { globalErrors: state.globalErrors };
};
export default connect(mapStateToProps)(App);
