# import it
from django.http import JsonResponse
from .handler import get_instances_from_rules 
from datetime import date as dt
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
import json

from .models import Rule
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from .serializers import RuleSerializer
from rest_framework.parsers import JSONParser 

@csrf_exempt
def update_rule(request, rule_id):
    rule = Rule.objects.get(id=rule_id)
    rule_data = JSONParser().parse(request)
    rule_serializer = RuleSerializer(rule, data=rule_data)
    if rule_serializer.is_valid():
        rule_serializer.save()
        return JsonResponse(rule_serializer.data)
    return JsonResponse(rule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
def get_rule_list(request):
    rules = Rule.objects.all()
    rule_serializer = RuleSerializer(rules, many=True)
    return JsonResponse(rule_serializer.data, safe=False)

def get_rule(request, rule_id):
    rule = Rule.objects.get(id=rule_id)
    rule_serializer = RuleSerializer(rule) 
    return JsonResponse(rule_serializer.data)     

@csrf_exempt
def create_rule(request):
    rule_data = JSONParser().parse(request)
    rule_serializer = RuleSerializer(data=rule_data)
    if rule_serializer.is_valid():
        rule_serializer.save()
        return JsonResponse(rule_serializer.data, status=status.HTTP_201_CREATED) 
    return JsonResponse(rule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def delete_rule(request, rule_id):
    # user = request.user.id
    try:
        rule = Rule.objects.get(id=rule_id)
        rule.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist as e:
        return JsonResponse({'error': 'Rule not found' }, status=status.HTTP_404_NOT_FOUND)       
    except Exception as e:
        return JsonResponse({'error': str(e)}, safe=False, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  

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
