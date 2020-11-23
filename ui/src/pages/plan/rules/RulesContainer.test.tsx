import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import { RulesContainer } from './RulesContainer';
import { IApiRule } from './IRule';

import {
    setName,
    setValue,
    selectFrequency,
    setDayOfMonth
} from './formUtils.test';

jest.mock('axios-hooks');
jest.mock('axios');

describe('rules container', () => {
    let element: ReturnType<typeof render>;
    let mockRefetch: jest.MockedFunction<() => Promise<void>>;
    let axiosDelete: jest.MockedFunction<() => Promise<void>>;
    let onRefreshProp: jest.MockedFunction<() => void>;

    function setUp(rules?: IApiRule[], loading: boolean = false, error: boolean = false) {
        mockRefetch = jest.fn();
        onRefreshProp = jest.fn();
        require('axios-hooks').default.mockReturnValue([
            { data: { data: rules }, loading, error },
            mockRefetch
        ]);
        
        element = render(<RulesContainer onRefresh={onRefreshProp} />); 
        axiosDelete = require('axios').default.delete
    }

    function noRulesFound() {
        try {
            return element.getByTestId('no-rules-found');
        } catch (e) {
            return undefined;
        }
    }

    function rulesLoadError() {
        try {
            return element.getByTestId('rules-load-error');
        } catch (e) {
            return undefined;
        }
    }

    function rulesLoading() {
        try {
            return element.getByTestId('rules-loading');
        } catch (e) {
            return undefined;
        }
    }

    it('should have a working test framework', () => {
        expect(true).toBe(true);
    });

    it('should render form', () => {
        setUp();
        const submitButton = element.getByText(/Submit/i);
        expect(submitButton).toBeInTheDocument();
    });

    describe('list rules', () => {
        it('should show no rule message if list is empty', () => {
            setUp([]);
    
            expect(noRulesFound()).toBeDefined();
            expect(rulesLoading()).not.toBeDefined();
            expect(rulesLoadError()).not.toBeDefined();
        });
    
        it('should show loading symbol when loading', () => {
            setUp(undefined, true);
    
            expect(noRulesFound()).not.toBeDefined();
            expect(rulesLoading()).toBeDefined();
            expect(rulesLoadError()).not.toBeDefined();
        });
    
        it('should show error symbol when error', () => {
            setUp(undefined, false, true);
            expect(noRulesFound()).not.toBeDefined();
            expect(rulesLoading()).not.toBeDefined();
            expect(rulesLoadError()).toBeDefined();
        });
    
        it('should list all rules', () => {
            setUp([{
                id: 'test-id-rent',
                name: 'Rent',
                userid: 'test',
                rrule: 'adsf',
                value: -1000
            }, {
                id: 'test-id-grocery',
                name: 'Grocery',
                userid: 'test',
                rrule: 'adsf',
                value: -500
            }]);
            expect(noRulesFound()).not.toBeDefined();
            expect(rulesLoading()).not.toBeDefined();
            expect(rulesLoadError()).not.toBeDefined();
    
            const ruleElements: any[] = Array.from(element.container.querySelectorAll('.ruledescription'));
            expect(ruleElements).toHaveLength(2);
            expect(ruleElements[0].textContent).toContain('Rent');
            expect(ruleElements[1].textContent).toContain('Grocery');
        });
    });

    describe("delete rules", () => {
        it('should delete and refetch list when delete button is clicked', async () => {
            setUp([{
                id: 'test-id-rent',
                name: 'Rent',
                userid: 'test',
                rrule: 'adsf',
                value: -1000
            }]);
            // https://jestjs.io/docs/en/mock-function-api
    
            const promise = Promise.resolve();
            axiosDelete.mockReturnValue(promise);
    
            const deleteButton = element.getByText(/Delete/i);
            expect(deleteButton).toBeInTheDocument();
            fireEvent.click(deleteButton);
    
            expect(axiosDelete).toHaveBeenCalledTimes(1);
    
            expect(mockRefetch).toHaveBeenCalledTimes(0);
            expect(onRefreshProp).toHaveBeenCalledTimes(0);
            await promise; // let delete call finish and trigger all the `.then`s
            expect(mockRefetch).toHaveBeenCalledTimes(1);
            expect(onRefreshProp).toHaveBeenCalledTimes(1);
        });
    });

    describe('create rules', () => {

        let axiosPost: jest.MockedFunction<() => Promise<{ data: any }>>;
        beforeEach(() => {
            axiosPost = require('axios').default.post;
        })

        it('should post new rule to backend and refetch when form is submitted', async () => {
            setUp([]);

            setName(element, "Rent");
            setValue(element, -1000.10);
    
            selectFrequency(element, "MONTHLY");
            setDayOfMonth(element, 15);

            const promise = Promise.resolve({ data: 'hello' });
            axiosPost.mockReturnValue(promise);

            const submitButton = element.getByText(/Submit/i);
            fireEvent.click(submitButton);

            await promise;
            expect(axiosPost).toHaveBeenCalledTimes(1);
            expect(require('axios').default.post).toHaveBeenCalledWith(
                expect.stringContaining("api/rules"), 
                expect.objectContaining({ // the rule we're trying to create
                    name: 'Rent',
                    value: -1000.10
                }
            ));
            expect(mockRefetch).toHaveBeenCalledTimes(1);
            expect(onRefreshProp).toHaveBeenCalledTimes(1);
        });
    });

    // TODO: Get this green!
    describe('modify existing rule', () => {

        let axiosPut: jest.MockedFunction<() => Promise<{ data: any }>>;
        
        beforeEach(() => {
            axiosPut = require('axios').default.put;
        })

        it('should put a rule with an existing id to backend and refetch when form is submitted', async () => {
            setUp([{
                id: 'test-id-rent',
                name: 'Rent',
                userid: 'test',
                rrule: 'adsf',
                value: -1000
            }]);

            const editButton = element.getByText(/Edit/i);
            fireEvent.click(editButton);
            
            const updateButton = element.getByText(/Update/i);
            fireEvent.click(updateButton);
            // setName(modal, "Rent");
            // setValue(modal, -1000.10);
    
            // selectFrequency(modal, "MONTHLY");
            // setDayOfMonth(modal, 15);

            const promise = Promise.resolve({ data: 'hello' });
            axiosPut.mockReturnValue(promise);

            // const submitButton = element.getByText(/Submit/i);
            // fireEvent.click(submitButton);

            await promise;
            expect(axiosPut).toHaveBeenCalledTimes(1);
            expect(require('axios').default.post).toHaveBeenCalledWith(
                expect.stringContaining("api/rules"), 
                expect.objectContaining({ // the rule we're trying to create
                    name: 'Rent',
                    value: -1000.10
                }
            ));
            expect(mockRefetch).toHaveBeenCalledTimes(1);
            expect(onRefreshProp).toHaveBeenCalledTimes(1);
        });
    });
});
