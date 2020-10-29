import React, {useEffect, useState} from 'react';

import { useAuth0 } from "@auth0/auth0-react";
import { getEvents } from './events';

import { RRule } from 'rrule';
 
// Create a rule:
const rule = new RRule({
  freq: RRule.WEEKLY,
  interval: 5,
  byweekday: [RRule.MO, RRule.FR],
  dtstart: new Date(Date.UTC(2012, 1, 1, 10, 30)),
  until: new Date(Date.UTC(2020, 12, 31))
});


export const Results = () => {
    const { getIdTokenClaims } = useAuth0();
    const [idToken, setIdToken] = useState('');
    const [events, setEvents] = useState();

    useEffect(() => {
        (async () => {
          try {
            setIdToken((await getIdTokenClaims()).__raw);
          } catch (e) {
            console.error(e);
          }
        })();
      }, [getIdTokenClaims, idToken]);

      useEffect(() => {
          if (!idToken) return;
        getEvents({
            'rule-1': {
                rule: rule.toString(),
                value: 100,
            }
        }, idToken).then(setEvents);
      }, [idToken]);

    return <code>{JSON.stringify(events)}</code>
}