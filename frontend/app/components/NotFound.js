import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Page title="Not Found">
      <div>
        <h2 className="text-centered">Whoops we cannot find the page</h2>
        <p className="lead text-muted">
          You can always visit <Link to={"/"}>Homepage</Link> to get a fresh
          start
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
