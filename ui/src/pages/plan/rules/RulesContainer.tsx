import React, { useCallback } from 'react'
import ListGroup from 'react-bootstrap/ListGroup';
import { IApiRule, IApiRuleMutate } from './IRule';
import { Rule } from './Rule';
import {CreateForm} from './CreateRuleForm';
import useAxios from 'axios-hooks'
import axios from 'axios';

const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

// TODO: get from login
const userid = 'test'

export const RulesContainer = () => {
    const [{ data, loading, error }, refetch] = useAxios(
        `${baseUrl}/api/rules?userid=${userid}`
    )

    const deleteHandler = useCallback((id: string) => {
        axios.delete(`${baseUrl}/api/rules/${id}?userid=${userid}`)
            .then(() => {
                refetch();
            })
            .catch((e) => {
                // TODO: toast an error
                console.error('UHOH', e);
            })
    }, [refetch]);

    const createNewRule = useCallback((rule: IApiRuleMutate) => {
        axios.post(`${baseUrl}/api/rules?userid=${userid}`, rule)
            .then((response) => {
                console.log('Created rule', response.data);
                refetch();
            })
    }, [refetch]);
    const onFailedValidation = useCallback((message: string) => console.log('Bad input', message), []);

    if (loading) {
        return <>
            <CreateForm onSubmit={createNewRule} onFailedValidation={onFailedValidation} />
            <p data-testid="rules-loading">Loading...</p>
        </>
    }
    
    if (error) {
        return <>
            <CreateForm onSubmit={createNewRule} onFailedValidation={onFailedValidation} />
            <p data-testid="rules-load-error">Oops! Looks like we can't get your rules right now. Try reloading the page.</p>
        </>
    }

    const rules = data.data as IApiRule[]

    if (!rules?.length) { // empty
        return <>
            <CreateForm onSubmit={createNewRule} onFailedValidation={onFailedValidation} />
            <h3 data-testid="no-rules-found">Looks like nothing's here. Try creating a rule!</h3>
        </>
    }
    
    return <>
        <CreateForm onSubmit={createNewRule} onFailedValidation={onFailedValidation} />
        <ListGroup>
            {rules.map(rule => <Rule rule={rule} onDelete={deleteHandler} key={rule.id}/>)}
        </ListGroup>
    </>;
}
