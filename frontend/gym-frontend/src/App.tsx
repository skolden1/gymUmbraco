import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import CreateProgram from './components/CreateProgram'

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

        <Route path='/CreateProgram' element={<CreateProgram/> } />
      </Routes>
    </>
  );
}

export default App;