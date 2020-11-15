from rest_framework import serializers 
from .models import Rule 
import logging
from dateutil.rrule import rrulestr


def rrule_validation(rrule: str) -> str:
    try:
        rrulestr(rrule)
        return rrule
    except Exception:
        raise serializers.ValidationError("Invalid recurrence rule")


class RuleSerializer(serializers.Serializer):

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    userid = serializers.CharField()
    name = serializers.CharField()
    rrule = serializers.CharField(validators=[rrule_validation])
    value = serializers.DecimalField(max_digits=19, decimal_places=2, coerce_to_string=False)
    labels = serializers.JSONField(required=False)

    def create(self, validated_data):
        rule = Rule.objects.create(**validated_data)
        return rule
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.rrule = validated_data.get('rrule', instance.rrule)
        instance.value = validated_data.get('value', instance.value)
        instance.labels = validated_data.get('labels', instance.labels)
        instance.save()
        return instance
