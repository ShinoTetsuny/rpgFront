import { Link } from "react-router-dom";
import React from "react";
import "../styles/Nav.css"

export default function Nav() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li>
          <Link to={`/backoffice`}>BackOffice</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">Création de personnage</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/combat">Combat</Link>
        </li>
      </ul>
    </nav>
  );
}