from django.urls import path
from . import views

urlpatterns = [
    path('api/ping', views.hello_world),
    path('api/transactions', views.process_transactions),
#    path('createrule', views.createrule),
]
