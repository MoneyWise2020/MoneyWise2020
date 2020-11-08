import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { IApiRule, IApiRuleMutate } from './IRule';
import { RRule } from 'rrule';
import './Rule.css';


const Currency = ({ value }: { value: number }) => {
    if (value < 0) {
        return <span className="currency-negative">-${value*-1}</span>
    }
    return <span className="currency-positive">${value}</span>
}

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
            <h4>Rule Name: {rule.name} </h4>
            <h5>Rule Description: {rrule.toText()}</h5>
            <h5>Rule Value: <Currency value={rule.value} /></h5>
            <Button variant="outline-secondary" size="sm" onClick={deleteButtonHandler}>X</Button>
        </div>
    </ListGroup.Item>;
}
