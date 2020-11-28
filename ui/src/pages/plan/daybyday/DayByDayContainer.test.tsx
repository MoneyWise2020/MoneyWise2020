import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import { DayByDayContainer } from './DayByDayContainer';
import { IApiTransaction } from './ITransaction';

jest.mock('axios-hooks');

describe('transactions container', () => {
    let element: ReturnType<typeof render>;
    let mockRefetch: jest.MockedFunction<() => void>;
    let axiosDelete: jest.MockedFunction<() => Promise<void>>;

    function setUp(daybydays?: object, loading: boolean = false, error: boolean = false) {
        mockRefetch = jest.fn();
        require('axios-hooks').default.mockReturnValue([
            { data: { daybydays }, loading, error },
            mockRefetch
        ]);
        element = render(<DayByDayContainer currentTime={1} />);
        axiosDelete = require('axios').default.delete
    }

    function dayByDayError() {
        try {
            return element.getByTestId('daybyday-error');
        } catch (e) {
            return undefined;
        }
    }

    function dayByDayLoading() {
        try {
            return element.getByTestId('daybyday-loading');
        } catch (e) {
            return undefined;
        }
    }

    function dayByDayShowing() {
        try {
            return element.getByTestId('daybyday-showing');
        } catch (e) {
            return undefined;
        }
    }

    it('should render an empty list', () => {
        setUp([]);
        expect(element).toBeDefined();
    });

    describe('render daybydays', () => {
        it('should show no daybydays if payload is empty', () => {
            setUp([]);
    
            expect(dayByDayLoading()).not.toBeDefined();
            expect(dayByDayError()).not.toBeDefined();
        });
    
        it('should show loading symbol when loading', () => {
            setUp(undefined, true);
    
            expect(dayByDayError()).not.toBeDefined();
            expect(dayByDayLoading()).toBeDefined();
            expect(dayByDayShowing()).not.toBeDefined();
        });
    
        it('should show error symbol when error', () => {
            setUp(undefined, false, true);
            expect(dayByDayLoading()).not.toBeDefined();
            expect(dayByDayError()).toBeDefined();
        });

        it('should not show entries over 2 years from now', () => {
            setUp([{
                "date": "1970-01-01",
                "balance": {
                    "low": 0.0,
                    "high": 0.0
                },
                "working_capital": {
                    "low": 0.0,
                    "high": 0.0
                }
            },
            {
                "date": "1972-01-05",
                "balance": {
                    "low": 0.0,
                    "high": 234.0
                },
                "working_capital": {
                    "low": -1766.0,
                    "high": -1766.0
                }
            }]);
            expect(dayByDayLoading()).not.toBeDefined();
            expect(dayByDayError()).not.toBeDefined();
        });
    });
});
