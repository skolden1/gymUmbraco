import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./ProgramDetail.css"
import { FaEdit } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"

//Refaktorera dessa 3 typer senare, anv exakt samma i editgymprog komp
type ExerciseDetail = {
  id: number,
  exerciseId: number,
  exerciseName: string,
  set: number,
  rep: number
}

type Workout = {
  id: number,
  workoutName: string,
  exercises: ExerciseDetail[]
}

type GymProgramDetail = {
  id: number,
  programName: string,
  workouts: Workout[]
}

const ProgramDetail = () => {
  const { logout } = useAuth()

  const navigate = useNavigate()
  const { id } = useParams<{ id: string}>()
  const [gymProgram, setGymProgram] = useState<GymProgramDetail | null>(null);

  useEffect(() => {
    const fetchGymProgramDetail = async () => {
      const res = await fetch(`https://localhost:44388/api/GymProgram/${id}`, {
        method: "GET",
        headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
      })

      if(!res.ok){
        //om token rinner ut så navigeras man till login
        if(res.status === 401){
          logout();
          navigate("/login");
        }
        const text = await res.text();
        console.log("Error", text);
        return
      }
      const data: GymProgramDetail = await res.json()
      console.log(data)
      setGymProgram(data)
    }
    fetchGymProgramDetail()
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