import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export const Header = ({}) => {
    return <Navbar bg="light" expand="lg">
        <Link to="/">
            <Navbar.Brand>moneywise</Navbar.Brand>
        </Link>
        <Link to="/plan">
            <Nav.Link href="/plan">Plan</Nav.Link>
        </Link>            
    </Navbar>
}
