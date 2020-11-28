from typing import List

import os
import math
from datetime import timedelta as td
from dateutil.rrule import rrule, rrulestr

from convertdate import hebrew

from .instance import Instance
from .aggregators import calculate_balance, calculate_working_capital


#
# Hebrew utilities
#
def to_heb_year_month_day(d):
    return hebrew.from_gregorian(d.year, d.month, d.day)


def hebrew_days(start, stop, holiday):
    holiday = tuple(map(int, map(str.strip, holiday.split(","))))

    dates = []

    today = start
    while today < stop:
        if to_heb_year_month_day(today)[1:] == holiday:
            dates.append(today)
            # the shortest Hebrew year is 353 days.
            today += td(days=350)
        today = today + td(days=1)
    
    return dates


#
# Recurrence rule interpreter
#
def get_dates(rule, parameters):
    start = parameters.start
    end = parameters.end
    if "X-YEARLY-HEBREW:" in rule["rule"]:
        return hebrew_days(start, end, rule["rule"].replace("X-YEARLY-HEBREW:", ""))
    
    dates = []
    rule_generator = iter(rrulestr(rule["rule"], dtstart=start))
    for d in rule_generator:
        date = d.date()
        if date < start:
            continue
        if date > end:
            break
        dates.append(date)
    
    return dates


def generate_event_transactions(context) -> List[Instance]:
    transactions = []
    rrules = context.rules.rules_map
    for rule_id, rule in rrules.items():
        try:
            dates = get_dates(rule, context.parameters)

            rrule_transactions = [
                Instance(
                    rule_id=rule_id,
                    instance_id="{}::{}".format(rule_id, d.isoformat()),
                    value=rule["value"],
                    day=d
                )
                for d in dates
            ]

            transactions.extend(rrule_transactions)
        except Exception:
            assert False, f"Rule `{rule_id}` is an invalid rrule per RFC 5545"
 
    transactions.sort(key=lambda x: (x.day, x.rule_id))
    return transactions


def generate_event_daybydays(context) -> List[Instance]:

    daybydays = []

    transactions = generate_event_transactions(context)
    transactionCount = len(transactions)

    calculate_balance(context, transactions)
    calculate_working_capital(context, transactions)

    rule = {
        'rule': 'FREQ=DAILY;INTERVAL=1'
    }
    dates = get_dates(rule, context.parameters)
    dateCount = len(dates)
    if (dateCount == 0):
        return daybydays    

    balEnd = context.parameters.current
    balLow = balEnd
    balHigh = balEnd

    wcEnd = context.parameters.current
    wcLow = wcEnd
    wcHigh = wcEnd

    i = 0
    j = 0

    while (i < dateCount):    

        if (j < transactionCount and dates[i] == transactions[j].day):

            wcLow = transactions[j].calculations["working_capital"]
            wcHigh = transactions[j].calculations["working_capital"]

            while (j < transactionCount and dates[i] == transactions[j].day):

                balEnd += transactions[j].value
                if (balEnd > balHigh):
                    balHigh = balEnd
                elif (balEnd < balLow):
                    balLow = balEnd

                wcEnd = transactions[j].calculations["working_capital"]
                if (wcEnd > wcHigh):
                    wcHigh = wcEnd
                elif (wcEnd < wcLow):
                    wcLow = wcEnd                

                j += 1

        daybyday = {
            'date': dates[i],
            'balance': 
                {'low': balLow, 'high': balHigh},                
            'working_capital':
                {'low': wcLow, 'high': wcHigh},                
        }

        balLow = balEnd
        balHigh = balEnd
        wcLow = wcEnd
        wcHigh = wcEnd           

        daybydays.append(daybyday)
        i += 1

    return daybydays