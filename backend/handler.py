import json
import datetime
from dateutil.relativedelta import relativedelta
from dateutil.rrule import rrulestr

from src.generate_instances import get_instances_up_to
from src.context import ExecutionContext, ExecutionParameters, ExecutionRules


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


def get_instances_from_rules(*args):
    try:
        return _get_instances_from_rules(*args)
    except Exception as e:
        print("Error in handler!!! {}".format(e))
        print()
        return buildErrorResponse(500, 'An internal error occurred.')


def _get_instances_from_rules(event, context):
    parameters = event["queryStringParameters"]
    if parameters is None:
        parameters = {}
    parameters.update({
        'start': '',
        'end': '',
        'current': '',
        'set_aside': '',
        'biweekly_start': '',
    })

    start = parameters['start']
    if start:
        start = datetime.datetime.strptime(start, DATE_FORMAT).date()
    else:
        start = datetime.date.today()
    
    end = parameters['end']
    if end:
        end = datetime.datetime.strptime(end, DATE_FORMAT).date()
    else:
        end = start + relativedelta(months=12)
    
    current = parameters['current']
    if current:
        current = round(float(current), 2)
    else:
        current = 0
    
    set_aside = parameters['set_aside']
    if set_aside:
        set_aside = round(float(set_aside), 2)
    else:
        set_aside = 0
    
    biweekly_start = parameters['biweekly_start']
    if biweekly_start:
        biweekly_start = datetime.datetime.strptime(biweekly_start, DATE_FORMAT).date()
    else:
        biweekly_start = datetime.date(2020, 2, 7)

    try:
        assert start < end, '`start` comes after `end`, when it should come before'
        assert current >= 0, '`current` is negative, when it should be 0 or positive'
        assert set_aside >= 0, '`set_aside` is negative, when it should be 0 or positive'
        assert biweekly_start <= start, '`biweekly_start` is after `start`, when it should be before'
    except AssertionError as e:
        return buildErrorResponse(400, str(e.args[0]))


    parameters = ExecutionParameters(
        start,
        end,
        current,
        set_aside,
        biweekly_start
    )

    rules_map = {}
    try:
        rules_map = json.loads(event["body"], object_hook=datetime_parser)
    except Exception:
        return buildErrorResponse(422, "Body must be valid JSON")
    
    try:
        assert isinstance(rules_map, dict), "Root must be an object/map, like {}"
        for rule_id, rule in rules_map.items():
            assert "value" in rule, f"Rule `{rule_id}` is missing the `value` field"
            assert isinstance(rule["value"], (float, int)), f"Rule `{rule_id}`'s `value` must be a number"
            assert "rule" in rule, f"Rule `{rule_id}` is missing the `rule` field"
    except AssertionError as e:
        return buildErrorResponse(400, str(e.args[0]))

    rules = ExecutionRules(rules_map)
    execution_context = ExecutionContext(parameters, rules)

    all_instances = []
    try:
        all_instances = get_instances_up_to(execution_context)
    except AssertionError as e:
        return buildErrorResponse(400, str(e.args[0]))

    all_instances = list(map(lambda i: i.serialize(), all_instances))

    return buildResponse(200, json.dumps(
        round_floats(all_instances),
        cls=DateTimeEncoder
    ))

if __name__ == "__main__":
    from dateutil.relativedelta import relativedelta

    from script.control import CONTROL
    from script.get_rules import get_rules_by_type


    start = CONTROL["NOW"].to_pydatetime().date()
    end = start + relativedelta(
        months=int(CONTROL["GENERATE_MONTHS"])
    )
    current = CONTROL["CURRENT"]
    set_aside = CONTROL["SET_ASIDE"]
    biweekly_start = CONTROL["BIWEEKLY_START"].to_pydatetime().date()

    event = {
        "queryStringParameters": {
            "start": start.strftime(DATE_FORMAT),
            "end": end.strftime(DATE_FORMAT),
            "current": str(current),
            "set_aside": str(set_aside),
            "biweekly_start": biweekly_start.strftime(DATE_FORMAT)
        }
    }

    event['queryStringParameters'] = None

    event["body"] = json.dumps(get_rules_by_type(), cls=DateTimeEncoder)

    response = get_instances_from_rules(event, None)
    if response["statusCode"] != 200:
        print(response["body"])
    else:
        print(json.dumps(json.loads(response["body"]), indent=4, sort_keys=True))
