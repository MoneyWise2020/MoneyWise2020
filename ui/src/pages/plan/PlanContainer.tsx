import React from 'react';
import Container from 'react-bootstrap/Container';
import { RulesContainer } from './rules/RulesContainer';
import { TransactionsContainer } from './transactions/TransactionsContainer';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';

export const PlanContainer = () => {
    return <Container>
        <Row>
            <Col>
                <RulesContainer />
            </Col>
            <Col>
                <h3>Transactions</h3>
                <TransactionsContainer />

            </Col>
        </Row>
    </Container>
}