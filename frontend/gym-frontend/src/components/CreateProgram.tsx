
import { useEffect, useState } from "react";
import "./CreateProgram.css"
import ExerciseRow from "./ExerciseRow";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

 //Type för exercise obj från bkend
  type Exercise = {
    id: number;
    exerciseName: string;
    pictureUrl: string | null;
  };

  //Denna finns i exrow komp också, refaktorera båda till en fil senare och impotera från den ist.
  type ExerciseInput = {
  exerciseId: string;
  set: string;
  rep: string;
};

  type WorkoutInput = {
    workoutName: string;
    exercises: ExerciseInput[];
  }

const CreateProgram = () => {
  const navigate = useNavigate();
  const { logout } = useAuth()
  
  const [programName, setProgramName] = useState("");

  const [exercises, setExercises] = useState<Exercise[]>([]);

  //för att ha flera pass (workouts) i samma gymprogram
  const [workouts, setWorkouts] = useState<WorkoutInput[]>([ {workoutName: "", exercises: [{exerciseId: "", set: "", rep: ""}]} ]);


  useEffect(() => {
    const fetchExercise = async () => {
      const res = await fetch("https://localhost:44388/api/gymprogram/exercises", {
        method: "GET",
        headers: {"Content-Type" : "application/json"}
      })
      const data: Exercise[] = await res.json();
      setExercises(data)
      console.log("data", data)
    }
    fetchExercise()
  }, []);

  const createGymProgram = async () => {
  const res = await fetch("https://localhost:44388/api/GymProgram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      programName,
      workouts: workouts.map(w => ({
        workoutName: w.workoutName,
        exercises: w.exercises.map(ex => ({
          exerciseId: Number(ex.exerciseId),
          set: Number(ex.set),
          rep: Number(ex.rep)
        }))
      }))
    })
  });

  if (!res.ok) {
    //om token rinner ut så navigeras man till login
    if(res.status === 401){
          logout();
          navigate("/login");
    }
    const text = await res.text();
    console.log(text);
    alert("Något gick fel");
    return;
  }

  alert("Program skapat!");
  navigate("/dashboard")
};

  const addWorkoutInCurrentProgram = () => {
    setWorkouts(prev => [...prev, {workoutName: "", exercises: [{exerciseId: "", set: "", rep: ""}]}])
  }

  const removeWorkout = (idx: number) => {
    if(idx === 0) return alert("Första passet kan inte tas bort");
    setWorkouts(prev => prev.filter((w, index) => idx !== index))
  }

  const renderOptions = exercises.map(ex => (
  <option key={ex.id} value={ex.id}>
    {ex.exerciseName}
  </option>
));

  return (
    <>
      <div className="createProgramContainer">
        <h1>Skapa ditt egna gym program</h1>
        <form onSubmit={(e) => {e.preventDefault(); createGymProgram();}} className="createProgramForm">
          <label htmlFor="programName">Program namn</label>
          <input type="text" value={programName} onChange={(e) => setProgramName(e.target.value)} id="programName" placeholder="Ange namn för ditt program" required/>
          
          {workouts.map((workout, workoutIndex) => (
          <div className="workoutCard" key={workoutIndex}>
            {workoutIndex > 0 && <FaTimes className="crossIcon" onClick={() => removeWorkout(workoutIndex)}/>}
            <div className="workoutHeader">
              <h4>Pass{workoutIndex + 1}</h4>
              <input type="text" value={workout.workoutName} onChange={(e) => { const updated = [...workouts]; updated[workoutIndex].workoutName = e.target.value;
                setWorkouts(updated);}} placeholder="Namn på passet, tex Legday"required/>
            </div>
            {workout.exercises.map((ex, i) => (
              <ExerciseRow
                key={i}
                i={i}
                ex={ex}
                exerciseInput={workout.exercises}
                setExerciseInput={(newExercises: ExerciseInput[]) => {
                  const updated = [...workouts];
                  updated[workoutIndex].exercises = newExercises;
                  setWorkouts(updated);
                }}
                renderOptions={renderOptions}
                removeExercise={(index) => {
                  const updated = [...workouts];
                  updated[workoutIndex].exercises =
                    updated[workoutIndex].exercises.filter((e, idx) => idx !== index);
                  setWorkouts(updated);
                }}
              />
            ))}
              <button type="button" onClick={() => {
              const updated = [...workouts];
              updated[workoutIndex].exercises.push({exerciseId: "", set: "", rep: ""}); setWorkouts(updated);}}>+ Lägg till övning</button>
          </div>
          ))}


          <button type="button" onClick={addWorkoutInCurrentProgram}>+ Lägg till ett pass i nuvarande program</button>
          <button type="submit">Spara gym program</button>
        </form>
      </div>
    </>
  )
}
export default CreateProgram