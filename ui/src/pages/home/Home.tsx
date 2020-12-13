import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

export const Home = () => {
    return <Container>
        <Jumbotron>
            <h1>Take back your financial future.</h1>
            <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias inventore eos at aliquid omnis fugiat deleniti minus, ullam doloremque obcaecati fuga repellat nemo commodi magnam exercitationem expedita qui tenetur saepe?
            </p>
            <p>
                <Link to="/plan">
                    <Button variant="primary">Take Control</Button>
                </Link>
            </p>
        </Jumbotron>
    </Container>
}