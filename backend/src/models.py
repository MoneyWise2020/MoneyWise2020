# Create your models here.
from django.db import models
import uuid

class Rule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)
    frequency = models.CharField(max_length=50, null=True, blank=True)
    amount = models.CharField(max_length=50, null=True, blank=True)
   
    def __str__(self):
        return self.name
