import os
import pandas
import math
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
from datetime import datetime, timedelta

from script.control import CONTROL


def interpret_timestamp(d):
    if (isinstance(d, float) and math.isnan(d)) or d is pandas.NaT:
        return None
    else:
        return d.to_pydatetime().date()



def normalize_rule(pandas_rule):
    rule = {}

    rule["value"] = pandas_rule["VALUE"]

    rule["START_DAY"] = interpret_timestamp(pandas_rule["START_DAY"])
    rule["END_DAY"] = interpret_timestamp(pandas_rule["END_DAY"])

    if pandas_rule["PATTERN"] in (
        "YEARLY",
        "ONE-TIME",
    ):
        rule["DATE"] = pandas_rule["DATE"].to_pydatetime().date()
    elif pandas_rule["PATTERN"] in (
        "YEARLY-HEBREW",
    ):
        rule["HEBREW"] = pandas_rule["HEBREW"]
    elif pandas_rule["PATTERN"] in (
        "WEEKLY",
    ):
        rule["DAYS_AFTER_SHABBAT"] = pandas_rule["DAYS_AFTER_SHABBAT"]
    elif pandas_rule["PATTERN"] in (
        "MONTHLY",
    ):
        rule["DAY_OF_MONTH"] = pandas_rule["DAY_OF_MONTH"]
    elif pandas_rule["PATTERN"] in (
        "BIWEEKLY",
    ):
        rule["DAYS_AFTER_PAYCHECK_FRIDAY"] = pandas_rule["DAYS_AFTER_PAYCHECK_FRIDAY"]

    rule["id"] = pandas_rule["NAME"]

    return rule


def normalize_rules_pandas_quirks(rules_by_type):
    output = {}
    for r, rules in rules_by_type.items():
        output[r] = list(map(normalize_rule, rules))
    return output


def get_rules_by_type():
    biweekly_start = CONTROL["BIWEEKLY_START"].to_pydatetime().date()
    rules_by_type = pandas.read_excel(
        "/cashflow-data/CONTROL.xlsx",
        sheet_name=["YEARLY", "MONTHLY", "BIWEEKLY", "WEEKLY", "ONE-TIME", "YEARLY-HEBREW"]
    )
    for k, v in rules_by_type.items():
        rules_by_type[k] = v.to_dict("records")
        for r in rules_by_type[k]:
            r["PATTERN"] = k
    
    rules_by_type = normalize_rules_pandas_quirks(rules_by_type)
    
    # assign uniquer IDs
    for k, v in rules_by_type.items():
        for i, r in enumerate(rules_by_type[k]):
            r["id"] += "-{}".format(i)
    
    rules_map = {}

    for monthly_rule in rules_by_type["MONTHLY"]:
        r = rrule(freq=MONTHLY, dtstart=monthly_rule["START_DAY"], until=monthly_rule["END_DAY"], bymonthday=monthly_rule["DAY_OF_MONTH"])
        rules_map[monthly_rule["id"]] = {
            "rule": str(r),
            **monthly_rule
        }

    for yearly_rule in rules_by_type["YEARLY"]:
        r = rrule(freq=YEARLY, dtstart=yearly_rule["START_DAY"], until=yearly_rule["END_DAY"],
        bymonthday=yearly_rule["DATE"].day,
        bymonth=yearly_rule["DATE"].month)
        rules_map[yearly_rule["id"]] = {
            "rule": str(r),
            **yearly_rule
        }

    for weekly_rule in rules_by_type["WEEKLY"]:
        # TODO(jafulfor): Is the weekly day alignment right? (That -1 looks suspicious)
        r = rrule(freq=WEEKLY, dtstart=weekly_rule["START_DAY"], until=weekly_rule["END_DAY"], byweekday=weekly_rule["DAYS_AFTER_SHABBAT"] - 1)
        rules_map[weekly_rule["id"]] = {
            "rule": str(r),
            **weekly_rule
        }

    for one_time_rule in rules_by_type["ONE-TIME"]:
        r = rrule(freq=YEARLY, dtstart=one_time_rule["DATE"], count=1)
        rules_map[one_time_rule["id"]] = {
            "rule": str(r),
            **one_time_rule
        }

    for biweekly_rule in rules_by_type["BIWEEKLY"]:
        r = rrule(freq=WEEKLY, interval=2, dtstart=biweekly_start + timedelta(days=biweekly_rule["DAYS_AFTER_PAYCHECK_FRIDAY"]))
        rules_map[biweekly_rule["id"]] = {
            "rule": str(r),
            **biweekly_rule
        }

    for yearly_hebrew_rule in rules_by_type["YEARLY-HEBREW"]:
        rules_map[yearly_hebrew_rule["id"]] = {
            "rule": "X-YEARLY-HEBREW:{}".format(yearly_hebrew_rule["HEBREW"].replace(" ", "")),
            **yearly_hebrew_rule
        }
    

    for key, rule in rules_map.items():
        rules_map[key] = {
            "rule": rule["rule"],
            "value": rule["value"],
        }

    return rules_map
