import { Link, useNavigate } from "react-router-dom"
import "./Dashboard.css"
import { useEffect, useState } from "react"
import gymProgramDefault from "../assets/gymProgramDefault.png"
import { useAuth } from "../contexts/AuthContext"
import type { GymProgram } from "../types/gymProgramTypes"
import { fetchGymPrograms } from "../services/gymProgramService"


const Dashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [gymProgram, setGymProgram] = useState<GymProgram[]>([])

  useEffect(() => {
    const getGymPrograms = async () => {
    try {
      const data: GymProgram[] = await fetchGymPrograms();
      setGymProgram(data);
    } catch (error) {
      if ((error as Error).message === "UNAUTHORIZED") {
        logout();
        navigate("/login");
        return;
      }
      alert((error as Error).message);
    }
  }
  getGymPrograms();
  }, [logout, navigate])

  const renderGymPrograms = gymProgram.map(p => {
    return <div className="gymProgramCard" key={p.id}>
            <h3>{p.programName}</h3>
            <Link to={`/program/${p.id}`}>
              <img className="gymProgramPic" src={gymProgramDefault} />
            </Link>
            <Link to={`/program/${p.id}`}>
              <button>Visa program</button>
            </Link>
      </div>
    
  })


  return (
    <>
      <div className="dashboardContainer">
        <h1>Skapa ditt egna gymprogram</h1>
        <Link to="/CreateProgram" className="createProgramBtn">Skapa program</Link>
        <h2>Dina Gym Program</h2>
        <div className="programContainer">
            {renderGymPrograms}
        </div>
      </div>
    </>
  )
}
export default Dashboard