import json
import datetime
from dateutil.relativedelta import relativedelta
from dateutil.rrule import rrulestr

from .generate_instances import get_instances_up_to 
from .exe_context import ExecutionContext, ExecutionParameters, ExecutionRules


# same as date.isoformat(), it seems
DATE_FORMAT = "%Y-%m-%d"

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.strftime(DATE_FORMAT)


def round_floats(o):
    if isinstance(o, float): return round(o, 2)
    if isinstance(o, dict): return {k: round_floats(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)): return [round_floats(x) for x in o]
    return o


def datetime_parser(dct):
    for k, v in dct.items():
        if isinstance(v, str):
            try:
                dct[k] = datetime.datetime.strptime(v, DATE_FORMAT).date()
            except:
                pass
    return dct


def buildResponse(code: int, body: str):
    return {
        "statusCode": code,
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
        },
        "body": body
    }


def buildErrorResponse(code: int, message: str):
    return buildResponse(code, json.dumps({"message": message, "code": code}))


def get_instances_from_rules(rules, parameters):
    execution_context = ExecutionContext(parameters, rules)
    transactions = get_instances_up_to(execution_context)
    serialized_transactions = list(map(lambda i: i.serialize(), transactions))
    return round_floats(serialized_transactions)
