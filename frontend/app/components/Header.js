import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import stateContext from "../contexts/stateContext";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

function Header() {
  const state = useContext(stateContext);
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp
          </Link>
        </h4>
        {state.isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      </div>
    </header>
  );
}

export default Header;
