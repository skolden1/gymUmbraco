import "./Register.css";

const Register = () => {
  return (
    <div className="registerContainer">
      <h1>Registrera dig</h1>
      <form>
        <div className="col">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="name@hotmail.com" required/>
        </div>

        <div className="col">
          <label htmlFor="password">Lösenord</label>
          <input id="password" type="password" required/>
        </div>

        <div className="col">
          <label htmlFor="repeatPw">Repetera lösenord</label>
          <input id="repeatPw" type="password" required/>
        </div>
        <button className="regBtn">Registrera</button>
      </form>
    </div>
  )
}
export default Register