import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import { TransactionsContainer } from './TransactionsContainer';

jest.mock('axios');


function defer() {
    let resolve: (response: any) => void = (r) => { throw new Error(`You called 'resolve' too early! We received this: ${r}`) };
    let reject: (error: any) => void = (e) => { throw new Error(`You called 'reject' too early! We received this: ${e}`) };
    const promise = new Promise<any>((res, rej) => {
        reject = rej;
        resolve = res;
    })
    return { promise, reject, resolve };
}

describe('transactions container', () => {
    let element: ReturnType<typeof render>;
    let resolve: ReturnType<typeof defer>['resolve'];
    let reject: ReturnType<typeof defer>['reject'];

    beforeEach(() => {
        const deferral = defer();
        require('axios').default.get.mockReturnValue(deferral.promise);
        resolve = deferral.resolve;
        reject = deferral.reject;
    })

    function setUp() {
        element = render(<TransactionsContainer />);
    }

    it('should render', () => {
        setUp();
        expect(element).toBeDefined();
    });

    it('should render an empty list', () => {
        setUp();
        expect(element).toBeDefined();
    });
});
