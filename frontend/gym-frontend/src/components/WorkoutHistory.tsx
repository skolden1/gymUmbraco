import { useEffect, useState } from "react"
import type { CompletedSession, CompletedSessionDetails } from "../types/workoutSessionTypes"
import "../components/WorkoutHistory.css"

const WorkoutHistory = () => {

  const [completedSession, setCompletedSession] = useState<CompletedSession[]>([]);

  //visa mer state (så rader expanderas)
  const [showMoreById, setShowMoreById] = useState<number[]>([]);

  const [sessionDetails, setSessionDetails] = useState<CompletedSessionDetails[]>([]);

  useEffect(() => {
    const getSessionHistory = async () => {
      const res = await fetch("https://localhost:44388/api/WorkoutSession/completed-sessions", {
        method: "GET",
        headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      if(!res.ok) return;
      const data: CompletedSession[] = await res.json();
      setCompletedSession(data);
      console.log("alla sessions: ", data)
    }
    getSessionHistory();
  }, [])

  const handleShowMore = async (sessionId: number) => {
    const isOpen = showMoreById.includes(sessionId);
    if(!isOpen){
      //hämta session details
      const res = await fetch(`https://localhost:44388/api/WorkoutSession/session-details/${sessionId}`, {
        method: "GET",
        headers: {"Content-Type" : "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      if(!res.ok) return;
      const data: CompletedSessionDetails = await res.json();
      setSessionDetails(prev => [...prev, data]);
      console.log("session details: ", data)
    }
    setShowMoreById(prev => prev.includes(sessionId) ? prev.filter(id => id !== sessionId) : [...prev, sessionId] );
  }


  const renderCompletedSessions = completedSession.map(s => {

    const details = sessionDetails.find(d => d.sessionId === s.sessionId);

    return <div className="sessionCard" key={s.sessionId}>
      <h2>{s.programName}</h2>
      <p>Pass: {s.workoutName}</p>
      <div className="sessionCardRow">
        <p>Datum: {new Date(s.date).toLocaleDateString("sv-SE")}</p>
        <p onClick={() => handleShowMore(s.sessionId)} className="infoTxt">{showMoreById.includes(s.sessionId) ? "Dölj" : "Visa mer"}</p>
      </div>
      {
        showMoreById.includes(s.sessionId) && details && <div className="exerciseDetails">
          {details.exercises.map((e, idx) => (
            <div key={idx} className="exerciseDetailRow">
            {idx === 0 ||
            details.exercises[idx - 1].exerciseName !== e.exerciseName ? (
              <h4 className="exerciseName">{e.exerciseName}</h4>
            ) : null}

            <div className="exerciseSetRow">
              <span>Set {e.setNumber}: </span>
              <span>{e.repsDone} reps </span>
              <span>{e.weight} kg</span>
            </div>

          </div>
          ))}
          </div>
      }
        </div>
    })

  return (
    <div className="workoutHistoryContainer">
      <h1 className="workoutHistoryTitle">Din träningshistorik</h1>
      {renderCompletedSessions}
    </div>
  )
}
export default WorkoutHistory