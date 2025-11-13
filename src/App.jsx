import { useEffect, useState } from 'react';
import './App.css';
import Todos from './todos';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebase';

function App() {
  const [authoption, setauthoption] = useState("Login");
  const [signupemail, setsignupemail] = useState('');
  const [signuppassword, setsignuppassword] = useState('');
  const [signupconfpassword, setsignupconfpassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [Loginpassword, setLoginpassword] = useState('');
  const [passwordproblem, setpasswordproblem] = useState(false);
  const [credentials, setcredentials] = useState(null);



useEffect(() => {
  const authUnsub = onAuthStateChanged(auth,
    currentUser => {
      if(currentUser) {
        setcredentials(currentUser);
      } else {
        setcredentials(null);
      }
    });
      return () => authUnsub();
   } 
 
   , []);









  const showsignupforme = () => {
    if (authoption === 'signup')
      return (
        <article className="auth-card" aria-label="Sign up form">
          <h2>Welcome! You can quickly sign up here:</h2>
          <form
            className="auth-form"
            onSubmit={async ev => {
              ev.preventDefault();
              if (signuppassword.trim().length >= 6 && signuppassword === signupconfpassword) {
                await createUserWithEmailAndPassword(auth, signupemail, signuppassword);
                setauthoption('Login');
              } else {
                setpasswordproblem(true);
                setTimeout(() => {
                  setpasswordproblem(false);
                }, 10000);
              }
            }}
          >
            <div className="form-field">
              <label className="field-label" htmlFor='signup-email'>Email</label>
              <input
                className="field-input"
                id='signup-email'
                type='email'
                value={signupemail}
                onChange={ev => setsignupemail(ev.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor='signup-password'>Password</label>
              <input
                className="field-input"
                id='signup-password'
                type='password'
                value={signuppassword}
                onChange={ev => setsignuppassword(ev.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor='confirm-password'>Confirm Password</label>
              <input
                className="field-input"
                id='confirm-password'
                type='password'
                value={signupconfpassword}
                onChange={ev => setsignupconfpassword(ev.target.value)}
              />
            </div>
            {passwordproblem && (
              <p className="form-error">Passwords must match and contain at least six characters.</p>
            )}
            <button className="primary-btn" type='submit'>Sign up</button>
          </form>
        </article>
      );
  };

  const showloginform = () => {
    if (authoption === 'Login')
      return (
        <article className="auth-card" aria-label="Login form">
          <h2>Login</h2>
          <form
            className="auth-form"
            onSubmit={async ev => {
              ev.preventDefault();
              const cred = await signInWithEmailAndPassword(auth, loginEmail, Loginpassword);
              setcredentials(cred);
            }}
          >
            <div className="form-field">
              <label className="field-label" htmlFor='login-email'>Email</label>
              <input
                className="field-input"
                id='login-email'
                type='email'
                value={loginEmail}
                onChange={ev => setLoginEmail(ev.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor='login-password'>Password</label>
              <input
                className="field-input"
                id='login-password'
                type='password'
                value={Loginpassword}
                onChange={ev => setLoginpassword(ev.target.value)}
              />
            </div>
            <button className="primary-btn" type='submit'>Login</button>
          </form>
        </article>
      );
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Toodels</h1>
        <p className="app-subtitle">Manage your todo's here...</p>
      </header>

      {!credentials && (
        <section className="auth-panel">
          <div className="auth-toggle" role="radiogroup" aria-label="Authentication option">
            <label className={`auth-option ${authoption === 'Login' ? 'active' : ''}`} htmlFor='loginRadio'>
              <input
                id='loginRadio'
                name='authoption'
                type='radio'
                checked={authoption === 'Login'}
                value='Login'
                onChange={ev => setauthoption(ev.target.checked ? 'Login' : 'signup')}
              />
              <span>Login</span>
            </label>
            <label className={`auth-option ${authoption === 'signup' ? 'active' : ''}`} htmlFor='signupRadio'>
              <input
                id='signupRadio'
                name='authoption'
                type='radio'
                checked={authoption === 'signup'}
                value='signup'
                onChange={ev => setauthoption(ev.target.checked ? 'signup' : 'Login')}
              />
              <span>Sign up</span>
            </label>
          </div>

          <div className="auth-forms">
            {showsignupforme()}
            {showloginform()}
          </div>
        </section>
      )}

      {credentials && (
        <section className="todos-section">
          <Todos credentials={credentials}/>
        </section>
      )}
    </div>
  );
}

export default App;
