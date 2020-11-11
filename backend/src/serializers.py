from rest_framework import serializers 
from .models import Rule 
 
class RuleSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Rule
        fields = ('id',
                  'name',
                  'frequency',
                  'amount')