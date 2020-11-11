from rest_framework import serializers 
from .models import Rule 
import logging
 
class RuleSerializer(serializers.Serializer):

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    userid = serializers.CharField()
    name = serializers.CharField()
    rrule = serializers.CharField()
    value = serializers.DecimalField(max_digits=None, decimal_places=2, coerce_to_string=False)
    labels = serializers.JSONField()

    def create(self, validated_data):
        rule = Rule.objects.create(**validated_data)
        return rule
    
    def update(self, instance, validated_data):
        logging.info(validated_data)
        instance.name = validated_data.get('name', instance.name)
        instance.rrule = validated_data.get('rrule', instance.rrule)
        instance.value = validated_data.get('value', instance.value)
        instance.save()
        return instance
