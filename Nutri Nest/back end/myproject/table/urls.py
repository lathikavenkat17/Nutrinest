from django.urls import path
from .views import ConsumedFoodCreateView

urlpatterns = [
    path('', ConsumedFoodCreateView.as_view()),  
]