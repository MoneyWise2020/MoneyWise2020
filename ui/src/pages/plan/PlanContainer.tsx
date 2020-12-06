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

    return <Container fluid style={{ paddingLeft: '10%', paddingRight: "10%" }}>
        <Row>
            <Col>
                <RulesContainer onRefresh={onRefresh} />
            </Col>
            <Col lg={8}>
                <Container className="text-center">
                    <h4>Upcoming Transactions</h4>
                </Container>
                <DayByDayContainer currentTime={currentTime} />
                <hr />
                <TransactionsContainer currentTime={currentTime} />
            </Col>
        </Row>
    </Container>
}