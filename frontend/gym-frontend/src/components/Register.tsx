import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {

  const navigate = useNavigate();

  const handleRegistration = async (formData: FormData) => {
  const objData = {
    emailDto: formData.get("email") as string,
    passwordDto: formData.get("password") as string,
    repeatPasswordDto: formData.get("repeatPw") as string
  }; 
  if(objData.passwordDto !== objData.repeatPasswordDto) return alert("Lösenorden matchar inte");
  const res = await fetch("https://localhost:44388/api/userauth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData)
  })
  if(!res.ok) return alert("Något gick fel, försök igen senare");
  alert("Registrering lyckades, du kan nu logga in");
  navigate("/login");
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