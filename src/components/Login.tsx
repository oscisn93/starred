import {
  signInWithEmailAndPassword
} from "firebase/auth";
import { }
import './Login.css';


async function handleLogin(email, password) {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

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
        <button onSubmit={handleLogin}>Submit</button>
      </div>
    </div>
  )
}

export default Login;
