import React from 'react';
import { render } from '@testing-library/react'

import { Currency } from './Currency';

describe("Currency formatter", () => {
    it('should format negative numbers', () => {
        const { container } = render(<Currency value={-1} />);
        const span = container.querySelector("span");

        expect(span.className).toBe("currency-negative");
        expect(span.textContent).toBe('-$1.00');
    });

    it('should format positive numbers', () => {
        const { container } = render(<Currency value={1} />);
        const span = container.querySelector("span");

        expect(span.className).toBe("currency-positive");
        expect(span.textContent).toBe('$1.00');
    });

    it('should format decimal numbers', () => {
        const { container } = render(<Currency value={1.01} />);
        const span = container.querySelector("span");

        expect(span.textContent).toBe('$1.01');
    });

    it('should format to 2 decimal places with rounding', () => {
        const { container } = render(<Currency value={1.001} />);
        const span = container.querySelector("span");

        expect(span.textContent).toBe('$1.00');
    });
});
