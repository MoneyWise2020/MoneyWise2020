import json
from django.test import TestCase
from datetime import datetime, date
from src.handler import *
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY, MO


DATE_FORMAT = "%Y-%m-%d"

def get_transactions(params, rules):
    response = get_instances_from_rules(ExecutionRules(rules), params)
    return response

class HandlerTests(TestCase):
    def setUp(self):
        self.maxDiff = 5000

    def test_buildResponse(self):
        expected = {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
        },
        "body": "{\"Good\": \"Request\"}"
        }

        self.assertEqual(expected, buildResponse(200, "{\"Good\": \"Request\"}"))

    def test_buildResponseError(self):
        expected = {
            "statusCode": 400,
            "headers": {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            "body": "{\"message\": \"Horrible Request\", \"code\": 400}"
        }

        self.assertEqual(expected, buildErrorResponse(400, "Horrible Request"))

    def test_datetime_parser(self):
        inputDict = {"time": "2018-06-21"}
        expected = {"time": datetime.date(2018, 6, 21)}
        self.assertEqual(expected, datetime_parser(inputDict))



    def test_get_instances_from_rules_oneRule(self):
        actual = get_transactions(
            ExecutionParameters(
                datetime.date(2018, 6, 21),
                datetime.date(2018, 7, 21),
                0,
                0
            ),
            {
                'rule-1': {
                    "rule": str(rrule(freq=MONTHLY, bymonthday=1, interval=1, dtstart=datetime.date(2018, 6, 21))),
                    "value": 100
                }
            }
        )

        expected = [{
            "rule_id": "rule-1",
            "id": "rule-1::2018-07-01",
            "value": 100,
            "day": datetime.date(2018, 7, 1),
            "calculations": {
                "balance": 100.0,
                "working_capital": 100.0
            }
        }]

        self.assertEqual(expected, actual)

    def test_get_instances_from_rules_multipleRules(self):
        actual = get_transactions(
            ExecutionParameters(
                datetime.date(2018, 6, 21),
                datetime.date(2018, 7, 2),
                0,
                0
            ),
            {
                'rule-1': {
                    "rule": str(rrule(freq=MONTHLY, bymonthday=1, interval=1, dtstart=datetime.date(2018, 6, 21))),
                    "value": 100
                },
                'rule-2': {
                    "rule": str(rrule(freq=WEEKLY, byweekday=[MO], interval=1, dtstart=datetime.date(2018, 6, 21))),
                    "value": -10
                }
            }
        )

        expected = [{
            "rule_id": "rule-2",
            "id": "rule-2::2018-06-25",
            "value": -10,
            "day": datetime.date(2018, 6, 25),
            "calculations": {
                "balance": -10.0,
                "working_capital": -10.0
            }
        }, {
            "rule_id": "rule-1",
            "id": "rule-1::2018-07-01",
            "value": 100,
            "day": datetime.date(2018, 7, 1),
            "calculations": {
                "balance": 90.0,
                "working_capital": -10.0
            }
        },{
            "rule_id": "rule-2",
            "id": "rule-2::2018-07-02",
            "value": -10,
            "day": datetime.date(2018, 7, 2),
            "calculations": {
                "balance": 80.0,
                "working_capital": 80.0
            }
        }]

        self.assertEqual(expected, actual)
