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

export function setDaysOfWeek(formElement: any, daysOfWeek: string[]) {
    const buttons: HTMLButtonElement[] = Array.from(formElement.container.querySelectorAll("[data-testid=dayofweekcontrol] > button"));
    daysOfWeek.forEach(d => {
        const buttonForDay = buttons.find(b => {
            return b.getAttribute("data-dayofweek") === d
        });
        fireEvent.click(buttonForDay);
    });
}

export function setStartDate(formElement: any, year: number, month: number, day: number) {
    const startDateInput = formElement.getByLabelText(/Start/i);
    expect(startDateInput).toBeInTheDocument();
    fireEvent.change(startDateInput, { target: { value: `${year}-${month}-${day}` } });
}

export function clearStartDate(formElement: any) {
    const startDateInput = formElement.getByLabelText(/Start/i);
    expect(startDateInput).toBeInTheDocument();
    fireEvent.change(startDateInput, { target: { value: `` } });
}

export function submit(formElement: any) {
    const submitButton = formElement.getByRole("button", { name: /Submit/i });
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);
}

export function update(formElement: any) {
    const updateButton = formElement.getAllByRole("button", { name: /Update/i })[0];
    expect(updateButton).toBeInTheDocument();
    fireEvent.click(updateButton);
}

it('should have a functioning test framework', () => {
    expect(true).toBe(true);
});
