import React, { useCallback } from 'react'
import { IApiRule, IApiRuleMutate } from './IRule';
import { Rule } from './Rule';
import {CreateForm} from './CreateRuleForm';
import useAxios from 'axios-hooks'
import { Modal } from './RuleModal'
import axios from 'axios';
import sortBy from 'lodash/sortBy';



const baseUrl = process.env.REACT_APP_MONEYWISE_BASE_URL;

// Modal Interactions
let isShown = false;
let modalRule: IApiRule;

export const RulesContainer = ({ userid, onRefresh = () => {} }: { userid: string, onRefresh?: () => void }) => {
    const [{ data, loading, error }, refetch] = useAxios(
        `${baseUrl}/api/rules?userid=${userid}`
    )

    const triggerRefresh = useCallback(() => {
        refetch()
        onRefresh()
    }, [refetch, onRefresh])

    const createNewRule = useCallback((rule: IApiRuleMutate) => {
        axios.post(`${baseUrl}/api/rules?userid=${userid}`, rule)
            .then((response) => {
                console.log('Created rule', response.data);
                triggerRefresh();
            })
    }, [triggerRefresh, userid]);
    
    const showModal = useCallback((id: string, rule: IApiRule) => {
        isShown = true;
        modalRule = rule;
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
        if (event.keyCode === 27) { // escape
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

    const deleteHandler = useCallback((id: string) => {
        axios.delete(`${baseUrl}/api/rules/${id}?userid=${userid}`)
            .then(() => {
                triggerRefresh();
                closeModal();
            })
            .catch((e) => {
                // TODO: toast an error
                console.error('UHOH', e);
            })
    }, [triggerRefresh, closeModal]);

    const updateExistingRule = useCallback((id: string, rule: IApiRuleMutate) => {
        axios.put(`${baseUrl}/api/rules/${id}?userid=${userid}`, rule)
        .then((response) => {
            console.log('Updated rule', response.data);
            closeModal();
            triggerRefresh();
        })
        .catch((e) => {
            // TODO: toast an error
            console.error('UHOH', e);
        })
    }, [triggerRefresh, closeModal, userid])


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

    const sortedRules = sortBy(rules, (r: IApiRule) => r.value);
    
    return <>
        <CreateForm onSubmit={createNewRule} onFailedValidation={onFailedValidation} />
        
        {isShown ? (
                <Modal
                    rule={modalRule} 
                    onSubmit={updateExistingRule}
                    onDelete={deleteHandler}
                    modalRef={(n: any) => {}}
                    buttonRef={(n: any) => {}} 
                    closeModal={closeModal}
                    onKeyDown={onKeyDown}
                    onClickOutside={onClickOutside}
                />
                ) : null
            }

        <div style={{ width: '100%', minWidth: "100%", maxWidth: "100%" }}>
            {sortedRules.map(rule => <Rule rule={rule} showModal={showModal} key={rule.id}/>)}
        </div>
    </>;
}
