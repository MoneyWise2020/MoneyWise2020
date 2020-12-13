import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export const Header = () => {
    return <Navbar bg="light" expand="lg" className="mb-3">
        <Link to="/">
            <Navbar.Brand>moneywise</Navbar.Brand>
        </Link>
        <Link to="/plan">Plan</Link>
        <LoginSection />
    </Navbar>
}

const LoginSection = () => {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();
    if (isLoading) {
        return null
    }

    if (isAuthenticated) {
        return <>
            <span className="ml-auto">Hello, {user.given_name}</span>
            <button className="btn btn-outline-primary ml-3" onClick={() => logout()}>Logout</button> 
        </>
    }

    return <>
        <button className="btn btn-outline-primary ml-auto" onClick={() => loginWithRedirect()}>Login</button>
        <button className="btn btn-primary ml-3" onClick={() => loginWithRedirect()}>Sign Up</button>
    </>
}