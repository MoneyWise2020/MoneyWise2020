import React, { useCallback, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { RulesContainer } from './rules/RulesContainer';
import { TransactionsContainer } from './transactions/TransactionsContainer';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';
import { DayByDayContainer } from './daybyday/DayByDayContainer';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import { useToken } from './getTokenHook';


export const PlanContainer = () => {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const onRefresh = useCallback(() => {
        setCurrentTime(Date.now());
    }, [])

    const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
    const token = useToken();
    
    if (!isLoading && !isAuthenticated) {
        return <Container className="justify-content-middle">
            You need to be logged in! <br /><Button onClick={() => loginWithRedirect()}>Login</Button>
        </Container>
    }

    if (isLoading || !token) {
        return null;
    }

    const userid = user.sub;

    return <Container fluid>
        <Row>
            <Col>
                <h2>Create a New rule</h2>
                <RulesContainer userid={userid} onRefresh={onRefresh} />
            </Col>
            <Col lg={8}>
                <h2>Visualize Transactions</h2>
                <DayByDayContainer userid={userid} currentTime={currentTime} /> <br /><br /><br />
                <h2>Upcoming Transactions</h2>
                <TransactionsContainer userid={userid} currentTime={currentTime} />
                
            </Col>
        </Row>
    </Container>
}
