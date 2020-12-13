import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Header } from './components/Header';

import {
  Switch,
  Route
} from "react-router-dom";
import { Home } from './pages/home/Home';
import { PlanContainer } from './pages/plan/PlanContainer';



function App() {
  return (
    <>
      <Header />
        <Switch>
          <Route path="/plan">
            <PlanContainer />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      <Container fluid style={{ background: '#f8f9fa' }} className="mt-3">
        <Container className="text-center">
          MoneyWise &#169; 2020
        </Container>
      </Container>
    </>
  );
}

export default App;
