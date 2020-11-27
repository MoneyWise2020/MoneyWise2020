import React, { useState } from 'react';
import { Frequency, RRule, rrulestr } from 'rrule';
import { IApiRule, IApiRuleMutate } from './IRule';
import './ModalForm.css';

export const ModifyForm = ({
    rule,
    onSubmit,
    onFailedValidation = () => {}
}: {
    rule: IApiRuleMutate,
    onSubmit: (id: string, rule: IApiRuleMutate) => void,
    onFailedValidation: (message: string) => void,
}) => {
    // Parse an RRule Object
    let apiRule = rule as IApiRule;
    let ruleId = apiRule.id
    let rruleObject = rrulestr(rule.rrule);
    let strFrequency = "MONTHLY";
    let ruleByMonthDay;
    let ruleByMonth;
    let ruleWeekDays: string[] | (() => string[]) = [];
    let ruleStartDate = '';
    let ruleEndDate = '';
    let currentStartDate = new Date();
    let currentEndDate = new Date();

    // Frequency {
    //     YEARLY = 0,
    //     MONTHLY = 1,
    //     WEEKLY = 2,
    //     DAILY = 3,
    //     HOURLY = 4,
    //     MINUTELY = 5,
    //     SECONDLY = 6
    // }

    const frequencies = [ "YEARLY", "MONTHLY", 'WEEKLY', "DAILY", "HOURLY", "MINUTELY", "SECONDLY"]

    if (rruleObject.origOptions.freq != undefined) {
        strFrequency = frequencies[rruleObject.origOptions.freq];
    }

    if (rruleObject.origOptions.bymonthday != undefined && typeof(rruleObject.origOptions.bymonthday) == typeof(Number)) {
        ruleByMonthDay = rruleObject.origOptions.bymonthday;
    } else {
        ruleByMonthDay = 1;
    }

    if (rruleObject.origOptions.bymonth != undefined && typeof(rruleObject.origOptions.bymonth) == typeof(Number)) {
        ruleByMonth = rruleObject.origOptions.bymonth;
    } else {
        ruleByMonth = 1;
    }

    if (rruleObject.origOptions.wkst != undefined) {
        ruleWeekDays = [rruleObject.origOptions.wkst.toString()];
    }

    if (rruleObject.origOptions.dtstart != undefined){
        currentStartDate = rruleObject.origOptions.dtstart;
        ruleStartDate = (currentStartDate.getFullYear().toString() + "-" + ((currentStartDate.getMonth() > 8) ? (currentStartDate.getMonth() + 1) : ('0' + (currentStartDate.getMonth() + 1)))).toString() + '-' + (((currentStartDate.getDate() > 9) ? currentStartDate.getDate() : ('0' + currentStartDate.getDate()))).toString();
        // ruleStartDate = rruleObject.origOptions.dtstart.toString()       
    }

    if (rruleObject.origOptions.until != undefined) {
        currentEndDate = rruleObject.origOptions.until;
        ruleEndDate = (currentEndDate.getFullYear().toString() + "-" + ((currentEndDate.getMonth() > 8) ? (currentEndDate.getMonth() + 1) : ('0' + (currentEndDate.getMonth() + 1)))).toString() + '-' + (((currentEndDate.getDate() > 9) ? currentEndDate.getDate() : ('0' + currentEndDate.getDate()))).toString();
        // ruleEndDate = rruleObject.origOptions.until.toString()
    }

    const [name, setName] = useState(rule.name);
    const [value, setValue] = useState(rule.value);
    const [frequency, setFrequency] = useState<string>(strFrequency);

    const [bymonthday, setbymonthday] = useState(ruleByMonthDay); 
    const [bymonth, setbymonth] = useState(ruleByMonth); 
    const [weekdays, setWeekdays] = useState<string[]>(ruleWeekDays);

    const [startDate, setStartDate] = useState<string>(ruleStartDate);
    const [endDate, setEndDate] = useState<string>(ruleEndDate);
    
    return <form id="modifyRule" onSubmit={e => {
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
                options = {
                    freq: RRule.YEARLY,
                    bymonth: bymonth,
                    bymonthday: bymonthday,
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

        onSubmit(ruleId, {
            name: name,
            value: value,
            rrule: rruleString,
        });
    }}>
        <br />
        <h2>Modify {rule.name}</h2>
        <br />
        <div className="form-group row">
            <label htmlFor="Name" className="col-sm-2 col-form-label">Name</label>
        <div className="col-sm-10">
            <input className="form-control" id="Name" placeholder="Enter rule name here..." type="text" value={name} onChange={e => setName(e.target.value)} /><br />
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
        
        {(frequency === "MONTHLY" || frequency === "YEARLY") && <>
        <div className="col-md-4 mb-4">
            <label htmlFor="bymonthday">Day of month</label>
            <input className="form-control" id="bymonthday" type="number" min="1" max="31" placeholder="Day of month" value={Number(bymonthday)} onChange={e => setbymonthday(Number(e.target.value))} />
        </div>
        </>}
        {(frequency === "YEARLY") && <>
        <div className="col-md-4 mb-4">
            <label htmlFor="bymonth">Month of Year</label>
            <input className="form-control" type="number" id="bymonth" min="1" max="12" placeholder="Month of year" value={Number(bymonth)} onChange={e => setbymonth(Number(e.target.value))} />
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
        </div>
       <button className="btn btn-primary mb-2">Update</button><br /><br />
    </form>
}
