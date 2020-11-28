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

    return <Container>
        <Row>
            <DayByDayContainer currentTime={currentTime} />
        </Row>
        <div>
            <p></p>
            <h5>Working Capital</h5> <p>This value represents the money to work with taking into account your future expenses.</p>
        </div>
        <hr />
        <Row>
            <Col>
                <RulesContainer onRefresh={onRefresh} />
            </Col>
            <Col>
                <h2>Transactions</h2>
                <TransactionsContainer currentTime={currentTime} />

            </Col>
        </Row>
    </Container>
}