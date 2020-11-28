import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { IApiRule, IApiRuleMutate } from './IRule';
import { RRule } from 'rrule';
import './Rule.css';
import { Currency } from '../../../components/currency/Currency';

function getRRuleDisplayString(rruleString: string): string {
    try {
        return RRule.fromString(rruleString).toText();
    } catch (e) {
        return "(Oops, looks like an invalid recurrence rule)"
    }
}

export const Rule = ({
    rule,
    onDelete = () => {},
    onUpdate = () => {},
    showModal = () => {}
}: {
    rule: IApiRule,
    onDelete?: (id: string) => void,
    onUpdate?: (id: string, ruleUpdate: IApiRuleMutate) => void,
    showModal?: (id: string, rule: IApiRuleMutate) => void,
}) => {

    const deleteButtonHandler = useCallback(() => onDelete(rule.id), [rule.id, onDelete]);
    const editButtonHandler = useCallback(() => showModal(rule.id, rule), [rule.id, rule, showModal])
    const rruleString = getRRuleDisplayString(rule.rrule);
    return <ListGroup.Item>
        <div className="ruledescription">
            <h5>{rule.name} </h5>
            <h6>Occurs {rruleString}</h6>
            <h6>Value: <Currency value={rule.value} /></h6>
            <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group mr-2" role="group" aria-label="First group">
            <Button variant="secondary" onClick={editButtonHandler} size="sm">Edit</Button>
            </div>
            <div className="btn-group mr-2" role="group" aria-label="Second group">
            
            <Button variant="danger" size="sm" onClick={deleteButtonHandler}>Delete</Button>
            </div>
            </div>
        </div>
    </ListGroup.Item>;
}
