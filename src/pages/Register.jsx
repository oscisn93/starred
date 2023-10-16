import "./Register.css";

function Register() {

    return (
      <div>
        <div>
            <Link to="/home">Go to Home Page</Link>
        </div>
        <div className='header'>
            <h1>Starred</h1>
        </div>
        <div className='login-form'>
            <h2>Register</h2>
            <input type="email" placeholder='Email' />
            <input type="password" placeholder='Password' />
            <input type="password" placeholder='Confirm Password' />
            <button>Submit</button>
        </div>
      </div>
    )
  }
  
  export default Register;