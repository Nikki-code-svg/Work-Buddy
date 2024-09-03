import { useState } from 'react';
import Signup from './Signup';
import Login from './Login'
import UserDetails from "./UserDetails";


function UserPanel({ currentUser, setCurrentUser }) {
  const [showSignup, setShowSignup] = useState(false);

  if (!currentUser) {
    if (showSignup) {
      return (
        <div className="signup-container">
        <Signup setCurrentUser={setCurrentUser} setShowSignup={setShowSignup} />
        </div>
      );
    } else {
      return (
        <div className="login-container">
          <Login setCurrentUser={setCurrentUser}   style={{ backgroundImage: `url(${constructionImage})` }}/>
          <p>
            Don't have an account?{' '}
            <button onClick={() => setShowSignup(true)} className="signup-link">
              Click here to sign up
            </button>
          </p>
        </div>
      );
    }
  } else {
    return <UserDetails currentUser={currentUser} setCurrentUser={(user) => {
      setCurrentUser(user);
      if (!user) {
        setShowSignup(false); // Reset to login form after logout
      }
    }} />;
  }
}

export default UserPanel;