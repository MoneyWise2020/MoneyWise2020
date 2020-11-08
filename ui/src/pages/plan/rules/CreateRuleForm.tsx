import React, { useState } from 'react';
import RRule from 'rrule';
import { IApiRuleMutate } from './IRule';

export const CreateForm = ({ onSubmit }: { onSubmit: (rule: IApiRuleMutate) => void }) => {
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
            alert(`Please enter a non zero value`);
            return;
        }

        if (name.length < 3) {
            alert(`Please enter more than 3 characters`);
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
        <label htmlFor="Name">Name:</label><input id="Name" type="string" placeholder="name" value={name} onChange={e => setName(e.target.value)}></input><br />
        <label htmlFor="Value">Value:</label><input id="Value" type="number" placeholder="Value" step="0.01" value={value} onChange={e => setValue(Number(e.target.value))}></input><br />
        <label htmlFor="Frequency">Frequency:</label><select id="Frequency" name="frequency" onChange={e => setFrequency(e.target.value)}>
            <option value="WEEKLY" selected={frequency === "WEEKLY"}>Weekly</option>
            {/* <option value="BIWEEKLY" selected={frequency === "BIWEEKLY"}>Bi-Weekly</option> */}
            <option value="MONTHLY" selected={frequency === "MONTHLY"}>Monthly</option>
            <option value="YEARLY" selected={frequency === "YEARLY"}>Yearly</option>
        </select>
        {(frequency === "MONTHLY" || frequency === "YEARLY") && <>
            <input type="number" min="1" max="31" placeholder="Day of month" value={bymonthday} onChange={e => setbymonthday(Number(e.target.value))} />
        </>}
        {(frequency === "YEARLY") && <>
            <input type="number" min="1" max="12" placeholder="Month of year" value={bymonth} onChange={e => setbymonth(Number(e.target.value))} />
        </>}
        {(frequency === "WEEKLY") && <>
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
            </select>
        </>}
       <button>Submit</button>
    </form>
}
