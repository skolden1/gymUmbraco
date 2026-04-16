import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const EditGymProgram = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Redigera gymprogram</h1>
    </div>
  )
}
export default EditGymProgram