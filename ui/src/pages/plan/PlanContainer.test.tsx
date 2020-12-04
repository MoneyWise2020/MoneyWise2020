import React from 'react';
import { render } from '@testing-library/react'

jest.mock("@auth0/auth0-react")
jest.mock('./getTokenHook')

import { useAuth0 } from '@auth0/auth0-react';
import { useToken } from './getTokenHook';
import { PlanContainer } from './PlanContainer';

describe('plan container', () => {
    function setAuth({ user = { name: 'James', userid: "user#1" }, loading=false, isAuthenticated=true }) {
        (useAuth0 as jest.MockedFunction<() => any>).mockReturnValue({
            user: { given_name: user?.name, sub: user?.userid },
            isLoading: loading,
            isAuthenticated,
        });
        (useToken as jest.MockedFunction<() => any>).mockReturnValue('token');
    }

    it('should render if authenticated', () => {
        setAuth({})
        const { getByText } = render(<PlanContainer />);
        const transactionsHeader = getByText(/Transactions/i);
        expect(transactionsHeader).toBeInTheDocument();
    });

    it('should render nothing if loading', () => {
        setAuth({ loading: true })
        const element = render(<PlanContainer />);
        expect(element.container.textContent).toBe('');
    });

    it('should render login button if no login', () => {
        setAuth({ loading: false, isAuthenticated: false })
        const { getByText } = render(<PlanContainer />);
        const loginButton = getByText(/Login/i);
        expect(loginButton).toBeInTheDocument();
    });
});
