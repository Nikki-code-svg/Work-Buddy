import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setCurrentUser }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Invalid username or password');
      }
    })
    .then(data => {
      setCurrentUser(data);
      navigate('/jobsite');
    })
    .catch(error => {
      alert(error.message);
    });
  }

  return (
    <form className='user-form' onSubmit={handleSubmit}>
      <h2 className='login'>Login</h2>

      <input
        className='login-input'
        type="text"
        onChange={e => setUsername(e.target.value)}
        value={username}
        placeholder='Username'
      />

      <input
        className='login-input'
        type="password"
        onChange={e => setPassword(e.target.value)}
        value={password}
        placeholder='Password'
      />

      <input
        className='submitbtnL'
        type="submit"
        value='Login'
      />
      
      <Link to='/signup'>
        <button type="signupbtn">Signup</button>
      </Link>
    </form>
  );
}

export default Login;

