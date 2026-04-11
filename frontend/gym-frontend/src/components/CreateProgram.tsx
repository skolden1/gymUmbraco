
import { useEffect, useState } from "react";
import "./CreateProgram.css"
import ExerciseRow from "./ExerciseRow";

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
const CreateProgram = () => {

  const [programName, setProgramName] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseInput, setExerciseInput] = useState<ExerciseInput[]>([ {exerciseId: "", set: "", rep: ""} ]);

  const [exercises, setExercises] = useState<Exercise[]>([]);

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
  }, [])

  const createGymProgram = async () => {
  const res = await fetch("https://localhost:44388/api/GymProgram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      programName,
      workouts: [
        {
          workoutName,
          exercises: exerciseInput.map(ex => ({
            exerciseId: Number(ex.exerciseId),
            set: Number(ex.set),
            rep: Number(ex.rep)
          }))
        }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.log(text);
    alert("Något gick fel");
    return;
  }

  alert("Program skapat!");
};

  const renderOptions = exercises.map(ex => (
  <option key={ex.id} value={ex.id}>
    {ex.exerciseName}
  </option>
));

  const addExercise = () => {
    setExerciseInput(prev => [...prev, {exerciseId: "", set: "", rep: ""}]);
  };

  const removeExercise = (index: number) => {
    console.log("Index:", index)
    setExerciseInput(prev => prev.filter((e, idx: number) => idx !== index ))
}

  return (
    <>
      <div className="createProgramContainer">
        <h1>Skapa ditt egna gym program</h1>
        <form onSubmit={(e) => {e.preventDefault(); createGymProgram();}} className="createProgramForm">
          <label htmlFor="programName">Program namn</label>
          <input type="text" value={programName} onChange={(e) => setProgramName(e.target.value)} id="programName" placeholder="Ange namn för ditt program" required/>
          <label htmlFor="">Ange namn för pass #1:</label>
          <input type="text" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} placeholder="tex legday" required/>
          {exerciseInput.map((ex, i) => (
            <ExerciseRow key={i} 
              i={i} 
              ex={ex} 
              exerciseInput={exerciseInput} 
              setExerciseInput={setExerciseInput} 
              renderOptions={renderOptions}
              removeExercise={removeExercise}
          />
          ))}

          <button type="button" onClick={addExercise}>+ Lägg till övning</button>
          <button type="submit">Spara gym program</button>
        </form>
      </div>
    </>
  )
}
export default CreateProgram