import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export const Header = () => {
    return <Navbar bg="light" expand="lg">
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
            <span>Hello, {user.given_name}</span>
            <Button onClick={() => logout()}>Logout</Button> 
        </>
    }

    return <>
        <Button onClick={() => loginWithRedirect()}>Login</Button>
    </>
}