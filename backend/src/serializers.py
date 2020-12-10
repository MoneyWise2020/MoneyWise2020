from rest_framework import serializers 
from .models import Rule, USERID_MAX_LENGTH, NAME_MAX_LENGTH, VALUE_MAX_DIGITS, VALUE_MAX_DECIMAL_DIGITS
import logging
from dateutil.rrule import rrulestr


def rrule_validation(rrule: str) -> str:
    try:
        rrulestr(rrule)
        return rrule
    except Exception:
        raise serializers.ValidationError("Invalid recurrence rule")

def name_validation(name: str) -> str:
    if (len(name) > NAME_MAX_LENGTH):
        raise serializers.ValidationError("Rule name can be no be no more than " + str(NAME_MAX_LENGTH) + " characters in length")
    return name

def userid_validation(userid: str) -> str:
    if (len(userid) > USERID_MAX_LENGTH):
        raise serializers.ValidationError("Userid can be no be no more than " + str(USERID_MAX_LENGTH) + " characters in length")
    return userid    

class RuleSerializer(serializers.Serializer):

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    userid = serializers.CharField(validators=[userid_validation])
    name = serializers.CharField(validators=[name_validation])
    rrule = serializers.CharField(validators=[rrule_validation])
    value = serializers.DecimalField(max_digits=VALUE_MAX_DIGITS, decimal_places=VALUE_MAX_DECIMAL_DIGITS, coerce_to_string=False)
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
