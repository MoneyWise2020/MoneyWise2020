import React from 'react';
import Container from 'react-bootstrap/Container';
import { RulesContainer } from './rules/RulesContainer';
import { TransactionsService } from './transactions/transactions-service';
import { TransactionsContainer } from './transactions/TransactionsContainer';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';

export const PlanContainer = () => {
    TransactionsService.getTransactions('test').then(console.log)
    return <Container>
        <Row>
            <Col>
                <RulesContainer />
            </Col>
            <Col>
                <TransactionsContainer />
            </Col>
        </Row>
    </Container>
}