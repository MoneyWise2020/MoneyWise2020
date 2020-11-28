import React from 'react';
import { render } from '@testing-library/react'

import {
    clearStartDate,
    setName,
    setValue,
    selectFrequency,
    setDayOfMonth,
    setMonthOfYear,
    setDaysOfWeek,
    setStartDate,
    update
} from './formUtils.test';

import { ModifyForm } from './ModifyRuleForm';
import { IApiRule, IApiRuleMutate } from './IRule';

describe('Modify rule form', () => {
    let submitHandler: jest.MockedFunction<(id: string, rule: IApiRuleMutate) => void>;
    let failureHandler: jest.MockedFunction<(message: string) => void>;
    let element: ReturnType<typeof render>;
    let rule: IApiRule = {
        id: "test-uuid",
        userid: "test",
        rrule: "DTSTART:20201123T142000Z\nRRULE:FREQ=YEARLY;UNTIL=20201225T142000Z;COUNT=30;INTERVAL=1;WKST=MO",
        name: "test",
        value: 20
    };

    beforeEach(() => {
        submitHandler = jest.fn();
        failureHandler = jest.fn();
        element = render(<ModifyForm rule={rule} onSubmit={submitHandler} onFailedValidation={failureHandler} />);
        
    });

    it('should render', () => {
        expect(element).not.toBeUndefined();
        expect(submitHandler).not.toHaveBeenCalled();
    });

    it('should not allow short names', () => {
        setName(element, "1"); // Should be longer name
        setValue(element, -1000);

        selectFrequency(element, "MONTHLY");
        setDayOfMonth(element, 1);

        update(element);

        expect(submitHandler).not.toHaveBeenCalled();
        expect(failureHandler).toHaveBeenCalledTimes(1);
        expect(failureHandler).toHaveBeenCalledWith(`Please enter more than 3 characters, you entered '1'`);
    });

    it('should not allow 0 value', () => {
        setName(element, "Rent");
        setValue(element, 0);

        selectFrequency(element, "MONTHLY");
        setDayOfMonth(element, 1);

        update(element);

        expect(submitHandler).not.toHaveBeenCalled();
        expect(failureHandler).toHaveBeenCalledTimes(1);
        expect(failureHandler).toHaveBeenCalledWith(`Please enter a non zero value`);
    });

    describe("weekly", () => {
        it('should submit for multiple days', () => {
            setName(element, "Gas");
            setValue(element, -25);
    
            selectFrequency(element, "WEEKLY");
            setDaysOfWeek(element, ['MONDAY', 'TUESDAY']);
    
            update(element);
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const outputrule = submitHandler.mock.calls[0][1];
            expect(outputrule).toEqual(expect.objectContaining({
                name: 'Gas',
                value: -25
            }));
            expect(outputrule.rrule).toMatchSnapshot();
        });
    });

    describe("biweekly", () => {
        it('should submit', () => {
            setName(element, "Paycheck");
            setValue(element, 1800);
    
            selectFrequency(element, "BIWEEKLY");
            setStartDate(element, 2020, 10, 10);

            update(element);
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const ouputrule = submitHandler.mock.calls[0][1];
            expect(ouputrule).toEqual(expect.objectContaining({
                name: 'Paycheck',
                value: 1800,
            }));
            expect(ouputrule.rrule).toMatchSnapshot();
        });

        it('should not submit without start date', () => {
            setName(element, "Paycheck");
            setValue(element, 1800);
            clearStartDate(element)
    
            selectFrequency(element, "BIWEEKLY");

            update(element);
    
            expect(submitHandler).not.toHaveBeenCalled();
            expect(failureHandler).toHaveBeenCalledTimes(1);
            expect(failureHandler).toHaveBeenCalledWith("You must select a start date for 'Biweekly' rules");
        });
    });

    describe("monthly", () => {
        it('should submit', () => {
            setName(element, "Rent");
            setValue(element, -1000);
    
            selectFrequency(element, "MONTHLY");
            setDayOfMonth(element, 15);
    
            update(element);
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const outputRule = submitHandler.mock.calls[0][1];
            expect(outputRule).toEqual(expect.objectContaining({
                name: 'Rent',
                value: -1000
            }));
            expect(outputRule.rrule).toMatchSnapshot();
        });
    });

    describe("yearly", () => {
        it('should submit', () => {
            setName(element, "Birthday Present!");
            setValue(element, -42);
    
            selectFrequency(element, "YEARLY");
            setMonthOfYear(element, 10);
            setDayOfMonth(element, 1);
    
            update(element);
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const outputRule = submitHandler.mock.calls[0][1];
            expect(outputRule).toEqual(expect.objectContaining({
                name: 'Birthday Present!',
                value: -42
            }));
            expect(outputRule.rrule).toMatchSnapshot();
        });
    });

    describe("once", () => {
        // TODO(jamesfulford): Why is this not passing?
        xit('should submit', () => {
            setName(element, "Haaaaahvaaaahd Tuition");
            setValue(element, -2900);
    
            selectFrequency(element, "ONCE");
            clearStartDate(element);
    
            update(element);
    
            expect(failureHandler).not.toHaveBeenCalled();
            expect(submitHandler).toHaveBeenCalledTimes(1);
    
            const outputRule = submitHandler.mock.calls[0][1];
            expect(outputRule).toEqual(expect.objectContaining({
                name: 'Haaaaahvaaaahd Tuition',
                value: -2900
            }));
            expect(outputRule.rrule).toMatchSnapshot();
        });
    });
});
