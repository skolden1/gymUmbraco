import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { FiX, FiEdit, FiTrash2 } from "react-icons/fi"
import "./EditGymProgram.css"

//Refaktorera dessa 3 typer senare, anv exakt samma i ProgramDetail komp
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


const EditGymProgram = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string}>()

  const [gymProgram, setGymProgram] = useState<GymProgramDetail | null>(null);

  //ändra namn states
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState("")

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

    const handleEditProgramName = async () => {
      const res = await fetch(`https://localhost:44388/api/GymProgram/program/${gymProgram.id}`, {
        method: "PUT",
        headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({gymProgramName: newName})
      })
      if(res.ok){
        setGymProgram(prev => prev ? {...prev, programName: newName} : prev);
        setIsEditingName(false);
      }
    }

  return (
    <>
      <h1>Redigera gymprogram</h1>
      <div className="editProgramWrapper">
        <div className="removeProgRow">
          <p>Ta bort program</p>
          <FiTrash2 className="trashIcon"/>
        </div>
        <div className="editRowTitle">
          {isEditingName ? (
          <>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ändra namn på program"/>
            <button onClick={() => 
              {setIsEditingName(false); 
              setNewName(gymProgram.programName); }}>Ångra</button>

            <button onClick={handleEditProgramName}>Spara ändringar</button>
          </>
        ) : (
          <>
            <h2 className="editProgramTitle">{gymProgram.programName}</h2>
            <FaEdit onClick={() => {setIsEditingName(true); setNewName(gymProgram.programName)}} className="editIcon" />
          </>
        )}
        </div>
          {gymProgram.workouts.map(w => (
            <div className="editWorkoutCard" key={w.id}>
              <div className="editRow">
                <h4 className="editWorkoutTitle">{w.workoutName}</h4>
                <FaEdit className="editIcon"/>
                <FiX className="deleteExerciseBtn" />
              </div>
              <div className="editExerciseList">
                {w.exercises.map(e => (
                  <div className="editExerciseRow" key={e.id}>
                    
                    <span className="editExerciseName">{e.exerciseName}</span>
                    <div className="setRepContainer">
                      <span>{e.set} set</span>
                      <FiEdit className="smallIcon" />

                      <span>x</span>

                      <span>{e.rep} reps</span>
                      <FiEdit className="smallIcon" />
                      
                    </div>
                    <FiX className="deleteExerciseBtn" />
                  </div>
                ))}
                <button className="editAddBtn">+ Lägg till övning</button>
              </div>
            </div>
          ))}
        </div>
    </>
  )
}
export default EditGymProgram