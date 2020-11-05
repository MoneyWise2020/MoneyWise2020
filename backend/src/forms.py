from .models import Create_Rule
from django.forms import ModelForm
from django import forms

class RuleForm(ModelForm):

    class Meta:
        model = Create_Rule
        fields = ["rule_name", "rule_frequency", "rule_amount"]