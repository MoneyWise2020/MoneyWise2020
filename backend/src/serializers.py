from rest_framework import serializers 
from .models import Rule 
import logging
 
class RuleSerializer(serializers.Serializer):

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    name = serializers.CharField()
    frequency = serializers.CharField()
    amount = serializers.DecimalField(max_digits=None, decimal_places=2, coerce_to_string=False)

    def create(self, validated_data):
        rule = Rule.objects.create(**validated_data)
        return rule
    
    def update(self, instance, validated_data):
        logging.info(validated_data)
        instance.name = validated_data.get('name', instance.name)
        instance.frequency = validated_data.get('frequency', instance.frequency)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.save()
        return instance
