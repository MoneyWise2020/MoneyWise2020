# import it
from django.http import JsonResponse

def hello_world(request):

    # do something with the your data
    data = {"hello": "world"}

    # just return a JsonResponse
    return JsonResponse(data)
