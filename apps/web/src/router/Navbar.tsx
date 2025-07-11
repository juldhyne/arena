import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/signin">Signin</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/characters">Characters</Link>
        <Link to="/teams">Teams</Link>
      </div>
    </div>
  );
};

export default Navbar;
