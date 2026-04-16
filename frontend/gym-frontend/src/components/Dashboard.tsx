import { Link, useNavigate } from "react-router-dom"
import "./Dashboard.css"
import { useEffect, useState } from "react"
import gymProgramDefault from "../assets/gymProgramDefault.png"
import { useAuth } from "../contexts/AuthContext"

type GymProgram = {
  id: number,
  programName: string
}

const Dashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [gymProgram, setGymProgram] = useState<GymProgram[]>([])

  useEffect(() => {
    const getGymPrograms = async () => {
    const res = await fetch("https://localhost:44388/api/GymProgram/myPrograms", {
      method: "GET",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
    })

    if(!res.ok){
      if(res.status === 401){
          logout();
          navigate("/login");
        }
      console.log("Error fetching programs")
      return
    }
    const data: GymProgram[] = await res.json()
    setGymProgram(data);
  }
  getGymPrograms();
  }, [logout, navigate])

  const renderGymPrograms = gymProgram.map(p => {
    return <div className="gymProgramCard" key={p.id}>
        <h3>{p.programName}</h3>
        <img className="gymProgramPic" src={gymProgramDefault} />
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