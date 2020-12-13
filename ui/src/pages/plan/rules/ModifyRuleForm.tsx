import React, { useState } from 'react';
import { RRule, rrulestr } from 'rrule';
import { IApiRule, IApiRuleMutate } from './IRule';
import './ModalForm.css';

export const ModifyForm = ({
    rule,
    onSubmit,
    onDelete = () => {},
    onFailedValidation = () => {}
}: {
    rule: IApiRule,
    onSubmit: (id: string, rule: IApiRuleMutate) => void,
    onDelete?: (id: string) => void,
    onFailedValidation: (message: string) => void,
}) => {
    // Parse an RRule Object
    let apiRule = rule as IApiRule;
    let ruleId = apiRule.id
    // TODO: handle invalid rules safely
    let rruleObject = rrulestr(rule.rrule);
    let strFrequency = "MONTHLY";
    let ruleByMonthDay;
    let ruleWeekDays: string[] | (() => string[]) = [];
    let ruleStartDate = '';
    let ruleEndDate = '';
    let currentStartDate = new Date();
    let currentEndDate = new Date();
    let currentHighUncertainty = 0;
    let currentLowUncertainty = 0;
    let currentUncertainty = false;

    if (apiRule['labels']) {
        currentHighUncertainty = apiRule['labels']['highUncertainty'];
        currentLowUncertainty = apiRule['labels']['lowUncertainty'];
        currentUncertainty = apiRule['labels']['uncertainty']
    }

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
        if (strFrequency == 'WEEKLY' && rruleObject.origOptions.interval == 2) {
            strFrequency = 'BIWEEKLY'
        }
    }

    if (rruleObject.origOptions.bymonthday != undefined) {
        if (Array.isArray(rruleObject.origOptions.bymonthday)) {
            ruleByMonthDay = rruleObject.origOptions.bymonthday[0];
        } else {
            ruleByMonthDay = rruleObject.origOptions.bymonthday
        }
    } else {
        ruleByMonthDay = 1;
    }
    
    if (rruleObject.origOptions.byweekday != undefined) {
        if (Array.isArray(rruleObject.origOptions.byweekday)) {
            ruleWeekDays = rruleObject.origOptions.byweekday.map(wd => wd.toString());
        } else {
            ruleWeekDays = [rruleObject.origOptions.byweekday.toString()]
        }
        const rRuleWeekdayToWeekdayMapping: { [key: string]: string } = {
            "SU": "SUNDAY",
            "MO": "MONDAY",
            "TU": "TUESDAY",
            "WE": "WEDNESDAY",
            "TH": "THURSDAY",
            "FR": "FRIDAY",
            "SA": "SATURDAY",
        }
        ruleWeekDays = ruleWeekDays.map(rruleWeekday => rRuleWeekdayToWeekdayMapping[rruleWeekday]);   
    }

    if (rruleObject.origOptions.dtstart != undefined){
        currentStartDate = rruleObject.origOptions.dtstart;
        ruleStartDate = (currentStartDate.getUTCFullYear().toString() + "-" + ((currentStartDate.getUTCMonth() > 8) ? (currentStartDate.getUTCMonth() + 1) : ('0' + (currentStartDate.getUTCMonth() + 1)))).toString() + '-' + (((currentStartDate.getUTCDate() > 9) ? currentStartDate.getUTCDate() : ('0' + currentStartDate.getUTCDate()))).toString();
    }

    if (rruleObject.origOptions.until != undefined) {
        currentEndDate = rruleObject.origOptions.until;
        ruleEndDate = (currentEndDate.getUTCFullYear().toString() + "-" + ((currentEndDate.getUTCMonth() > 8) ? (currentEndDate.getUTCMonth() + 1) : ('0' + (currentEndDate.getUTCMonth() + 1)))).toString() + '-' + (((currentEndDate.getUTCDate() > 9) ? currentEndDate.getUTCDate() : ('0' + currentEndDate.getUTCDate()))).toString();
    }

    const [name, setName] = useState(rule.name);
    const [value, setValue] = useState<number | undefined>(rule.value);
    const [frequency, setFrequency] = useState<string>(strFrequency);

    const [bymonthday, setbymonthday] = useState<number | undefined>(ruleByMonthDay);
    const [weekdays, setWeekdays] = useState<string[]>(ruleWeekDays);

    const [startDate, setStartDate] = useState<string>(ruleStartDate);
    const [endDate, setEndDate] = useState<string>(ruleEndDate);
    const [uncertainty, setUncertainty] = useState(currentUncertainty);
    const [highUncertainty, setHighUncertainty] = useState(currentHighUncertainty);
    const [lowUncertainty, setLowUncertainty] = useState(currentLowUncertainty);
    
    return <form id="modifyRule" onSubmit={e => {
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

        onSubmit(ruleId, 
            {
                name: name,
                value: value,
                rrule: rruleString,
                'labels': { 'uncertainty': uncertainty,
                            'highUncertainty': highUncertainty,
                            'lowUncertainty': lowUncertainty
                        }
            }    
            );
    }}>
        <h2 className="mb-4">Modify Rule</h2>
        <div className="form-inline">
            <label htmlFor="Name" className="sr-only">Rule name</label>
            <input className="form-control form-control-sm mr-2" id="Name" placeholder="Rule name" type="text" value={name} onChange={e => setName(e.target.value)} />

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
        <div className="form-inline mt-2">
            {/* Frequency selector */}
            <label htmlFor="Frequency" className="sr-only">Frequency</label>   
            <select className="form-control form-control-sm mr-2" id="Frequency" name="frequency" onChange={e => setFrequency(e.target.value)} value={frequency} >
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
                ].map(day => <a 
                    className={"btn btn-sm " + (weekdays.includes(day) ? 'btn-primary' : 'btn-outline-primary')}
                    aria-checked={weekdays.includes(day)}
                    role="checkbox"
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
                </a>)}
            </div>}
        </div>

        <div className="form-inline mt-2">
            {/* Start Date */}
            <label htmlFor="Start" className="sr-only">Start:</label>
            <input className="form-control form-control-sm mr-2" placeholder="Start Date" type="date" name="Start" id="Start" required={["BIWEEKLY", "YEARLY", "ONCE"].includes(frequency)} value={startDate} onChange={e => setStartDate(e.target.value)} />

            {/* End Date */}
            {frequency !== "ONCE" && <>
                <label htmlFor="End" className="sr-only">End:</label>
                <input className="form-control form-control-sm" placeholder="End Date" type="date" name="End" id="End" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </>}
        </div>

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
        
        <div className="d-flex justify-content-between flex-row-reverse mt-2">
            <button className="btn btn-sm btn-primary mb-2" data-testid="submitupdate">Update</button>
            <button onClick={e => {
                e.stopPropagation()
                e.preventDefault()
                onDelete(rule.id)

            }} className="btn btn-sm btn-danger mb-2">Delete</button>
        </div>
    </form>
}
