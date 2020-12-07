from behave import given, when, then, step
from datetime import date
from datetime import datetime
from dateutil.relativedelta import relativedelta
import requests
import json


@given('{userId} has rules in the database')
def step_database_rules(context, userId):

    context.userIdUniqueSuffix =  datetime.now().strftime("%Y%m%d%H%M%S")
    context.url = 'http://localhost:8000/api/rules?userid=' + userId #+ context.userIdUniqueSuffix
    context.headers = {'content-type': 'application/json'}
    context.body = {
        "name": "Coffee",
        "rrule": "FREQ=DAILY;INTERVAL=1",
        "value": -5
    }

    context.res = requests.post(context.url, data=json.dumps(context.body), headers=context.headers)
    assert context.res.status_code == 201


@when('{userId} tries to export his transactions to CSV')
def step_export_transactions(context, userId):

    context.startDate = date.today()
    context.endDate = context.startDate + relativedelta(days=1)
    context.url = 'http://localhost:8000/api/export_transactions?userid=' + userId + '&currentBalance=0&startDate=' + context.startDate.strftime("%Y-%m-%d") + '&endDate=' + context.endDate.strftime("%Y-%m-%d")
    # context.url = 'http://localhost:8000/api/export_transactions?userid=' + userId + context.userIdUniqueSuffix + '&currentBalance=0&startDate=' + context.startDate.strftime("%Y-%m-%d") + '&endDate=' + context.endDate.strftime("%Y-%m-%d")
    context.res = requests.get(context.url)
    assert context.res.status_code == 200


@then('{userId} gets a CSV of transactions with headers for day, rule id, value, balance, and disposable income')
def step_csv_file(context, userId):

    assert context.res.status_code == 200

    lines = context.res.text
    csvLines = lines.splitlines()
    assert len(csvLines) > 1

    headers = csvLines[0].split(',')
    assert len(headers) == 5
    assert headers.count('day') == 1
    assert headers.count('rule_id') == 1
    assert headers.count('value') == 1
    assert headers.count('balance') == 1
    assert headers.count('disposable_income') == 1

    csv = csvLines[1].split(',')
    assert len(csv) == 5
    assert csv.count('Coffee') == 1
    assert csv.count('-5.0') == 2
    assert csv.count('-10.0') == 1
    assert csv.count(context.startDate.strftime("%Y-%m-%d")) == 1
