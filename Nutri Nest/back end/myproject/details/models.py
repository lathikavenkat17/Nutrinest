from django.db import models
from django.contrib.auth.models import User

DIET_CHOICES = [
    ('none', 'None'),
    ('keto', 'Keto'),
    ('vegan', 'Vegan'),
    ('vegetarian', 'Vegetarian'),
    ('paleo', 'Paleo'),
    ('regular', 'Regular'),
]

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='details_profile')
    name = models.CharField(max_length=100, blank=True)
    age = models.IntegerField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    diet_type = models.CharField(max_length=20, choices=DIET_CHOICES, default='none')

    def __str__(self):
        return self.user.username
