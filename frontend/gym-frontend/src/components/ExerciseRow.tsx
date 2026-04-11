import {FaTrash} from "react-icons/fa";
//Denna finns i createprogram också, refaktorera båda till en fil senare och impotera från den ist.
type ExerciseInput = {
  exerciseId: string;
  set: string;
  rep: string;
};
// skickar ner från createprogram
type ExerciseRowProps = {
  i: number,
  //EN ÖVNING
  ex: ExerciseInput,
  //ALLA övningar
  exerciseInput: ExerciseInput[];
  setExerciseInput: React.Dispatch<React.SetStateAction<ExerciseInput[]>>;
  renderOptions: React.ReactNode;
  removeExercise: (index: number) => void;
}


const ExerciseRow = ({i, ex, exerciseInput, setExerciseInput, renderOptions, removeExercise}: ExerciseRowProps) => {
  return (
    <div className="exerciseContainer">
        <select value={ex.exerciseId} onChange={(e) => {
            const updated = [...exerciseInput];
            updated[i].exerciseId = e.target.value; setExerciseInput(updated);}}required>
          <option value="">Välj övning</option>
          {renderOptions}
        </select>

        <input value={ex.set} onChange={(e) => {
            const updated = [...exerciseInput];
            updated[i].set = e.target.value;
            setExerciseInput(updated);
          }}
          placeholder="Sets"
          required/>

        <input value={ex.rep} onChange={(e) => {
            const updated = [...exerciseInput];
            updated[i].rep = e.target.value;
            setExerciseInput(updated);
          }} placeholder="Reps" required/>
          <FaTrash onClick={() => removeExercise(i)} className="trash" title="Ta bort övning" />
      </div>
  )
}
export default ExerciseRow