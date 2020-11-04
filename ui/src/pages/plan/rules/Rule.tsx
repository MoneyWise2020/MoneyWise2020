import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { IApiRule, IApiRuleMutate } from './IRule';

export const Rule = ({
    rule,
    onDelete = () => {}
}: {
    rule: IApiRule,
    onDelete?: (id: string) => void,
    onUpdate?: (id: string, ruleUpdate: IApiRuleMutate) => void,
}) => {
    const deleteButtonHandler = useCallback(() => onDelete(rule.id), [rule.id]);
    return <ListGroup.Item>
        <code>{JSON.stringify(rule)}</code>
        <Button variant="outline-secondary" size="sm" onClick={deleteButtonHandler}>X</Button>
    </ListGroup.Item>;
}
