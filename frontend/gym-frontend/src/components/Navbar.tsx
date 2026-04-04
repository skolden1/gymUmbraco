import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";


const Navbar = () => {

  const {logout, user} = useAuth(); 

  return (
    <div>
      <header>
        <nav>
          <ul>
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