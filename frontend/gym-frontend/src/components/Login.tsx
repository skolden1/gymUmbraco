import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

  const handleLogin = async (formData: FormData) => {
    const objData = {
      emailDto: formData.get("email") as string,
      passwordDto: formData.get("password") as string
    };

    const res = await fetch("https://localhost:44388/api/userauth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objData)
    });

    if (!res.ok) {
      const errorText = await res.text();
      return alert(errorText || "Fel email eller lösenord");
    }

    const data = await res.json();

    login(data.token); 
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