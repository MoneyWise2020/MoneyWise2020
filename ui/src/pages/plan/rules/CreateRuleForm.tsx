import React, { useState } from 'react';
import RRule from 'rrule';
import { IApiRuleMutate } from './IRule';

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

    const [bymonthday, setbymonthday] = useState(1);
    const [weekdays, setWeekdays] = useState<string[]>([]);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [uncertainty, setUncertainty] = useState(false);
    const [highUncertainty, setHighUncertainty] = useState(value);
    const [lowUncertainty, setLowUncertainty] = useState(value);

    function clearForm() {
        setName('');
        setValue(undefined);
        setUncertainty(false);
        setHighUncertainty(0);
        setLowUncertainty(0);
    }
    
    return <form onSubmit={e => {
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
            'labels': { 'uncertainty': uncertainty,
                        'highUncertainty': highUncertainty,
                        'lowUncertainty': lowUncertainty
                    },
        });

        clearForm();
    }}>
        <br />
        <br />
        <div className="row">
            <label htmlFor="Name" className="col-sm-2 col-form-label form-control-sm">Name</label>
            <div className="col-sm-8">
                <input className="form-control form-control-sm" id="Name" placeholder="Enter rule name here..." type="text" value={name} onChange={e => setName(e.target.value)} /><br />
            </div>
        </div>

        <div className="row">
        <label htmlFor="Value" className="col-sm-2 col-form-label form-control-sm">Value</label>
        <div className="col-sm-8">
            <input className="form-control form-control-sm" id="Value" type="number" placeholder="Value" step="0.01" value={value} onChange={e => {
                const newValue = Number(e.target.value);
                if (newValue) { // not 0, not undefined
                    setValue(newValue)
                } else {
                    setValue(undefined)
                }
            }} /><br />
        </div>
        </div>

        <div className="form-row">
        <div className="col-md-4 mb-3">
        <label htmlFor="Frequency">Frequency</label>   
            <select className="form-control" id="Frequency" name="frequency" onChange={e => setFrequency(e.target.value)} value={frequency} >
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Biweekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="ONCE">Once</option>
            </select>
        </div>

        <div className="col-md-4 mb-3">
        <label htmlFor="Start">Start:</label>
        <input className="form-control" type="date" name="Start" id="Start" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>

        {frequency !== "ONCE" && <>
        <div className="col-md-4 mb-3">
            <label htmlFor="End">End:</label>
            <input className="form-control" type="date" name="End" id="End" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        </>}
        
        {(frequency === "MONTHLY") && <>
        <div className="col-md-4 mb-4">
            <label htmlFor="bymonthday">Day of month</label>
            <input className="form-control" id="bymonthday" type="number" min="1" max="31" placeholder="Day of month" value={bymonthday} onChange={e => setbymonthday(Number(e.target.value))} />
        </div>
        </>}
        
        {(frequency === "WEEKLY") && <>
        <div className="col-md-4 mb-4">
            <label htmlFor="Weekdays">Days of Week</label>
            <select className="custom-select" id="Weekdays" name="Weekdays" multiple value={weekdays} onChange={e => {
                const selectedValues = Array.from(e.target.options)
                    .filter((x) => x.selected)
                    .map((x)=>x.value);

                setWeekdays(selectedValues);
            }}>
                <option value="SUNDAY">Sunday</option>
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
            </select></div>
        </>}

        <div className="col-md-4 mb-3">
        <label htmlFor="Uncertainty">Uncertainty:</label>
        <input className="form-control" type="checkbox" name="Uncertainty" id="Uncertainty" checked={uncertainty} onChange={e => setUncertainty(e.target.checked)} />
        </div>

        {(uncertainty) && <>
            <div className="col-md-4 mb-4">
                <label htmlFor="High">High Uncertainty:</label>
                <input className="form-control" type="number" name="High" id="High" value={highUncertainty} onChange={e => setHighUncertainty(Number(e.target.value))} />
                <label htmlFor="Low">Low Uncertainty:</label>
                <input className="form-control" type="number" name="Low" id="Low" value={lowUncertainty} onChange={e => setLowUncertainty(Number(e.target.value))} />
            </div>
        </>}

        </div>
       <button className="btn btn-primary mb-2">Submit</button><br /><br />
    </form>
}
