from typing import List

import os
import math
from datetime import timedelta as td
from dateutil.rrule import rrule, rrulestr

from convertdate import hebrew

from .instance import Instance


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


def generate_event_instances(context) -> List[Instance]:
    instances = []
    rrules = context.rules.rules_map
    for rule_id, rule in rrules.items():
        try:
            dates = get_dates(rule, context.parameters)

            rrule_instances = [
                Instance(
                    rule_id=rule_id,
                    instance_id="{}::{}".format(rule_id, d.isoformat()),
                    value=rule["value"],
                    day=d
                )
                for d in dates
            ]

            instances.extend(rrule_instances)
        except Exception:
            assert False, f"Rule `{rule_id}` is an invalid rrule per RFC 5545"
 
    instances.sort(key=lambda x: (x.day, x.rule_id))
    return instances