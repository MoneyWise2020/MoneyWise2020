import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

    function setMonthOfYear(month: number) {
        const dayOfMonthInput = element.getByLabelText(/Month of Year/i);
        expect(dayOfMonthInput).toBeInTheDocument();
        fireEvent.change(dayOfMonthInput, { target: { value: String(month) }});
    }

    function setDaysOfWeek(daysOfWeek: string[]) {
        const dayOfWeekSelect = element.getByLabelText(/Days of Week/i);
        expect(dayOfWeekSelect).toBeInTheDocument();
        userEvent.selectOptions(dayOfWeekSelect, daysOfWeek);
    }

    function setStartDate(year: number, month: number, day: number) {
        const startDateInput = element.getByLabelText(/Start/i);
        expect(startDateInput).toBeInTheDocument();
        fireEvent.change(startDateInput, { target: { value: `${year}-${month}-${day}` } });
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

    describe("weekly", () => {
        it('should submit for multiple days', () => {
            setName("Gas");
            setValue(-25);
    
            selectFrequency("WEEKLY");
            setDaysOfWeek(['MONDAY', 'TUESDAY']);
    
            submit();
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const rule = submitHandler.mock.calls[0][0];
            expect(rule).toEqual(expect.objectContaining({
                name: 'Gas',
                value: -25
            }));
            expect(rule.rrule).toMatchSnapshot();
        });
    });

    describe("biweekly", () => {
        it('should submit', () => {
            setName("Paycheck");
            setValue(1800);
    
            selectFrequency("BIWEEKLY");
            setStartDate(2020, 10, 10);

            submit();
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const rule = submitHandler.mock.calls[0][0];
            expect(rule).toEqual(expect.objectContaining({
                name: 'Paycheck',
                value: 1800,
            }));
            expect(rule.rrule).toMatchSnapshot();
        });

        it('should not submit without start date', () => {
            setName("Paycheck");
            setValue(1800);
    
            selectFrequency("BIWEEKLY");

            submit();
    
            expect(submitHandler).not.toHaveBeenCalled();
            expect(failureHandler).toHaveBeenCalledTimes(1);
            expect(failureHandler).toHaveBeenCalledWith("You must select a start date for 'Biweekly' rules");
        });
    });

    describe("monthly", () => {
        it('should submit', () => {
            setName("Rent");
            setValue(-1000);
    
            selectFrequency("MONTHLY");
            setDayOfMonth(15);
    
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

    describe("yearly", () => {
        it('should submit', () => {
            setName("Birthday Present!");
            setValue(-42);
    
            selectFrequency("YEARLY");
            setMonthOfYear(10);
            setDayOfMonth(1);
    
            submit();
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const rule = submitHandler.mock.calls[0][0];
            expect(rule).toEqual(expect.objectContaining({
                name: 'Birthday Present!',
                value: -42
            }));
            expect(rule.rrule).toMatchSnapshot();
        });
    });

    describe("once", () => {
        // TODO(jamesfulford): Why is this not passing?
        xit('should submit', () => {
            setName("Haaaaahvaaaahd Tuition");
            setValue(-2900);
    
            selectFrequency("ONCE");
            setStartDate(2020, 11, 8);
    
            submit();
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const rule = submitHandler.mock.calls[0][0];
            expect(rule).toEqual(expect.objectContaining({
                name: 'Haaaaahvaaaahd Tuition',
                value: -2900
            }));
            expect(rule.rrule).toMatchSnapshot();
        });
    });
});
