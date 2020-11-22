import React, { useCallback, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { RulesContainer } from './rules/RulesContainer';
import { TransactionsContainer } from './transactions/TransactionsContainer';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';



export const PlanContainer = () => {


    const [currentTime, setCurrentTime] = useState(Date.now());
    const onRefresh = useCallback(() => {
        setCurrentTime(Date.now());
    }, [])

    return <Container>
        <Row>
            <Col>
                <RulesContainer onRefresh={onRefresh} />
            </Col>
            <Col>
                <h3>Transactions</h3>
                <TransactionsContainer currentTime={currentTime} />

            </Col>
        </Row>
    </Container>
}