# import it
from django.http import JsonResponse
from src.transactions.handler import get_instances_from_rules
from datetime import date as dt
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
import json

def hello_world(request):
    return JsonResponse({ "status": "UP" })

def process_transactions(request):
    start = dt(2020, 10, 29)
    end = dt(2021, 10, 29)
    biweekly_start = dt(2020, 10, 29)

    results = get_instances_from_rules({
        "queryStringParameters": {
            "start": start.strftime("%Y-%m-%d"),
            "end": end.strftime("%Y-%m-%d"),
            "current": "1000",
            "set_aside": "0",
            "biweekly_start": biweekly_start.strftime("%Y-%m-%d")
        },
        "body": json.dumps({
            "gas": {
                "rule": str(rrule(freq=WEEKLY, byweekday=1)),
                "value": -100,
            },
            "rent": {
                "rule": str(rrule(freq=MONTHLY, byweekday=1)),
                "value": -2000,
            },
            "paycheck": {
                "rule": str(rrule(freq=WEEKLY, byweekday=3, interval=2)),
                "value": -2000,
            }
        })
    }, None)

    transactions = json.loads(results["body"])
    return JsonResponse({ "transactions": transactions })
