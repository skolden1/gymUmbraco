import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./ProgramDetail.css"
import { FaEdit } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import type { GymProgramDetail } from "../types/gymProgramTypes"
import { fetchGymProgramDetail } from "../services/gymProgramService"



const ProgramDetail = () => {
  const { logout } = useAuth()

  const navigate = useNavigate()
  const { id } = useParams<{ id: string}>()
  const [gymProgram, setGymProgram] = useState<GymProgramDetail | null>(null);

  useEffect(() => {
    const getGymProgramDetail = async () => {
      try {
        const data: GymProgramDetail = await fetchGymProgramDetail(Number(id));
        console.log(data);
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
    getGymProgramDetail()
  }, [id, logout, navigate])

  if(!gymProgram) return <p>Loading...</p>

  return (
    <>
      <h1>Programdetaljer</h1>
      <div className="programWrapper">
        <h2 className="programTitle">{gymProgram.programName}</h2>
        <div className="progDetailRow">
          <p>Redigera program</p>
          <button onClick={() => navigate(`/edit-program/${gymProgram.id}`)} className="editBtn"><FaEdit className="editIkon" /></button>
        </div>
        
        {gymProgram.workouts.map(w => (
          <div className="workoutCard" key={w.id}>
            <h4 className="workoutTitle">{w.workoutName}</h4>

            <div className="exerciseList">
              {w.exercises.map(e => (
                <div className="exerciseRow" key={e.id}>
                  <span>{e.exerciseName}</span>
                  <span>{e.set} x {e.rep}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
export default ProgramDetail