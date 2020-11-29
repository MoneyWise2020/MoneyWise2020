import logging

from datetime import date
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
from dateutil.relativedelta import relativedelta
from dateutil.parser._parser import ParserError
import dateutil.parser
import json

from .models import Rule
from .serializers import RuleSerializer
from .exe_context import ExecutionParameters, ExecutionRules, ExecutionContext
from .generate_instances import get_transactions_up_to
from .daybydays import generate_daybydays

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
        # TODO: global exception handler
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

@api_view(['GET'])
def hello_world(request):
    return Response({ "status": "UP" })


def make_execution_parameters(request) -> ExecutionParameters:
    """
    Extracts execution parameters from request
    """
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
    
    set_aside = request.GET.get('setAside', '0')
    if set_aside:
        set_aside = round(float(set_aside), 2)
    else:
        set_aside = 0

    parameters = ExecutionParameters(
        start,
        end,
        current,
        set_aside
    )
    parameters.assert_valid()

    return parameters


def make_execution_rules(rules) -> ExecutionRules:
    """
    Converts serialized rules from database into ExecutionRules object
    """
    rule_map = {}

    for rule in rules:
        #TODO Switch to 'id' instead of 'name' when the UI is ready for it
        rule_map[rule['name']] = {
            "rule": rule['rrule'],
            "value": float(rule['value'])
        }
    
    rules = ExecutionRules(rule_map)
    rules.assert_valid()
    return rules
    

def get_rules_from_database(userid: str) -> ExecutionRules:
    # Get rules from database
    database_rules = Rule.objects.filter(userid=userid)
    serialized_rules = RuleSerializer(database_rules, many=True).data
    return make_execution_rules(serialized_rules)

@api_view(['GET'])
def process_transactions(request):
    userid = _get_userid(request)
    if not userid:
        return Response({ "message": "`userid` query param is required" }, status=status.HTTP_400_BAD_REQUEST)
    
    # Pull out parameters
    parameters = None
    try:
        parameters = make_execution_parameters(request)
    except ValueError as e:
        return Response({ "error": str(e) }, status=status.HTTP_400_BAD_REQUEST)
    except AssertionError as e:
        return Response({ "error": str(e) }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
    
    
    rules = None
    try:
        rules = get_rules_from_database(userid)
    except Exception as e:
        logging.error(f"Error while getting rules from database", e)
        return Response({ "message": "Internal Server Error" }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Calculate transactions
    transactions = get_transactions_up_to(ExecutionContext(parameters, rules))
    results = list(map(lambda i: i.serialize(), transactions))

    return Response({ "transactions": results })


@api_view(['GET'])
def process_daybydays(request):
    userid = _get_userid(request)
    if not userid:
        return Response({ "message": "`userid` query param is required" }, status=status.HTTP_400_BAD_REQUEST)
    
    # Pull out parameters
    parameters = None
    try:
        parameters = make_execution_parameters(request)
    except ValueError as e:
        return Response({ "error": str(e) }, status=status.HTTP_400_BAD_REQUEST)
    except AssertionError as e:
        return Response({ "error": str(e) }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
    
    
    rules = None
    try:
        rules = get_rules_from_database(userid)
    except Exception as e:
        logging.error(f"Error while getting rules from database", e)
        return Response({ "message": "Internal Server Error" }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Calculate daybydays
    daybydays = generate_daybydays(ExecutionContext(parameters, rules))

    return Response({ "daybydays": daybydays })