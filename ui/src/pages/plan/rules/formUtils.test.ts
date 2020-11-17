import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export function setName(formElement: any, name: string) {
    const nameInput = formElement.getByLabelText(/Name/i);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: name }});
}

export function setValue(formElement: any, value: number) {
    const valueInput = formElement.getByLabelText(/Value/i);
    expect(valueInput).toBeInTheDocument();
    fireEvent.change(valueInput, { target: { value: String(value) }});
}

export function selectFrequency(formElement: any, frequency: string) {
    const frequencyInput = formElement.getByLabelText(/Frequency/i);
    expect(frequencyInput).toBeInTheDocument();
    fireEvent.change(frequencyInput, { target: { value: frequency }});
}

export function setDayOfMonth(formElement: any, day: number) {
    const dayOfMonthInput = formElement.getByLabelText(/Day of month/i);
    expect(dayOfMonthInput).toBeInTheDocument();
    fireEvent.change(dayOfMonthInput, { target: { value: String(day) }});
}

export function setMonthOfYear(formElement: any, month: number) {
    const dayOfMonthInput = formElement.getByLabelText(/Month of Year/i);
    expect(dayOfMonthInput).toBeInTheDocument();
    fireEvent.change(dayOfMonthInput, { target: { value: String(month) }});
}

export function setDaysOfWeek(formElement: any, daysOfWeek: string[]) {
    const dayOfWeekSelect = formElement.getByLabelText(/Days of Week/i);
    expect(dayOfWeekSelect).toBeInTheDocument();
    userEvent.selectOptions(dayOfWeekSelect, daysOfWeek);
}

export function setStartDate(formElement: any, year: number, month: number, day: number) {
    const startDateInput = formElement.getByLabelText(/Start/i);
    expect(startDateInput).toBeInTheDocument();
    fireEvent.change(startDateInput, { target: { value: `${year}-${month}-${day}` } });
}

export function submit(formElement: any) {
    const submitButton = formElement.getByRole("button", { name: /Submit/i });
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);
}

it('should have a functioning test framework', () => {
    // TODO: revert to this once we have a link to a red build
    // expect(true).toBe(true);
    expect(true).toBe(false);
});
