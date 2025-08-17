from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class ConsumedFood(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consumed_foods')
    category = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    quantity = models.FloatField(help_text="Quantity in grams")

    # Separate nutrient fields
    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    carbs = models.FloatField(default=0)
    fat = models.FloatField(default=0)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} ({self.quantity}g) by {self.user.username}"
