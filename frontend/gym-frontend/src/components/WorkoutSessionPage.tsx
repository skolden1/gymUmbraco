import { useNavigate, useParams } from "react-router-dom";
import { fetchGymProgramDetail } from "../services/gymProgramService";
import { useEffect, useState } from "react";
import type { GymProgramDetail } from "../types/gymProgramTypes";
import type { PreviousWorkoutSet, SaveWorkoutSetDto, WorkoutSessionExercise } from "../types/workoutSessionTypes";
import { useAuth } from "../contexts/AuthContext";
import "../components/WorkoutSessionPage.css"

const WorkoutSessionPage = () => {

  const {programId, workoutId} = useParams<{programId: string, workoutId: string}>();
  const navigate = useNavigate()

  const { logout } = useAuth()
  const [gymProgram, setGymProgram] = useState<GymProgramDetail | null>(null);

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
    console.log("Sparat set:", data);
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
        <input type="number"placeholder="Vikt" name="weight" step="0.1" defaultValue={activeSet?.weight ? activeSet.weight : 0} />Kg
        <input type="number" name="reps" placeholder="Reps" defaultValue={activeSet?.repsDone ? activeSet.repsDone : 0} />
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

  // const deleteSessionWorkout = async () => {
  //   const res = await fetch(`https://localhost:44388/api/WorkoutSession/ `)
  // }

 return (
<>
  <div className="workoutSessionContainer">

    <h1 className="workoutSessionTitle">Aktivt pass:{renderWorkout?.workoutName}</h1>

    <p className="workoutSessionSubTitle">Fyll i dagens resultat</p>
    {renderExercises}

    <button onClick={handleSaveWorkout}>Spara och avsluta pass</button>
    {/* <button onClick={deleteSessionWorkout}>Kasta pass</button> */}
  </div>
</>
)
}
export default WorkoutSessionPage