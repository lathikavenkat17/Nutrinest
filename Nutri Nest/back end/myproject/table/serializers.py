from rest_framework import serializers
from .models import ConsumedFood

class ConsumedFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsumedFood
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
