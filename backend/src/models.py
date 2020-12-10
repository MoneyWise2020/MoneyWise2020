# Create your models here.
from django.db import models
import uuid

USERID_MAX_LENGTH = 128
NAME_MAX_LENGTH = 50
RRULE_MAX_LENGTH = 1024
VALUE_MAX_DIGITS = 19
VALUE_MAX_DECIMAL_DIGITS = 2

class Rule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userid = models.CharField(max_length=USERID_MAX_LENGTH, editable=False)

    name = models.CharField(max_length=NAME_MAX_LENGTH, default="")
    rrule = models.CharField(max_length=RRULE_MAX_LENGTH, default="")
    value = models.DecimalField(max_digits=VALUE_MAX_DIGITS, decimal_places=VALUE_MAX_DECIMAL_DIGITS, default=0)

    labels = models.JSONField(default=dict)

   
    def __str__(self):
        return self.name
