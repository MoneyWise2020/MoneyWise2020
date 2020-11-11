# Create your models here.
from django.db import models
import uuid

class Rule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, default="")
    frequency = models.CharField(max_length=50, default="")
    amount = models.DecimalField(max_digits=19, decimal_places=2, default=0)
   
    def __str__(self):
        return self.name

