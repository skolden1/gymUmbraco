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

        <Route path="/program/:id" element={<ProgramDetail/>} />
        <Route path="/edit-program/:id" element={<EditGymProgram />} />

        <Route path='/CreateProgram' element={ isAuth ? <CreateProgram/> : <Navigate to="/login" /> } />
      </Routes>
    </>
  );
}

export default App;