from django.contrib import admin

# Register your models here.
# myproject/table/admin.py
from django.contrib import admin
from .models import ConsumedFood

admin.site.register(ConsumedFood)
