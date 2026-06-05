import { useEffect, useState } from "react"
import type { CompletedSession } from "../types/workoutSessionTypes"

const WorkoutHistory = () => {

  const [completedSession, setCompletedSession] = useState<CompletedSession[]>([]);

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

  const renderCompletedSessions = completedSession.map(s => {
    return <div className="sessionCard" key={s.sessionId}>
      <h2>Program: {s.programName}</h2>
      <p>{s.workoutName}</p>
      <p>{new Date(s.date).toLocaleDateString("sv-SE")}</p>
    </div>
  })

  return (
    <>
      <h1>Din träningshistorik</h1>
      {renderCompletedSessions}
    </>
  )
}
export default WorkoutHistory