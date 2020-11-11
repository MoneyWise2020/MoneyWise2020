# Create your models here.
from django.db import models
import uuid

class Rule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userid = models.CharField(max_length=128, editable=False)

    name = models.CharField(max_length=50, default="")
    rrule = models.CharField(max_length=1024, default="")
    value = models.DecimalField(max_digits=19, decimal_places=2, default=0)

    labels = models.JSONField(default=dict)

   
    def __str__(self):
        return self.name
