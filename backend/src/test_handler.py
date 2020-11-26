import json
from django.test import TestCase
from datetime import datetime, date
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY, MO
from .exe_context import ExecutionParameters, ExecutionRules, ExecutionContext
from .generate_instances import get_transactions_up_to

DATE_FORMAT = "%Y-%m-%d"

def get_transactions(parameters, rules):
    transactions = get_transactions_up_to(ExecutionContext(parameters, rules))
    return list(map(lambda i: i.serialize(), transactions))


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
