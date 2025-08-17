from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now, timedelta
from .models import ConsumedFood
from .serializers import ConsumedFoodSerializer

class ConsumedFoodCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        filter_type = request.query_params.get('filter', 'all_time')
        foods = ConsumedFood.objects.filter(user=user)

        if filter_type == "last_day":
            foods = foods.filter(created_at__gte=now() - timedelta(days=1))
        elif filter_type == "last_week":
            foods = foods.filter(created_at__gte=now() - timedelta(weeks=1))
        elif filter_type == "last_month":
            foods = foods.filter(created_at__gte=now() - timedelta(days=30))

        serializer = ConsumedFoodSerializer(foods, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        data = request.data
        food = ConsumedFood.objects.create(
            user=user,
            category=data.get('category'),
            name=data.get('name'),
            quantity=data.get('quantity', 0),
            calories=data.get('calories', 0),
            protein=data.get('protein', 0),
            carbs=data.get('carbs', 0),
            fat=data.get('fat', 0),
        )
        serializer = ConsumedFoodSerializer(food)
        return Response({"message": "Consumed food added", "food": serializer.data})
