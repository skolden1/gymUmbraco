import { useNavigate, useParams } from "react-router-dom";
import { fetchGymProgramDetail } from "../services/gymProgramService";
import { useEffect, useState } from "react";
import type { GymProgramDetail } from "../types/gymProgramTypes";
import type { PreviousWorkoutSet, SaveWorkoutSetDto, WorkoutSessionExercise } from "../types/workoutSessionTypes";
import { useAuth } from "../contexts/AuthContext";
import "../components/WorkoutSessionPage.css"
import { FaCheckCircle } from "react-icons/fa";

const WorkoutSessionPage = () => {

  const {programId, workoutId} = useParams<{programId: string, workoutId: string}>();
  const navigate = useNavigate()

  const { logout } = useAuth()
  const [gymProgram, setGymProgram] = useState<GymProgramDetail | null>(null);

  //modal som visas i några sek att anv har sparat
  const [savedSet, setSavedSet] = useState<string | null>(null);

  //Hämta senaste aktiva passet (som inte är avslutat (set detaljer))
  const [latestSession, setLatestSession] = useState<PreviousWorkoutSet[]>([]);

  const getLatestSession = async () => {
      const res = await fetch(`https://localhost:44388/api/WorkoutSession/active-session/${workoutId}`,{
        method: "GET",
        headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      
      if(!res.ok) return;
      const data: PreviousWorkoutSet[] = await res.json();
      setLatestSession(data);
      console.log("setlatestSession datan:", data)
    }

  useEffect(() => {
    
    getLatestSession();
  }, [workoutId])

  
  //refaktorera handleSaveSet logiken till en service fil med fetch.

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
  

  const handleSaveSet = async (formData: FormData) => {
    const exerciseId = Number(formData.get("exerciseId"));
    const setNumber = Number(formData.get("setNumber"));
    const repsDone = Number(formData.get("reps"));
    const weight = Number(formData.get("weight"));

    const dto: SaveWorkoutSetDto =  {
      workoutId: Number(workoutId),
      exerciseId,
      setNumber,
      repsDone,
      weight
    }
    
    console.log("Handlefunktion output: ", exerciseId, setNumber, repsDone, weight)

    const res = await fetch(`https://localhost:44388/api/WorkoutSession/save-set`, {
      method: "POST",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify(dto)
    })

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data: WorkoutSessionExercise = await res.json();
    const key = `${exerciseId}-${setNumber}`;
    setSavedSet(key);

    setTimeout(() => {
      setSavedSet(null);
    }, 4000);

    await getLatestSession();
  }
  
  const renderWorkout = gymProgram?.workouts.find(w => w.id === Number(workoutId));

  console.log("Passet:", renderWorkout)

  const renderExercises = renderWorkout?.exercises.map(e => {

  const sets = [];

  for(let i = 1; i <= e.set; i++){

    const activeSet = latestSession.find(s => s.exerciseId === e.exerciseId && s.setNumber === i);

    sets.push(
    <div key={i}className="setRow">
      <span className="setLabel">Set #{i}</span>
      <form action={handleSaveSet} key={`${e.exerciseId}-${i}-${activeSet?.weight}-${activeSet?.repsDone}`}>
        <input type="hidden" name="exerciseId" value={e.exerciseId}/>
        <input type="hidden"name="setNumber" value={i}/>
        <div className="inputGroup">
          <label>Vikt (KG)</label>
          <input type="number"placeholder="Vikt" name="weight" step="0.1" defaultValue={activeSet?.weight ? activeSet.weight : 0} />
        </div>
        <div className="inputGroup">
          <label>Reps</label>
          <input type="number" name="reps" placeholder="Reps" defaultValue={activeSet?.repsDone ? activeSet.repsDone : 0} />
        </div>
        <button type="submit" className="setSaveBtn">{activeSet ? "Uppdatera" : "Spara"}</button>
        {
          savedSet === `${e.exerciseId}-${i}` &&
          <span className="savedIndicator">
            <FaCheckCircle /> Sparat
          </span>
        }
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

  const handleSaveWorkout = async () => {
    const res = await fetch(`https://localhost:44388/api/WorkoutSession/complete-session/${workoutId}`, {
      method: "PUT",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
    })
    if(!res.ok) return;
    alert("Passet är sparat & avslutat");
    navigate("/dashboard");
  }

  //todo fixa så att man kan kasta / radera passet, fixa endpoint i c# 

  const deleteSessionWorkout = async () => {
    const res = await fetch(`https://localhost:44388/api/WorkoutSession/cancel-session/${workoutId}`, {
      method: "DELETE",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
    })

    if(!res.ok) return;
    alert("Passet är kastat");
    navigate("/dashboard");
  }

 return (
<>
  <div className="workoutSessionContainer">

    <h1 className="workoutSessionTitle">Aktivt pass:{renderWorkout?.workoutName}</h1>

    <p className="workoutSessionSubTitle">Fyll i dagens resultat</p>
    {renderExercises}

    <div className="workoutActions">
      <button className="completeBtn" onClick={handleSaveWorkout}>Spara och avsluta pass</button>
      <button className="cancelBtn" onClick={deleteSessionWorkout}>Avbryt aktivt pass</button>
  </div>

  </div>
</>
)
}
export default WorkoutSessionPage