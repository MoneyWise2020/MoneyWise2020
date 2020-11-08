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
    const [value, setValue] = useState(0);
    const [frequency, setFrequency] = useState<string>("MONTHLY");
    const [bymonthday, setbymonthday] = useState(1); 
    const [bymonth, setbymonth] = useState(1); 

    const [weekdays, setWeekdays] = useState<string[]>([]);
    
    return <form onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();

        if (value === 0) {
            onFailedValidation(`Please enter a non zero value`);
            return;
        }

        if (name.length < 3) {
            onFailedValidation(`Please enter more than 3 characters, you entered '${name}'`);
            return;
        }

        let options = {};

        switch (frequency) {
            case "BIWEEKLY":
                // TODO: support BIWEEKLY properly
                options = {
                    freq: RRule.WEEKLY,
                    interval: 2,
                    byweekday: 0,
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
                };
                break;
            case "MONTHLY":
                options = {
                    freq: RRule.MONTHLY,
                    bymonthday: bymonthday,
                }
                break;
            case "YEARLY":
                options = {
                    freq: RRule.YEARLY,
                    bymonth: bymonth,
                    bymonthday: bymonthday,
                }
                break;
        }

        // Success

        const rruleString = new RRule(options).toString()

        onSubmit({
            name: name,
            value: value,
            rrule: rruleString,
        });

        setName('');
        setValue(0);
    }}>
        <br />
        <h2>Create a New Rule</h2>
        <br />
        <div className="form-group row">
            <label htmlFor="Name" className="col-sm-2 col-form-label">Name</label>
        <div className="col-sm-10">
            <input className="form-control" id="Name" placeholder="Enter rule name here..." type="string" value={name} onChange={e => setName(e.target.value)} /><br />
        </div>
        </div>

        <div className="form-group row">
        <label htmlFor="Value" className="col-sm-2 col-form-label">Value</label>
        <div className="col-sm-10">
            <input className="form-control" id="Value" type="number" placeholder="Value" step="0.01" value={value} onChange={e => setValue(Number(e.target.value))} /><br />
        </div>
        </div>

        <div className="form-row">
        <div className="col-md-4 mb-3">
        <label htmlFor="Frequency">Frequency</label>   
            <select className="form-control" id="Frequency" name="frequency" onChange={e => setFrequency(e.target.value)} value={frequency} >
                <option value="WEEKLY">Weekly</option>
                {/* <option value="BIWEEKLY">Bi-Weekly</option> */}
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
            </select>
        </div>
        
        {(frequency === "MONTHLY" || frequency === "YEARLY") && <>
        <div className="col-md-4 mb-4">
            <label htmlFor="bymonthday">Day of month</label>
            <input className="form-control" id="bymonthday" type="number" min="1" max="31" placeholder="Day of month" value={bymonthday} onChange={e => setbymonthday(Number(e.target.value))} />
        </div>
        </>}
        {(frequency === "YEARLY") && <>
        <div className="col-md-4 mb-4">
            <label htmlFor="bymonthday">Month of Year</label>
            <input className="form-control" type="number" min="1" max="12" placeholder="Month of year" value={bymonth} onChange={e => setbymonth(Number(e.target.value))} />
        </div>
        </>}
        {(frequency === "WEEKLY") && <>
        <div className="col-md-4 mb-4">
            <label htmlFor="Weekdays">Days of Week</label>
            <select className="custom-select" multiple onChange={e => {
                setWeekdays(Array.from(e.target.selectedOptions).map(opt => opt.value));
            }}>
                {/* TODO: start with Sunday or monday? */}
                <option value="SUNDAY" selected={weekdays.includes("SUNDAY")}>Sunday</option>
                <option value="MONDAY" selected={weekdays.includes("MONDAY")}>Monday</option>
                <option value="TUESDAY" selected={weekdays.includes("TUESDAY")}>Tuesday</option>
                <option value="WEDNESDAY" selected={weekdays.includes("WEDNESDAY")}>Wednesday</option>
                <option value="THURSDAY" selected={weekdays.includes("THURSDAY")}>Thursday</option>
                <option value="FRIDAY" selected={weekdays.includes("FRIDAY")}>Friday</option>
                <option value="SATURDAY" selected={weekdays.includes("SATURDAY")}>Saturday</option>
            </select></div>
        </>}
        </div>
       <button className="btn btn-primary mb-2">Submit</button><br /><br />
    </form>
}
