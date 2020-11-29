import json
from django.test import TestCase
from datetime import datetime, date
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY, DAILY, MO
from .exe_context import ExecutionParameters, ExecutionRules, ExecutionContext
from .generate_instances import get_transactions_up_to
from .daybydays import generate_daybydays

DATE_FORMAT = "%Y-%m-%d"



def get_transactions(parameters, rules):
    transactions = get_transactions_up_to(ExecutionContext(parameters, rules))
    return list(map(lambda i: i.serialize(), transactions))

def get_daybyday(parameters, rules):
    daybydays = generate_daybydays(ExecutionContext(parameters, rules))
    return daybydays



class HandlerTests(TestCase):
    def setUp(self):
        self.maxDiff = 5000

    def test_get_instances_from_rules_monthly(self):
        actual = get_transactions(
            ExecutionParameters(
                date(2018, 6, 21),
                date(2018, 7, 21),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=MONTHLY, bymonthday=1, interval=1, dtstart=date(2018, 6, 21))),
                    "value": 100
                }
            })
        )

        expected = [{
            "rule_id": "rule-1",
            "id": "rule-1::2018-07-01",
            "value": 100,
            "day": date(2018, 7, 1),
            "calculations": {
                "balance": 100.0,
                "working_capital": 100.0
            }
        }]

        self.assertEqual(expected, actual)

    def test_get_instances_from_rules_multipleRules(self):
        actual = get_transactions(
            ExecutionParameters(
                date(2018, 6, 21),
                date(2018, 7, 2),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=MONTHLY, bymonthday=1, interval=1, dtstart=date(2018, 6, 21))),
                    "value": 100
                },
                'rule-2': {
                    "rule": str(rrule(freq=WEEKLY, byweekday=[MO], interval=1, dtstart=date(2018, 6, 21))),
                    "value": -10
                }
            })
        )

        expected = [{
            "rule_id": "rule-2",
            "id": "rule-2::2018-06-25",
            "value": -10,
            "day": date(2018, 6, 25),
            "calculations": {
                "balance": -10.0,
                "working_capital": -10.0
            }
        }, {
            "rule_id": "rule-1",
            "id": "rule-1::2018-07-01",
            "value": 100,
            "day": date(2018, 7, 1),
            "calculations": {
                "balance": 90.0,
                "working_capital": 80.0
            }
        },{
            "rule_id": "rule-2",
            "id": "rule-2::2018-07-02",
            "value": -10,
            "day": date(2018, 7, 2),
            "calculations": {
                "balance": 80.0,
                "working_capital": 80.0
            }
        }]

        self.assertEqual(expected, actual)
    
    def test_get_instances_from_rules_weekly(self):
        actual = get_transactions(
            ExecutionParameters(
                date(2018, 6, 21),
                date(2018, 7, 2),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=WEEKLY, byweekday=MO, interval=1, dtstart=date(2018, 6, 21))),
                    "value": 100
                }
            })
        )

        expected = [{
            "rule_id": "rule-1",
            "id": "rule-1::2018-06-25",
            "value": 100,
            "day": date(2018, 6, 25),
            "calculations": {
                "balance": 100.0,
                "working_capital": 100.0
            }
        }, {
            "rule_id": "rule-1",
            "id": "rule-1::2018-07-02",
            "value": 100,
            "day": date(2018, 7, 2),
            "calculations": {
                "balance": 200.0,
                "working_capital": 200.0
            }
        }]

        self.assertEqual(expected, actual)
    

    def test_get_instances_from_rules_biweekly(self):
        actual = get_transactions(
            ExecutionParameters(
                date(2018, 6, 20),
                date(2018, 7, 9),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=WEEKLY, interval=2, dtstart=date(2018, 6, 21))),
                    "value": 100
                }
            })
        )

        expected = [{
            "rule_id": "rule-1",
            "id": "rule-1::2018-06-21",
            "value": 100,
            "day": date(2018, 6, 21),
            "calculations": {
                "balance": 100.0,
                "working_capital": 100.0
            }
        }, {
            "rule_id": "rule-1",
            "id": "rule-1::2018-07-05",
            "value": 100,
            "day": date(2018, 7, 5),
            "calculations": {
                "balance": 200.0,
                "working_capital": 200.0
            }
        }]

        self.assertEqual(expected, actual)

    def test_get_instances_from_rules_yearly(self):
        actual = get_transactions(
            ExecutionParameters(
                date(2018, 6, 20),
                date(2019, 7, 9),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=YEARLY, dtstart=date(2018, 6, 21))),
                    "value": 100
                }
            })
        )

        expected = [{
            "rule_id": "rule-1",
            "id": "rule-1::2018-06-21",
            "value": 100,
            "day": date(2018, 6, 21),
            "calculations": {
                "balance": 100.0,
                "working_capital": 100.0
            }
        }, {
            "rule_id": "rule-1",
            "id": "rule-1::2019-06-21",
            "value": 100,
            "day": date(2019, 6, 21),
            "calculations": {
                "balance": 200.0,
                "working_capital": 200.0
            }
        }]

        self.assertEqual(expected, actual)
    
    def test_get_instances_from_rules_once(self):
        actual = get_transactions(
            ExecutionParameters(
                date(2018, 6, 20),
                date(2019, 7, 9),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=YEARLY, count=1, dtstart=date(2018, 6, 21))),
                    "value": 100
                }
            })
        )

        expected = [{
            "rule_id": "rule-1",
            "id": "rule-1::2018-06-21",
            "value": 100,
            "day": date(2018, 6, 21),
            "calculations": {
                "balance": 100.0,
                "working_capital": 100.0
            }
        }]

        self.assertEqual(expected, actual)

    def test_get_daybyday_from_rules_once(self):
        actual = get_daybyday(
            ExecutionParameters(
                date(2018, 6, 20),
                date(2018, 6, 22),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=YEARLY, count=1, dtstart=date(2018, 6, 21))),
                    "value": 100
                }
            })
        )

        expected = [{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 20),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        }, {
            "balance": {
                "high": 100,
                "low": 0
            },
            "date": date(2018, 6, 21),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 6, 22),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }]

        self.assertEqual(expected, actual)


    def test_get_daybyday_from_rules_multipleRules(self):
        actual = get_daybyday(
            ExecutionParameters(
                date(2018, 6, 18),
                date(2018, 6, 19),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=WEEKLY, byweekday=[MO], interval=1, dtstart=date(2018, 6, 18))),
                    "value": 100
                },
                'rule-2': {
                    "rule": str(rrule(freq=WEEKLY, byweekday=[MO], interval=1, dtstart=date(2018, 6, 18))),
                    "value": -10
                }
            })
        )

        expected = [{
            "balance": {
                "high": 100,
                "low": 0
            },
            "date": date(2018, 6, 18),
            "working_capital": {
                "high": 90,
                "low": 90
            }
        }, {
            "balance": {
                "high": 90,
                "low": 90
            },
            "date": date(2018, 6, 19),
            "working_capital": {
                "high": 90,
                "low": 90
            }
        }]

        self.assertEqual(expected, actual)

    def test_get_daybyday_from_rules_weekly(self):
        actual = get_daybyday(
            ExecutionParameters(
                date(2018, 6, 18),
                date(2018, 6, 25),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=WEEKLY, byweekday=[MO], interval=1, dtstart=date(2018, 6, 18))),
                    "value": 100
                }
            })
        )

        expected = [{
            "balance": {
                "high": 100,
                "low": 0
            },
            "date": date(2018, 6, 18),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 6, 19),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 6, 20),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 6, 21),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 6, 22),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 6, 23),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 6, 24),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, {
            "balance": {
                "high": 200,
                "low": 100
            },
            "date": date(2018, 6, 25),
            "working_capital": {
                "high": 200,
                "low": 200
            }
        }]

        self.assertEqual(expected, actual)


    def test_get_daybyday_from_rules_daily(self):
        actual = get_daybyday(
            ExecutionParameters(
                date(2018, 6, 18),
                date(2018, 6, 21),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=DAILY, interval=1, dtstart=date(2018, 6, 18))),
                    "value": 300
                }
            })
        )

        expected = [{
            "balance": {
                "high": 300,
                "low": 0
            },
            "date": date(2018, 6, 18),
            "working_capital": {
                "high": 300,
                "low": 300
            }
        }, {
            "balance": {
                "high": 600,
                "low": 300
            },
            "date": date(2018, 6, 19),
            "working_capital": {
                "high": 600,
                "low": 600
            }
        }, {
            "balance": {
                "high": 900,
                "low": 600
            },
            "date": date(2018, 6, 20),
            "working_capital": {
                "high": 900,
                "low": 900
            }
        }, {
            "balance": {
                "high": 1200,
                "low": 900
            },
            "date": date(2018, 6, 21),
            "working_capital": {
                "high": 1200,
                "low": 1200
            }
        }]

        self.assertEqual(expected, actual)


    def test_get_daybyday_from_rules_monthly(self):
        actual = get_daybyday(
            ExecutionParameters(
                date(2018, 6, 21),
                date(2018, 7, 21),
                0,
                0
            ),
            ExecutionRules({
                'rule-1': {
                    "rule": str(rrule(freq=MONTHLY, bymonthday=1, interval=1, dtstart=date(2018, 6, 21))),
                    "value": 100
                }
            })
        )

        expected = [
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 21),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        }, 
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 22),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        }, 
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 23),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        }, 
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 24),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        },
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 25),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        }, 		
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 26),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        }, 
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 27),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        }, 
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 28),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        },
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 29),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        },
		{
            "balance": {
                "high": 0,
                "low": 0
            },
            "date": date(2018, 6, 30),
            "working_capital": {
                "high": 0,
                "low": 0
            }
        },		
		{
            "balance": {
                "high": 100,
                "low": 0
            },
            "date": date(2018, 7, 1),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 2),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 3),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 4),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 5),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 6),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 7),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 8),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 9),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 10),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 11),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 12),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 13),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 14),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 15),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 16),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 17),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }, 
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 18),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 19),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 20),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        },
		{
            "balance": {
                "high": 100,
                "low": 100
            },
            "date": date(2018, 7, 21),
            "working_capital": {
                "high": 100,
                "low": 100
            }
        }]

        self.assertEqual(expected, actual)