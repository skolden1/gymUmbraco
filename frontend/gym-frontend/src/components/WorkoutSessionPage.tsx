import { useNavigate, useParams } from "react-router-dom";
import { fetchGymProgramDetail } from "../services/gymProgramService";
import { useEffect, useState } from "react";
import type { GymProgramDetail } from "../types/gymProgramTypes";
import { useAuth } from "../contexts/AuthContext";
import "../components/WorkoutSessionPage.css"

const WorkoutSessionPage = () => {

  const {programId, workoutId} = useParams<{programId: string, workoutId: string}>();
  const navigate = useNavigate()

  const { logout } = useAuth()
  const [gymProgram, setGymProgram] = useState<GymProgramDetail | null>(null);

  useEffect(() => {
    const getProgram = async () => {
      try {
      const data: GymProgramDetail = await fetchGymProgramDetail(Number(programId));
      setGymProgram(data);
      console.log(data)
    } catch (error) {
      if ((error as Error).message === "UNAUTHORIZED") {
        logout();
        navigate("/login");
        return;
      }
      alert((error as Error).message);
    }
    }
    getProgram()
  }, [programId, logout, navigate])
  

  const handleSaveSet = (formData: FormData) => {
    const exerciseId = Number(formData.get("exerciseId"));

    const setNumber = Number(formData.get("setNumber"));

    const reps = Number(formData.get("reps"));

    const weight = Number(formData.get("weight"));
    
    console.log("Handlefunktion output: ", exerciseId, setNumber, reps, weight)
  }
  
  const renderWorkout = gymProgram?.workouts.find(w => w.id === Number(workoutId))
  console.log("Passet:", renderWorkout)

  const renderExercises = renderWorkout?.exercises.map(e => {

    const sets = [];

    for(let i = 1; i <= e.set; i++){
    sets.push(
    <div key={i}className="setRow">
      <span className="setLabel">Set #{i}</span>
      <form action={handleSaveSet}>
        <input type="hidden" name="exerciseId" value={e.id}/>
        <input type="hidden"name="setNumber" value={i}/>
        <input type="number"placeholder="Vikt" name="weight" required/>
        <input type="number" name="reps" placeholder="Reps" required/>
        <button type="submit" className="setSaveBtn">Spara</button>
      </form>
    </div>
    )
  }

    return <div key={e.id} className="currentWorkoutCard">
      <h4>{e.exerciseName}</h4>
      <p className="workoutPlan">Plan:{e.set} x {e.rep}</p>
      {sets}
    </div>
  })

 return (
<>
  <div className="workoutSessionContainer">

    <h1 className="workoutSessionTitle">Aktivt pass:{renderWorkout?.workoutName}</h1>

    <p className="workoutSessionSubTitle">Fyll i dagens resultat</p>
    {renderExercises}
  </div>
</>
)
}
export default WorkoutSessionPage