from django.urls import path
from . import views

urlpatterns = [
    path('api/ping', views.hello_world),
    path('api/transactions', views.process_transactions),
    path('api/delete_rule/<str:rule_id>', views.delete_rule),
    path('api/create_rule', views.create_rule),
    path('api/get_rule/<str:rule_id>', views.get_rule),    
    path('api/get_rule_list', views.get_rule_list),    
    path('api/update_rule/<str:rule_id>', views.update_rule),
]

