import logging

from .handler import get_instances_from_rules 
from datetime import date as dt
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
import json

from .models import Rule
from .serializers import RuleSerializer

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from django.core.exceptions import ObjectDoesNotExist


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

@api_view(['GET', 'POST'])
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
    rule_serializer = RuleSerializer(rule, data=rule_data)
    if rule_serializer.is_valid():
        rule_serializer.save()
        return Response(rule_serializer.data)
    return Response(rule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def get_rule_list(request, userid):
    rules = Rule.objects.all(userid=userid)
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
    return HttpResponse(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def hello_world(request):
    return Response({ "status": "UP" })

@api_view(['POST'])
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
    return Response({ "transactions": transactions })
