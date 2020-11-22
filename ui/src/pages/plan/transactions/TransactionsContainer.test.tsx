import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import { TransactionsContainer } from './TransactionsContainer';
import { IApiTransaction } from './ITransaction';

jest.mock('axios-hooks');

describe('transactions container', () => {
    let element: ReturnType<typeof render>;
    let mockRefetch: jest.MockedFunction<() => void>;
    let axiosDelete: jest.MockedFunction<() => Promise<void>>;

    function setUp(transactions?: IApiTransaction[], loading: boolean = false, error: boolean = false) {
        mockRefetch = jest.fn();
        require('axios-hooks').default.mockReturnValue([
            { data: { transactions }, loading, error },
            mockRefetch
        ]);
        element = render(<TransactionsContainer currentTime={1} />);
        axiosDelete = require('axios').default.delete
    }

    function transactionsEmpty() {
        try {
            return element.getByTestId('transactions-empty');
        } catch (e) {
            return undefined;
        }
    }

    function transactionsError() {
        try {
            return element.getByTestId('transactions-error');
        } catch (e) {
            return undefined;
        }
    }

    function transactionsLoading() {
        try {
            return element.getByTestId('transactions-loading');
        } catch (e) {
            return undefined;
        }
    }

    function transactionsShowing() {
        try {
            return element.getByTestId('transactions-showing');
        } catch (e) {
            return undefined;
        }
    }

    it('should render an empty list', () => {
        setUp([]);
        expect(element).toBeDefined();
    });

    describe('list transactions', () => {
        it('should show no transactions message if list is empty', () => {
            setUp([]);
    
            expect(transactionsEmpty()).toBeDefined();
            expect(transactionsLoading()).not.toBeDefined();
            expect(transactionsError()).not.toBeDefined();
        });
    
        it('should show loading symbol when loading', () => {
            setUp(undefined, true);
    
            expect(transactionsError()).not.toBeDefined();
            expect(transactionsLoading()).toBeDefined();
            expect(transactionsShowing()).not.toBeDefined();
        });
    
        it('should show error symbol when error', () => {
            setUp(undefined, false, true);
            expect(transactionsEmpty()).not.toBeDefined();
            expect(transactionsLoading()).not.toBeDefined();
            expect(transactionsError()).toBeDefined();
        });
    
        it('should list all transactions', () => {
            setUp([{
                rule_id: 'Rent',
                id: 'rent-1',
                value: -2000,
                day: '1970-01-01',
                calculations: {
                    balance: 1337,
                    working_capital: 1000,
                }
            }, {
                rule_id: 'Paycheck',
                id: 'paycheck-1',
                value: 2000,
                day: '1970-01-05',
                calculations: {
                    balance: 3337,
                    working_capital: 1000,
                }
            }]);
            expect(transactionsEmpty()).not.toBeDefined();
            expect(transactionsLoading()).not.toBeDefined();
            expect(transactionsError()).not.toBeDefined();
    
            const transactionElements: any[] = Array.from(element.container.querySelectorAll('tbody > tr'));
            expect(transactionElements).toHaveLength(2);
            expect(transactionElements[0].textContent).toContain('Rent');
            expect(transactionElements[1].textContent).toContain('Paycheck');
        });

        it('should not list transactions over 3 months', () => {
            setUp([{
                rule_id: 'Rent',
                id: 'rent-1',
                value: -2000,
                day: '1970-04-02', // 1 day more than 3 months later
                calculations: {
                    balance: 1337,
                    working_capital: 1000,
                }
            }, {
                rule_id: 'Paycheck',
                id: 'paycheck-1',
                value: 2000,
                day: '1970-04-02',
                calculations: {
                    balance: 3337,
                    working_capital: 1000,
                }
            }]);
            expect(transactionsEmpty()).toBeDefined();
            expect(transactionsLoading()).not.toBeDefined();
            expect(transactionsError()).not.toBeDefined();
        });

        it('should not list over 100 transactions at once', () => {
            // Create 120 transactions (more than 100)
            const transactions: IApiTransaction[] = Array.from([ ...Array(120) ]).map((_, i) => i)
                .map(i => ({
                    rule_id: `Rule #${i}`,
                    id: `Rule id #${i}`,
                    value: 1000,
                    day: '1970-01-02',
                    calculations: {
                        balance: 123,
                        working_capital: 121323,
                    }
                }))

            setUp(transactions);
            expect(transactionsEmpty()).not.toBeDefined();
            expect(transactionsLoading()).not.toBeDefined();
            expect(transactionsError()).not.toBeDefined();
            const transactionElements: any[] = Array.from(element.container.querySelectorAll('tbody > tr'));
            expect(transactionElements).toHaveLength(100); // not 120, 100.
        });
    });
});
