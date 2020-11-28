from django.urls import path
from . import views

urlpatterns = [
    path('api/ping', views.hello_world),
    path('api/transactions', views.process_transactions),
    path('api/daybydays', views.process_daybydays),     
    path('api/rules', views.rules_handler),
    path('api/rules/<str:rule_id>', views.rules_by_id_handler),    
]
