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

//för modal 
type ConfirmDeleteState = {
  type: "program" | "workout"
  id?: number
}

//Refaktorera denna + fetchen senare (skapa en komponent som visar alla övn i en lista ist, då vi har den i createprog och denna komp just nu...)
type Exercise = {
  id: number,
  exerciseName: string
}

//från endpointen när man lägger till övning i pass
type NewExerciseResponse = {
  id: number,
  exerciseId: number,
  set: number,
  rep: number
}

//editworkoutExer endpoint 
type UpdatedWorkoutExercise = {
  id: number,
  set: number,
  rep: number
}

const EditGymProgram = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string}>()

  const [gymProgram, setGymProgram] = useState<GymProgramDetail | null>(null);

  //globala övningslistan
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);

  //ändra namn states
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState("")

  //modal / confirm ruta
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteState | null>(null);

  //L'ägga till övn toggle
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchExerciseList = async () => {
      const res = await fetch(`https://localhost:44388/api/GymProgram/exercises`, {
        method: "GET",
        headers: {"Content-Type" : "application/json"}
      });

      if(!res.ok) return alert("Kunde inte hämta listan med övningar");

      const data: Exercise[] = await res.json();
      setAllExercises(data);
    }
    fetchExerciseList();
  }, [])

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

    const handleDeleteProgram = async () => {
      const res = await fetch(`https://localhost:44388/api/GymProgram/${gymProgram.id}`, {
        method: "DELETE",
        headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
    if(!res.ok) return alert("Något gick fel vid försök av att ta bort program");
      
    alert("Programmet togs bort")
    navigate("/dashboard")
  }


  const handleDeleteWorkout = async (workoutId: number) => {
    const res = await fetch(`https://localhost:44388/api/GymProgram/workout/${workoutId}`, {
      method: "DELETE",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
    })

    if(!res.ok) return alert("Något gick fel vid försök av att ta bort pass");

    setGymProgram(prev => prev ? {...prev, workouts: prev.workouts.filter(w => w.id !== workoutId)}: prev)
    alert("Passet togs bort")
  }

  const handleDeleteExercise = async (workoutExeId: number) => {
    const res = await fetch(`https://localhost:44388/api/GymProgram/exercise/${workoutExeId}`, {
      method: "DELETE",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
    })

    if(!res.ok) return alert("Något gick fel vid försök av att ta bort övning");
    setGymProgram(prev => prev ? {...prev, workouts: prev.workouts.map(w => ({
      ...w,
      exercises: w.exercises.filter(e => e.id !== workoutExeId)
    }))}: prev);
  }

  const handleAddExercise = async (formData: FormData, workoutId: number) => {

    const exerciseId = formData.get("exerciseId");
    const rep = formData.get("reps");
    const set = formData.get("sets");

    const res = await fetch(`https://localhost:44388/api/GymProgram/workout/${workoutId}/exercise`, {
      method: "POST",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify({workoutId, exerciseId, rep, set})
    })

    if(!res.ok) return alert("Det gick inte att lägga till övning");
    const data: NewExerciseResponse = await res.json();
    
    const foundExercise = allExercises.find(e => e.id === data.exerciseId);

    const newExercise: ExerciseDetail = {
      id: data.id,
      exerciseId: data.exerciseId,
      exerciseName: foundExercise?.exerciseName || "Okänd övning",
      set: data.set,
      rep: data.rep
  };

  setGymProgram(prev => {
    if (!prev) return prev;

    return {
      ...prev,
      workouts: prev.workouts.map(w =>
        w.id === workoutId
          ? {
              ...w,
              exercises: [...w.exercises, newExercise]
            }
          : w
      )
    };
  });

    alert("Övningen lades till!");
  }

  const handleEditSetNRep = async (workoutExerciseId: number, update: {set?: number, rep?:number}) => {
    const res = await fetch(`https://localhost:44388/api/GymProgram/exercise/${workoutExerciseId}`, {
      method: "PUT",
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify(update)
    })

    if(!res.ok) return alert("Kunde inte uppdatera")
    
    const data: UpdatedWorkoutExercise = await res.json();
  }

  return (
    <>
      <h1>Redigera gymprogram</h1>
      <div className="editProgramWrapper">
        <div className="removeProgRow">
          <p>Ta bort program</p>
          <FiTrash2 onClick={() => setConfirmDelete({type: "program"})} className="trashIcon"/>
        </div>
        {confirmDelete && 
            <>
              <div className="modalOverlay">
                <div className="modalContainer">
                  <p>
                    {confirmDelete.type === "program" 
                      ? "Vill du verkligen ta bort programmet?" 
                      : "Vill du verkligen ta bort passet?"}
                  </p>
                  <div className="editBtnRowGrp">
                    <button onClick={() => {
                      if (confirmDelete.type === "program") {
                        handleDeleteProgram()
                      } else if (confirmDelete.type === "workout" && confirmDelete.id) {
                        handleDeleteWorkout(confirmDelete.id)
                      }
                      setConfirmDelete(null)}} className="editRemoveBtn">Ta bort</button>
                    <button className="editCancelBtn" onClick={() => setConfirmDelete(null)}>Avbryt</button>
                  </div>
                </div>
              </div>
            </>
            }
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
                <FiX onClick={() => setConfirmDelete({type: "workout", id: w.id})} className="deleteExerciseBtn" />
                  
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
                    <FiX onClick={() => handleDeleteExercise(e.id)} className="deleteExerciseBtn" />
                  </div>
                ))}
                <button onClick={() => setActiveWorkoutId(w.id)} className="editAddBtn">+ Lägg till övning</button>
                { activeWorkoutId === w.id && <div className="addExerciseFormWrapper">
                        <form action={(formData) => handleAddExercise(formData, w.id)}>
                          <select required name="exerciseId">
                            <option value={""}>--Välj en övning--</option>
                            {allExercises.map(e => (
                              <option key={e.id} value={e.id}>{e.exerciseName}</option>
                            ))}
                          </select>
                          <label htmlFor="reps">Skriv in antal repetitioner</label>
                          <input type="number" name="reps" required placeholder="tex 3 reps" id="reps"/>
                          <label htmlFor="sets" id="sets">Skriv in antal sets</label>
                          <input type="nuner" name="sets" required placeholder="tex 3 set" id="sets"/>
                          <div className="editFormRow">
                            <button className="editFormSaveBtn" type="submit">Spara</button>
                            <button className="editFormCancelBtn" onClick={() => setActiveWorkoutId(null)}>Avbryt</button>
                          </div>
                        </form>
                  </div>}
              </div>
            </div>
          ))}
        </div>
    </>
  )
}
export default EditGymProgram