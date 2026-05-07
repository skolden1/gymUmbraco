import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { LoginDto } from "../types/authTypes";
import { loginUser } from "../services/authService";

const Login = () => {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

  const handleLogin = async (formData: FormData) => {
    const objData: LoginDto = {
      emailDto: formData.get("email") as string,
      passwordDto: formData.get("password") as string
    };
    try {
      const data = await loginUser(objData);
      login(data.token)
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="loginContainer">
      <h1>Logga in</h1>

      <form onSubmit={(e) => {e.preventDefault(); handleLogin(new FormData(e.currentTarget));}}>
        <div className="col">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" required />
        </div>

        <div className="col">
          <label htmlFor="password">Lösenord</label>
          <input id="password" name="password" type="password" required />
        </div>

        <button className="logBtn">Logga in</button>
      </form>
      <div className="registerInfo">
        <p>Har du inget konto?</p>
        <Link to="/">Gå till registrering</Link>
      </div>
    </div>
  );
};

export default Login;