# Create your models here.
from django.db import models

class Rule(models.Model):
    rule_name = models.CharField(max_length=50, null=True, blank=True)
    rule_frequency = models.CharField(max_length=50, null=True, blank=True)
    rule_amount = models.CharField(max_length=50, null=True, blank=True)
   
    def __str__(self):
        return self.rule_name