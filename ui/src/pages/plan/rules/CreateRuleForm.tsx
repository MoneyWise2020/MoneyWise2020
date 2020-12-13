import React, { useState } from 'react';
import RRule from 'rrule';
import { IApiRuleMutate } from './IRule';
import './CreateRuleForm.css'

export const CreateForm = ({
    onSubmit,
    onFailedValidation = () => {}
}: {
    onSubmit: (rule: IApiRuleMutate) => void,
    onFailedValidation: (message: string) => void,
}) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState<number | undefined>(undefined);
    const [frequency, setFrequency] = useState<string>("MONTHLY");

    const [bymonthday, setbymonthday] = useState<number | undefined>(undefined);
    const [weekdays, setWeekdays] = useState<string[]>([]);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    function clearForm() {
        setName('');
    }
    
    return <form 
        style={{ width: '100%' }}
        onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) {
            onFailedValidation(`Please enter a non zero value`);
            return;
        }

        if (name.length < 3) {
            onFailedValidation(`Please enter more than 3 characters, you entered '${name}'`);
            return;
        }

        const dtstart = startDate ? new Date(startDate) : undefined;
        const until = endDate ? new Date(endDate) : undefined;

        let options = {};

        switch (frequency) {
            case "BIWEEKLY":
                if (!dtstart) {
                    onFailedValidation("You must select a start date for 'Biweekly' rules");
                    return;
                }
                options = {
                    freq: RRule.WEEKLY,
                    interval: 2,
                    dtstart,
                    until,
                };
                break;
            case "WEEKLY":
                const weekdayToRRuleWeekdayMapping: { [key: string]: any } = {
                    "SUNDAY": RRule.SU,
                    "MONDAY": RRule.MO,
                    "TUESDAY": RRule.TU,
                    "WEDNESDAY": RRule.WE,
                    "THURSDAY": RRule.TH,
                    "FRIDAY": RRule.FR,
                    "SATURDAY": RRule.SA,
                }
                const rruleWeekdays = weekdays.map(w => weekdayToRRuleWeekdayMapping[w]);
                options = {
                    freq: RRule.WEEKLY,
                    byweekday: rruleWeekdays,
                    dtstart,
                    until,
                };
                break;
            case "MONTHLY":
                if (!bymonthday) {
                    onFailedValidation("You must select a day of month for 'monthly' rules");
                    return;
                }
                options = {
                    freq: RRule.MONTHLY,
                    bymonthday: bymonthday,
                    dtstart,
                    until,
                }
                break;
            case "YEARLY":
                if (!dtstart) {
                    onFailedValidation("You must select a start date for 'Yearly' rules");
                    return;
                }
                options = {
                    freq: RRule.YEARLY,
                    dtstart,
                    until,
                }
                break;
            case "ONCE":
                if (!dtstart) {
                    onFailedValidation("You must select a start date for 'Once' rules");
                    return;
                }
                options = {
                    freq: RRule.YEARLY,
                    dtstart,
                    count: 1,
                };
                break;
        }

        // Success

        const rruleString = new RRule(options).toString()

        onSubmit({
            name: name,
            value: value,
            rrule: rruleString,
        });

        clearForm();
    }}>
        <div className="form-inline d-flex justify-content-between">
            <label htmlFor="Name" className="sr-only">Rule name</label>
            <input className="form-control form-control-sm" id="Name" placeholder="Rule name" type="text" value={name} onChange={e => setName(e.target.value)} />

            <label htmlFor="Value" className="sr-only">Value</label>
            <input className="form-control form-control-sm" id="Value" type="number" placeholder="Value $" step="0.01" value={value} onChange={e => {
                const newValue = Number(e.target.value);
                if (newValue) { // not 0, not undefined
                    setValue(newValue)
                } else {
                    setValue(undefined)
                }
            }} />
        </div>

        {/* Recurrence-rule specific logics */}
        <div className="form-inline mt-2 d-flex justify-content-between">
            {/* Frequency selector */}
            <label htmlFor="Frequency" className="sr-only">Frequency</label>   
            <select className="form-control form-control-sm" id="Frequency" name="frequency" onChange={e => setFrequency(e.target.value)} value={frequency} >
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Biweekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="ONCE">Once</option>
            </select>
        
            {/* Monthly day-of-month selector */}
            {(frequency === "MONTHLY") && <>
                <label htmlFor="bymonthday" className="sr-only">Day of month</label>
                <input className="form-control form-control-sm" id="bymonthday" type="number" min="1" max="31" placeholder="Day" style={{ width: 64 }}
                    value={bymonthday} required onChange={e => {
                        const newMonthDay = Number(e.target.value);
                        if (newMonthDay) { // not 0, not undefined
                            setbymonthday(newMonthDay)
                        } else {
                            setbymonthday(undefined)
                        }
                    }} />
            </>}
        
            {(frequency === "WEEKLY") && <div role="group" className="btn-group" aria-label="Days of Week" data-testid="dayofweekcontrol">
                {[
                    "SUNDAY",
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                ].map(day => <button 
                    className={"btn btn-sm " + (weekdays.includes(day) ? 'btn-primary' : 'btn-outline-primary')}
                    data-dayofweek={day}
                    key={day}
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setWeekdays(weekdays => {
                            if (weekdays.includes(day)) {
                                // Remove from list
                                return [...weekdays.filter(d => d !== day)]
                            }
                            // Add to list
                            return [...weekdays, day]
                        })
                    }}>
                    {day[0]}
                </button>)}
            </div>}
        </div>

        <div className="form-inline mt-2 d-flex justify-content-between">
            {/* Start Date */}
            <label htmlFor="Start" className="sr-only">Start:</label>
            <input className="form-control form-control-sm mr-2" placeholder="Start Date" type="date" name="Start" id="Start" required={["BIWEEKLY", "YEARLY", "ONCE"].includes(frequency)} value={startDate} onChange={e => setStartDate(e.target.value)} />

            {/* End Date */}
            {frequency !== "ONCE" && <>
                <label htmlFor="End" className="sr-only">End:</label>
                <input className="form-control form-control-sm" placeholder="End Date" type="date" name="End" id="End" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </>}
        </div>

    
        <div className="d-flex flex-row-reverse">
            <button className="btn btn-outline-primary btn-sm mb-2 mt-2">Submit</button>
        </div>
    </form>
}
