import { useState } from "react"
import "./CreateProgram.css"
const CreateProgram = () => {
//useState typen 
type Workout = {
  name: string,
  exercises: Exercise[];
}

type Exercise = {
  id: number,
  name: string
}

const exerciseList = [
  { id: 1, name: "Bänkpress" },
  { id: 2, name: "Knäböj" },
  { id: 3, name: "Marklyft" }
]

const [workouts, setWorkouts] = useState<Workout[]>([])

const handleSelectedPasses = (num: number) => {
  const newWorkouts: Workout[] = []
  for(let i = 0; i < num; i++){
    newWorkouts.push({name: "", exercises: []})
  }
  setWorkouts(newWorkouts);
}

const handleAddExercise = (index: number, exerciseId: number) => {
  console.log(`Du ändrade PASS ${index + 1}`)

}

  return (
    <>
      <div className="createProgramContainer">
        <h1>Skapa ditt egna gym program</h1>
        <h2>Välj antal pass per vecka:</h2>
        <div className="btnGrp">
          {[2, 3, 4, 5, 6, 7].map((num: number, idx: number)=> (
            <button key={idx} onClick={() => handleSelectedPasses(num)}>{num} pass</button>
          ))}
        </div>
      </div>

      <div className="cardContainer">
        {workouts.length > 0 && (
            workouts.map((workoutObj: Workout, index: number) => {
              return <div key={index} className="workoutCard">
                <label htmlFor="workoutName">Namnge pass {index +1}</label>
                <input type="text" id="workoutName" />
                <select onChange={(e) => handleAddExercise(index, Number(e.target.value))}>
                  <option value="">Välj övning</option>
                  {exerciseList.map((exe: Exercise) => {
                    return <option key={exe.id} value={exe.id}>{exe.name}</option>
                  })}
                </select>
              </div>
            })
          )}
      </div>
    </>
  )
}
export default CreateProgram