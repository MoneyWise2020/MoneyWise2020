import React from 'react';
import './App.css';

import { useAuth0 } from "@auth0/auth0-react";
import { Token } from './Token';
import { Results } from './Results';

function App() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();
  return (
    <>
    <header style={{ backgroundColor: 'red' }}>Hello World</header>
    
    <div className="App">
      <header className="App-header">
        {isLoading && <p>Loading...</p>}
        {isAuthenticated ? <button
          className="App-link"
          onClick={() => logout()}
        >
          Logout {user.email}
        </button> : <button
          className="App-link"
          onClick={() => loginWithRedirect()}
        >
          Login
        </button>}
        {isAuthenticated && <Token></Token>}
        {isAuthenticated && <Results></Results>}
      </header>
    </div>
    </>
  );
}

export default App;
