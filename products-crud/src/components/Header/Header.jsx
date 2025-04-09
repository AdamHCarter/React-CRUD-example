import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-light py-0">
      <div className="container-fluid ps-0">
        <Link to="/">
          <h3>Home</h3>
        </Link>
        <Link to="/add">
          <h4>Add</h4>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportContent">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  )
}