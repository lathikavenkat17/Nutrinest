from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSV_PATHS = {
    'dish': os.path.join(BASE_DIR, 'data', 'indian_food_nutrition_100g.csv'),
    'fruit': os.path.join(BASE_DIR, 'data', 'fruit_nutrition_100g.csv'),
    'vegetable': os.path.join(BASE_DIR, 'data', 'vegetable_nutrition_100g.csv'),
    'meat': os.path.join(BASE_DIR, 'data', 'meat_egg_nutrition_100g.csv')
}

@csrf_exempt
def get_nutrition(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body)
        category = body.get('category', '').lower()
        name = body.get('name', '').strip().lower()

        if category not in CSV_PATHS:
            return JsonResponse({'error': 'Invalid category'}, status=400)

        df = pd.read_csv(CSV_PATHS[category])
        df.columns = [col.strip().lower() for col in df.columns]
        df[df.columns[0]] = df[df.columns[0]].astype(str).str.strip().str.lower()

        match = df[df[df.columns[0]] == name]

        if match.empty:
            return JsonResponse({'message': 'Not found'}, status=404)

        return JsonResponse(match.iloc[0].to_dict(), status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class SuggestFoodView(APIView):
    def post(self, request):
        data = request.data
        weight = float(data.get("weight"))
        height = float(data.get("height"))
        age = int(data.get("age"))
        gender = data.get("gender")
        activity = data.get("activity")
        goal = data.get("goal")

        # Basic BMR calculation (Mifflin-St Jeor)
        if gender == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        activity_factor = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "very": 1.725
        }.get(activity, 1.2)

        calories = bmr * activity_factor

        if goal == "lose":
            calories -= 500
        elif goal == "gain":
            calories += 500

        # Dummy food suggestions based on calories (in real use, fetch from DB or API)
        if calories < 1600:
            suggestions = ["Oats", "Grilled chicken salad", "Fruit bowl", "Green smoothie"]
        elif calories < 2200:
            suggestions = ["Brown rice", "Tofu stir-fry", "Boiled eggs", "Vegetable soup"]
        else:
            suggestions = ["Quinoa", "Peanut butter toast", "Paneer curry", "Banana shake"]

        return Response({"calories": round(calories), "suggestions": suggestions})
