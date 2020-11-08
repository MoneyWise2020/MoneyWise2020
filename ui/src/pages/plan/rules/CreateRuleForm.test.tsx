import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import { CreateForm } from './CreateRuleForm';
import { IApiRuleMutate } from './IRule';

describe('create rule form', () => {
    let submitHandler: jest.MockedFunction<(rule: IApiRuleMutate) => void>;
    let failureHandler: jest.MockedFunction<(message: string) => void>;
    let element: ReturnType<typeof render>;

    beforeEach(() => {
        submitHandler = jest.fn();
        failureHandler = jest.fn();
        element = render(<CreateForm onSubmit={submitHandler} onFailedValidation={failureHandler} />);
    });

    function setName(name: string) {
        const nameInput = element.getByLabelText(/Name/i);
        expect(nameInput).toBeInTheDocument();
        fireEvent.change(nameInput, { target: { value: name }});
    }

    function setValue(value: number) {
        const valueInput = element.getByLabelText(/Value/i);
        expect(valueInput).toBeInTheDocument();
        fireEvent.change(valueInput, { target: { value: String(value) }});
    }

    function selectFrequency(frequency: string) {
        const frequencyInput = element.getByLabelText(/Frequency/i);
        expect(frequencyInput).toBeInTheDocument();
        fireEvent.change(frequencyInput, { target: { value: frequency }});
    }

    function setDayOfMonth(day: number) {
        const dayOfMonthInput = element.getByLabelText(/Day of month/i);
        expect(dayOfMonthInput).toBeInTheDocument();
        fireEvent.change(dayOfMonthInput, { target: { value: String(day) }});
    }

    function submit() {
        const submitButton = element.getByRole("button", { name: /Submit/i });
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);
    }

    it('should render', () => {
        expect(element).not.toBeUndefined();
        expect(submitHandler).not.toHaveBeenCalled();
    });

    it('should not allow short names', () => {
        setName("1"); // Should be longer name
        setValue(-1000);

        selectFrequency("MONTHLY");
        setDayOfMonth(1);

        submit();

        expect(submitHandler).not.toHaveBeenCalled();
        expect(failureHandler).toHaveBeenCalledTimes(1);
        expect(failureHandler).toHaveBeenCalledWith(`Please enter more than 3 characters, you entered '1'`);
    });

    it('should not allow 0 value', () => {
        setName("Rent");
        setValue(0);

        selectFrequency("MONTHLY");
        setDayOfMonth(1);

        submit();

        expect(submitHandler).not.toHaveBeenCalled();
        expect(failureHandler).toHaveBeenCalledTimes(1);
        expect(failureHandler).toHaveBeenCalledWith(`Please enter a non zero value`);
    });

    describe("monthly", () => {
        it('should submit monthly expense', () => {
            setName("Rent");
            setValue(-1000);
    
            selectFrequency("MONTHLY");
            setDayOfMonth(1);
    
            submit();
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const rule = submitHandler.mock.calls[0][0];
            expect(rule).toEqual(expect.objectContaining({
                name: 'Rent',
                value: -1000
            }));
            expect(rule.rrule).toMatchSnapshot();
        });
    });
});
