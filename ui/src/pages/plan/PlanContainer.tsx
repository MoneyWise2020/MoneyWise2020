import React, { useCallback, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { RulesContainer } from './rules/RulesContainer';
import { TransactionsContainer } from './transactions/TransactionsContainer';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';
import { DayByDayContainer } from './daybyday/DayByDayContainer';



export const PlanContainer = () => {


    const [currentTime, setCurrentTime] = useState(Date.now());
    const onRefresh = useCallback(() => {
        setCurrentTime(Date.now());
    }, [])

    return <Container fluid>
        <Row>
            <Col>
                <h2>Create a New rule</h2>
                <RulesContainer onRefresh={onRefresh} />
            </Col>
            <Col lg={8}>
                <h2>Visualize Transactions</h2>
                <DayByDayContainer currentTime={currentTime} /> <br /><br /><br />
                <h2>Upcoming Transactions</h2>
                <TransactionsContainer currentTime={currentTime} />
                
            </Col>
        </Row>
    </Container>
}