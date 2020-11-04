import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Header } from './components/Header';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Home } from './pages/home/Home';

function App() {
  return (
    <Router>
      <Header />
      <Container>
        <Switch>
          <Route path="/plan">
            Plan
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
      <Container fluid style={{ background: 'black' }}>
        <Container>
          <Row>
            Footer
          </Row>
        </Container>
      </Container>
    </Router>
  );
}

export default App;
