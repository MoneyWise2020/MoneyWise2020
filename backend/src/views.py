import logging

from .handler import get_instances_from_rules 
from datetime import date
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
from dateutil.relativedelta import relativedelta
from dateutil.parser._parser import ParserError
import dateutil.parser
import json

from .models import Rule
from .serializers import RuleSerializer
from .exe_context import ExecutionParameters

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder

def _get_userid(request):
    # TODO: get from auth, not from query param
    userid = request.query_params.get('userid')
    return userid

@api_view(['GET', 'POST'])
def rules_handler(request):
    userid = _get_userid(request)
    if not userid:
        return Response({ "message": "`userid` query param is required" }, status=status.HTTP_400_BAD_REQUEST)

    try:
        if request.method == 'GET': 
            return(get_rule_list(request, userid))
        if request.method == "POST":
            return(create_rule(request, userid))
    except Exception as e:
        response_message = {'message': "Apologies, we had a small hiccup. Please try again (just in case!) or contact moneywise support."}
        logging.error(f"Unexpected error: {e}")
        return Response(response_message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'DELETE', 'PUT'])
def rules_by_id_handler(request, rule_id):
    userid = _get_userid(request)
    if not userid:
        return Response({ "message": "`userid` query param is required" }, status=status.HTTP_400_BAD_REQUEST)

    try:
        if request.method == 'GET': 
            return(get_rule(request, rule_id, userid))
        elif request.method == 'DELETE':
            return(delete_rule(request, rule_id, userid))
        elif request.method == 'PUT':
            return(update_rule(request, rule_id, userid))
    except ObjectDoesNotExist as e:
        response_message = { "message": f"Rule `{rule_id}` does not exist for userid `{userid}`" }
        logging.warn(response_message)
        return Response(response_message, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        response_message = {'message': "Apologies, we had a small hiccup. Please try again (just in case!) or contact moneywise support."}
        logging.error(f"Unexpected error: {e}")
        return Response(response_message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def update_rule(request, rule_id, userid):
    rule = Rule.objects.get(id=rule_id, userid=userid)
    rule_data = JSONParser().parse(request)
    rule_data["userid"] = userid
    rule_serializer = RuleSerializer(rule, data=rule_data)
    if rule_serializer.is_valid():
        rule_serializer.save()
        return Response(rule_serializer.data)
    return Response(rule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def get_rule_list(request, userid):
    rules = Rule.objects.filter(userid=userid)
    rule_serializer = RuleSerializer(rules, many=True)
    return Response({ "data": rule_serializer.data })

def get_rule(request, rule_id, userid):
    rule = Rule.objects.get(id=rule_id, userid=userid)
    rule_serializer = RuleSerializer(rule) 
    return Response(rule_serializer.data)     

def create_rule(request, userid):
    rule_data = JSONParser().parse(request)
    rule_data['userid'] = userid
    rule_serializer = RuleSerializer(data=rule_data)
    if rule_serializer.is_valid():
        rule_serializer.save()
        j = Response(rule_serializer.data, status=status.HTTP_201_CREATED) 
        return j
    return Response(rule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def delete_rule(request, rule_id, userid):
    rule = Rule.objects.get(id=rule_id, userid=userid)
    rule.delete()
    return Response(None, status=status.HTTP_204_NO_CONTENT)

def get_transaction_formatted_rule_list(userid):
    rules = Rule.objects.filter(userid=userid)
    rrules = RuleSerializer(rules, many=True).data
    jsonBodyForTransactionQuery = {}

    for rrule in rrules:
        #TODO Switch to 'id' instead of 'name' when the UI is ready for it
        jsonBodyForTransactionQuery[rrule['name']] = {
            "rule": rrule['rrule'],
            "value": float(rrule['value'])
        }

    return json.dumps(jsonBodyForTransactionQuery, cls=DjangoJSONEncoder)

@api_view(['GET'])
def hello_world(request):
    return Response({ "status": "UP" })


def make_execution_parameters(request):
    
    start = request.GET.get('startDate', '')
    if start:
        start = dateutil.parser.parse(start).date()
    else:
        start = date.today()
    
    end = request.GET.get('endDate', '')
    if end:
        end = dateutil.parser.parse(end).date()
    else:
        end = start + relativedelta(months=12)
    
    current = request.GET.get('currentBalance', '0')
    if current:
        current = round(float(current), 2)
    else:
        current = 0
    
    set_aside = 0 # TODO: support this later
    if set_aside:
        set_aside = round(float(set_aside), 2)
    else:
        set_aside = 0
    
    biweekly_start = start # TODO: check if this is needed

    assert start < end, '`start` comes after `end`, when it should come before'
    assert current >= 0, '`current` is negative, when it should be 0 or positive'
    assert set_aside >= 0, '`set_aside` is negative, when it should be 0 or positive'
    assert biweekly_start <= start, '`biweekly_start` is after `start`, when it should be before'

    assert end <= start + relativedelta(years=3), "We do not support projections spanning more than 3 years."

    return ExecutionParameters(
        start,
        end,
        current,
        set_aside,
        biweekly_start
    )

@api_view(['GET'])
def process_transactions(request):
    userid = _get_userid(request)
    if not userid:
        return Response({ "message": "`userid` query param is required" }, status=status.HTTP_400_BAD_REQUEST)
    
    # Pull out parameters
    execution_params = None
    try:
        execution_params = make_execution_parameters(request)
    except AssertionError as e:
        return Response({ "error": str(e) }, status=status.HTTP_400_BAD_REQUEST)
    except ParserError as e:
        return Response({ "error": str(e) }, status=status.HTTP_400_BAD_REQUEST)
    
    queryBody = get_transaction_formatted_rule_list(userid)
    if queryBody == '{}':
        logging.info("No rules for user.")
        return Response({ "transactions": [] })          

    results = get_instances_from_rules({
        "body": queryBody
    }, execution_params)

    transactions = json.loads(results["body"])
    return Response({ "transactions": transactions })
