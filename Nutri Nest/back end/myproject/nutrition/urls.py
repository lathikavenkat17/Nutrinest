from django.urls import path
from .views import get_nutrition,SuggestFoodView

urlpatterns = [
    path('nutrition/', get_nutrition),
    path('nutrition/suggest/', SuggestFoodView.as_view(), name='food_suggest'),
]
