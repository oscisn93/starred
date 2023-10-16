import './Login.css';

function Login() {
  
  return (
    <div>
      <div className='header'>
        <h1>Starred</h1>
      </div>
      <div className='login-form'>
        <h2>Login</h2>
        <input type="email" placeholder='Email' />
        <input type="password" placeholder='Password' />
        <button>Submit</button>
      </div>
    </div>
  )
}

export default Login;
