import React, { useCallback, useEffect, useState } from 'react'
import { RRule } from 'rrule';
import ListGroup from 'react-bootstrap/ListGroup';
import { IApiRule } from './IRule';
import { Rule } from './Rule';


export const RulesContainer = () => {
    // TODO(jamesfulford): When APIs ready, remove mock data
    const [rules, setRules] = useState<IApiRule[]>([]);
    useEffect(() => {
        const id = setTimeout(() => {
            setRules([
                {
                    id: '1',
                    userid: 'demo',
                    version: '1.0.0',
                    name: 'Rent',
                    rrule: new RRule({
                        freq: RRule.MONTHLY,
                        bymonthday: 1,

                        dtstart: new Date(Date.UTC(2012, 1, 1, 10, 30)),
                        until: new Date(Date.UTC(2020, 12, 31))
                      }).toString(),
                    value: -2000,
                },
                {
                    id: '2',
                    userid: 'demo',
                    version: '1.0.0',
                    name: 'Paycheck',
                    rrule: new RRule({
                        freq: RRule.WEEKLY,
                        interval: 2,
                        byweekday: 1,

                        dtstart: new Date(Date.UTC(2012, 1, 1, 10, 30)),
                        until: new Date(Date.UTC(2020, 12, 31))
                      }).toString(),
                    value: 1500,
                },
            ])
        }, 300);
        return () => clearTimeout(id);
    }, []);

    // TODO(jamesfulford): When DELETE API is ready, call it here
    const deleteHandler = useCallback((id: string) => console.log("DELETE", id), []);

    return <ListGroup>
        {rules.map(rule => <Rule rule={rule} onDelete={deleteHandler} key={rule.id}/>)}
    </ListGroup>;
}
