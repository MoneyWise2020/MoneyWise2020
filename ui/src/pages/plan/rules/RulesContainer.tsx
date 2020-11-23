import React, { useCallback } from 'react'
import ListGroup from 'react-bootstrap/ListGroup';
import { IApiRule, IApiRuleMutate } from './IRule';
import { Rule } from './Rule';
import {CreateForm} from './CreateRuleForm';
import useAxios from 'axios-hooks'
import { Modal } from './RuleModal'
import axios from 'axios';

const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

// TODO: get from login
const userid = 'test'
// Modal Interactions
let isShown = false;
let modal;
let closeButton;
let modalRule: IApiRuleMutate;
let modalRuleId;

export const RulesContainer = ({ onRefresh = () => {} }: { onRefresh?: () => void }) => {
    const [{ data, loading, error }, refetch] = useAxios(
        `${baseUrl}/api/rules?userid=${userid}`
    )

    const triggerRefresh = useCallback(() => {
        refetch()
        onRefresh()
    }, [refetch, onRefresh])

    const deleteHandler = useCallback((id: string) => {
        axios.delete(`${baseUrl}/api/rules/${id}?userid=${userid}`)
            .then(() => {
                triggerRefresh();
            })
            .catch((e) => {
                // TODO: toast an error
                console.error('UHOH', e);
            })
    }, [triggerRefresh]);

    const createNewRule = useCallback((rule: IApiRuleMutate) => {
        axios.post(`${baseUrl}/api/rules?userid=${userid}`, rule)
            .then((response) => {
                console.log('Created rule', response.data);
                triggerRefresh();
            })
    }, [triggerRefresh]);

    const updateExistingRule = useCallback((id:string, rule: IApiRuleMutate) => {
        axios.put(`${baseUrl}/api/rules?userid=${userid}`, rule)
        .then((response) => {
            console.log('Updated rule', response.data);
            triggerRefresh();
        })
        .catch((e) => {
            // TODO: toast an error
            console.error('UHOH', e);
        })
    }, [triggerRefresh])
    
    const showModal = useCallback((id: string, rule: IApiRuleMutate) => {
        isShown = true;
        modalRule = rule;
        modalRuleId = id;
        console.log("yoyo");
        triggerRefresh();
        toggleScrollLock();
    }, [triggerRefresh]);
    
    const toggleScrollLock = () => {
        const allcontent = document.querySelector('html')
        
        if (allcontent) {
            allcontent.classList.toggle('scroll-lock');
        }
    };

    const onKeyDown = (event: any) => {
        if (event.keyCode === 27) {
            closeModal();
          }
         };

    const onClickOutside = (event: any) => {
        // if (modal && modal.contains(event.target)) return
        // closeModal();
};
    
    const closeModal = useCallback(() => {
        isShown = false;
        // this.TriggerButton.focus();
        toggleScrollLock();
        triggerRefresh();
    }, [triggerRefresh]);


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

        {isShown ? (
                <Modal
                    rule={modalRule} 
                    onSubmit={() => updateExistingRule}
                    modalRef={(n: any) => (modal = n)}
                    buttonRef={(n: any) => (closeButton = n)} 
                    closeModal={closeModal}
                    onKeyDown={onKeyDown}
                    onClickOutside={onClickOutside}
                />
                ) : null
            }

        <ListGroup>
            {rules.map(rule => <Rule rule={rule} onDelete={deleteHandler} onUpdate={updateExistingRule} showModal={showModal} key={rule.id}/>)}
        </ListGroup>
    </>;
}
