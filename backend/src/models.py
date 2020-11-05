from django.db import models


class Create_Rule(models.Model):
    rule_name = models.CharField("Rule Name", max_length=50, null=True, blank=True)
    rule_frequency = models.CharField("Rule Frequency",  max_length=50, null=True, blank=True)
    rule_amount = models.CharField("Amount", max_length=50, null=True, blank=True)
   
    def __str__(self):
        return self.rule_name