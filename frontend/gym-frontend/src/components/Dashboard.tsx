import { Link } from "react-router-dom"
import "./Dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboardContainer">
      <h1>Välj ett alternativ</h1>
      <Link to="/CreateProgram" className="createProgramBtn">Skapa program</Link>
    </div>
  )
}
export default Dashboard