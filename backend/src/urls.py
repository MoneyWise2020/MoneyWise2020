from django.urls import path
from . import views

urlpatterns = [
    path('api/ping', views.hello_world),
    path('api/transactions', views.process_transactions),
    path('api/rules_handler', views.rules_handler),
    path('api/rules_by_id_handler/<str:rule_id>', views.rules_by_id_handler),    
]
