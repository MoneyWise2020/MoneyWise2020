import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { IApiRule, IApiRuleMutate } from './IRule';
import { RRule } from 'rrule';
import './Rule.css';
import { Currency } from '../../../components/currency/Currency';

export const Rule = ({
    rule,
    onDelete = () => {}
}: {
    rule: IApiRule,
    onDelete?: (id: string) => void,
    onUpdate?: (id: string, ruleUpdate: IApiRuleMutate) => void,
}) => {
    const deleteButtonHandler = useCallback(() => onDelete(rule.id), [rule.id, onDelete]);

    // rule.name
    // rule.rrule
    const rrule = RRule.fromString(rule.rrule);
    return <ListGroup.Item>
        <div className="ruledescription">
            <h5>{rule.name} </h5>
            <h6>Occurs {rrule.toText()}</h6>
            <h6>Value: <Currency value={rule.value} /></h6>
            <Button variant="outline-secondary" className="close" size="sm" onClick={deleteButtonHandler}>&times;</Button>
        </div>
    </ListGroup.Item>;
}
