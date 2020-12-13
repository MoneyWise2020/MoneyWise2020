import React, { useCallback } from 'react';
import { IApiRule } from './IRule';
import { RRule } from 'rrule';
import './Rule.css';
import { Currency } from '../../../components/currency/Currency';

function getRRuleDisplayString(rruleString: string): string {
    try {
        const rrule = RRule.fromString(rruleString);
        return rrule.toText();
    } catch (e) {
        return "(Oops, looks like an invalid recurrence rule)"
    }
}

export const Rule = ({
    rule,
    showModal = () => {}
}: {
    rule: IApiRule,
    showModal?: (id: string, rule: IApiRule) => void,
}) => {
    const editButtonHandler = useCallback(() => showModal(rule.id, rule), [rule, showModal])
    const rruleString = getRRuleDisplayString(rule.rrule);
    return <div className="ruledescription p-2" onClick={editButtonHandler}>
        <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group mr-2" role="group" aria-label="First group">
                <div className="rulename">
                    <h5 className="m-0" title={rule.name}>{rule.name}</h5>
                </div>
            </div>

            <div className="btn-group mr-2" role="group" aria-label="Second group">
                <Currency value={rule.value} />
            </div>
        </div>
        <p className="m-0">{rruleString}</p>
    </div>;
}
