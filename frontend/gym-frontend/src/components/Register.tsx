import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import type { RegisterDto } from "../types/authTypes";
import { registerUser } from "../services/authService";

const Register = () => {

  const navigate = useNavigate();

  const handleRegistration = async (formData: FormData) => {
  const objData: RegisterDto = {
    emailDto: formData.get("email") as string,
    passwordDto: formData.get("password") as string,
    repeatPasswordDto: formData.get("repeatPw") as string
  }; 
  if(objData.passwordDto !== objData.repeatPasswordDto) return alert("Lösenorden matchar inte");
  try {
    await registerUser(objData);
    alert("Registrering lyckades, du kan nu logga in");
    navigate("/login");
  } catch (error) {
    alert((error as Error).message);
  }
  }

  return (
    <div className="registerContainer">
      <h1>Registrera dig</h1>
      <form action={handleRegistration}>
        <div className="col">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="name@hotmail.com" name="email" required/>
        </div>

        <div className="col">
          <label htmlFor="password">Lösenord</label>
          <input id="password" type="password" name="password" required/>
        </div>

        <div className="col">
          <label htmlFor="repeatPw">Repetera lösenord</label>
          <input id="repeatPw" type="password" name="repeatPw" required/>
        </div>
        <button className="regBtn">Registrera</button>
      </form>
      <div className="registerInfo">
        <p>Har du ett konto?</p>
        <Link to="/login">Gå till login</Link>
      </div>
    </div>
  )
}
export default Register