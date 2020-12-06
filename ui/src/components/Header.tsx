import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export const Header = () => {
    return <Navbar bg="light" expand="lg" className="mb-3">
        <Link to="/">
            <Navbar.Brand>moneywise</Navbar.Brand>
        </Link>
        <Link to="/plan">Plan</Link>            
    </Navbar>
}
