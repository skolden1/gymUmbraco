import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiMenu, FiX  } from "react-icons/fi";
import "./Navbar.css";
import { useState } from "react";


const Navbar = () => {

  const {logout, user} = useAuth(); 

  const [toggle, setToggle] = useState(false);

  const toggleMenu = () => {
    setToggle(prev => !prev)
    console.log("toggled")
  }

  return (
    <div>
      <header>
        <nav>
          
          {toggle ? <FiX onClick={toggleMenu} className="burgerCrossIcon"/> : <FiMenu onClick={toggleMenu} className="burgerIcon" />}
            <ul className={toggle ? "activeMenu" : ""}>
              <div className="navLeft">
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/createProgram">Skapa program</Link>
                </li>
              </div>

              <li className="row">
                Välkommen {user?.email}
                <button className="logoutBtn" onClick={logout}>Logga ut</button>
              </li>
            </ul> 
        </nav>
      </header>
    </div>
  )
}
export default Navbar