import logging

from .handler import get_instances_from_rules 
from datetime import date
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
from dateutil.relativedelta import relativedelta
import dateutil.parser
import json

from .models import Rule
from .serializers import RuleSerializer

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

@api_view(['GET'])
def process_transactions(request):
    userId = request.GET.get('userid', '')
    currentBalanceParam = request.GET.get('currentBalance', '0')
    startParam = request.GET.get('startDate', '')
    endParam = request.GET.get('endDate', '')

    if userId == '':
        return Response({ "Error": "userid must be provided." }, status=status.HTTP_400_BAD_REQUEST)

    if startParam == '':
        return Response({ "Error": "startDate must be provided." }, status=status.HTTP_400_BAD_REQUEST)

    if endParam == '':
        return Response({ "Error": "endDate must be provided." }, status=status.HTTP_400_BAD_REQUEST)         

    try:
        start = dateutil.parser.parse(startParam).date()
    except (ValueError):
        return Response({ "Error": "startDate (YYYY-MM-DD): " + startParam + " is invalid." }, status=status.HTTP_400_BAD_REQUEST)      

    try:
        end = dateutil.parser.parse(endParam).date()
    except (ValueError):
        return Response({ "Error": "endDate (YYYY-MM-DD): " + endParam + " is invalid." }, status=status.HTTP_400_BAD_REQUEST)

    now = date.today()

    if start > end:
        return Response({ "Error": "End date should be after start date." }, status=status.HTTP_400_BAD_REQUEST)

    if start < now:
        return Response({ "Error": "Start date should be the current date or a future date." }, status=status.HTTP_400_BAD_REQUEST)

    if start > now + relativedelta(years=3) or end > start + relativedelta(years=3):
        return Response({ "Error": "We do not support projections more than 3 years in the future." }, status=status.HTTP_400_BAD_REQUEST)    

    queryBody = get_transaction_formatted_rule_list(userId)
    if queryBody == '{}':
        logging.info("No rules for user.")
        return Response({ "transactions": [] })          

    results = get_instances_from_rules({
        "queryStringParameters": {
            "start": start.strftime("%Y-%m-%d"),
            "end": end.strftime("%Y-%m-%d"),
            "current": currentBalanceParam,
            "set_aside": "0",
            "biweekly_start": start.strftime("%Y-%m-%d")
        },
        "body": queryBody
    }, None)

    transactions = json.loads(results["body"])
    return Response({ "transactions": transactions })
