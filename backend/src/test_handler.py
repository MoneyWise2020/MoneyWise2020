from django.test import TestCase
from datetime import datetime
from src.handler import *

class HandlerTests(TestCase):

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


    