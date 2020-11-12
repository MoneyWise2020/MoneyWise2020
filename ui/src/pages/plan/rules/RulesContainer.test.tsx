import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { RulesContainer } from './RulesContainer';
import { IApiRule } from './IRule';

jest.mock('axios-hooks');
jest.mock('axios');

describe('rules container', () => {
    let element: ReturnType<typeof render>;
    let mockRefetch: jest.MockedFunction<() => void>;

    function setUp(rules?: IApiRule[], loading: boolean = false, error: boolean = false) {
        mockRefetch = jest.fn();
        require('axios-hooks').default.mockReturnValue([
            { data: { data: rules }, loading, error },
            mockRefetch
        ]);
        element = render(<RulesContainer />);
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

    it('should list all rules', async () => {
        setUp([{
            id: 'test-id-rent',
            name: 'Rent',
            userid: 'test',
            rrule: 'adsf',
            value: -1000
        }]);
        // https://jestjs.io/docs/en/mock-function-api

        const promise = Promise.resolve();
        require('axios').default.delete.mockReturnValue(promise);

        const deleteButton = element.getByText(/Delete/i);
        expect(deleteButton).toBeInTheDocument();
        fireEvent.click(deleteButton);

        expect(require('axios').default.delete).toHaveBeenCalledTimes(1);

        expect(mockRefetch).toHaveBeenCalledTimes(0);
        await promise;
        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
});
