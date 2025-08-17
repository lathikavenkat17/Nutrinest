# backend/myproject/details/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Profile

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.details_profile
            return Response({
                "exists": True,
                "name": profile.name,
                "age": profile.age,
                "height": profile.height,
                "weight": profile.weight,
                "diet_type": profile.diet_type,
            })
        except Profile.DoesNotExist:
            return Response({
                "exists": False,
                "name": "",
                "age": None,
                "height": None,
                "weight": None,
                "diet_type": "none",
            })

    def post(self, request):  # create
        profile = Profile.objects.create(
            user=request.user,
            name=request.data.get("name", ""),
            age=request.data.get("age"),
            height=request.data.get("height"),
            weight=request.data.get("weight"),
            diet_type=request.data.get("diet_type", "none")
        )
        return Response({"message": "Created successfully"})

    def put(self, request):  # update
        profile = request.user.details_profile
        profile.name = request.data.get("name", profile.name)
        profile.age = request.data.get("age", profile.age)
        profile.height = request.data.get("height", profile.height)
        profile.weight = request.data.get("weight", profile.weight)
        profile.diet_type = request.data.get("diet_type", profile.diet_type)
        profile.save()
        return Response({"message": "Updated successfully"})
