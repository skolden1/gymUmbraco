import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import CreateProgram from './components/CreateProgram'
import ProgramDetail from './components/ProgramDetail'
import EditGymProgram from './components/EditGymProgram'
import WorkoutSessionPage from './components/WorkoutSessionPage'
import WorkoutHistory from './components/WorkoutHistory'

function App() {
  const { isAuth, loading } = useAuth();

  if (loading) return <p>Laddar...</p>;

  return (
    <>
    { isAuth && <Navbar/>}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />

        {isAuth ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          <Route path="/dashboard" element={<Navigate to="/login" />} />
        )}

        <Route path="/program/:id" element={ isAuth ? <ProgramDetail/> : <Navigate to="/login" />} />
        <Route path="/edit-program/:id" element={ isAuth ? <EditGymProgram /> : <Navigate to="/login" />} />

        <Route path='/workout-session-page/:programId/:workoutId' element={ isAuth ? <WorkoutSessionPage /> : <Navigate to="/login" />} />

        <Route path="/workoutHistory" element={ isAuth ? <WorkoutHistory /> : <Navigate to="/login" />} />

        <Route path='/CreateProgram' element={ isAuth ? <CreateProgram/> : <Navigate to="/login" /> } />
      </Routes>
    </>
  );
}

export default App;