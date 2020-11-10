import React from 'react';
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App';
import { MemoryRouter } from 'react-router-dom'

describe('navigation', () => {
  it('should render homepage', () => {
    const { getByText } = render(<App />, { wrapper: MemoryRouter });
    const linkElement = getByText(/Take back your financial future/i);
    expect(linkElement).toBeInTheDocument();
  });

  it('should navigate to plan page', () => {
    const page = render(<App />, { wrapper: MemoryRouter });

    userEvent.click(page.getByText(/plan/i));

    expect(page.getByText(/Submit/i)).toBeInTheDocument();
  });
});
