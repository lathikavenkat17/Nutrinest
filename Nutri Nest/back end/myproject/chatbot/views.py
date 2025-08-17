import os
import pandas as pd
from django.http import JsonResponse
from django.views import View
import random
import json

# Path to your CSV folder
CSV_FOLDER = os.path.join(os.path.dirname(__file__), "data")  

# Load CSVs into memory
food_data = {
    "meat_egg": pd.read_csv(os.path.join(CSV_FOLDER, "meat_egg_nutrition_100g.csv")),
    "vegetable": pd.read_csv(os.path.join(CSV_FOLDER, "vegetable_nutrition_100g.csv")),
    "indian_food": pd.read_csv(os.path.join(CSV_FOLDER, "indian_food_nutrition_100g.csv")),
    "fruit": pd.read_csv(os.path.join(CSV_FOLDER, "fruit_nutrition_100g.csv")),
}

# To track user conversation state (for demo; in real apps use session/DB)
user_state = {}

class ChatbotView(View):
    # Allow GET for testing
    def get(self, request):
        return JsonResponse({"reply": "Chatbot is alive! Send POST requests to get food suggestions."})

    def post(self, request):
        data = json.loads(request.body)
        user_id = data.get("user_id", "guest")   # unique id per user
        message = data.get("message", "").lower().strip()

        # Initialize state if new user
        if user_id not in user_state:
            user_state[user_id] = {"step": 0, "category": None}

        state = user_state[user_id]

        # Step 0: Start conversation
        if state["step"] == 0:
            state["step"] = 1
            return JsonResponse({"reply": "Do you want food suggestions? (yes/no)"})

        # Step 1: User decision
        if state["step"] == 1:
            if "yes" in message:
                state["step"] = 2
                return JsonResponse({
                    "reply": "What type of food do you need? (meat_egg, vegetable, indian_food, fruit)"
                })
            else:
                state["step"] = 0
                return JsonResponse({"reply": "Okay, no suggestions for now 😊"})

        # Step 2: Choose category
        if state["step"] == 2:
            if message in food_data:
                state["category"] = message
                df = food_data[message]

                # Pick random food once
                sample_row = df.sample(1).iloc[0]
                food_item = sample_row["Food"]
                nutrients = sample_row.to_dict()

                state["step"] = 3
                return JsonResponse({
                    "reply": f"How about **{food_item}**? It will balance your diet. ✅",
                    "nutrients": nutrients,
                    "followup": "Do you want another suggestion? (yes/no)"
                })
            else:
                return JsonResponse({
                    "reply": "Please choose from: meat_egg, vegetable, indian_food, fruit"
                })

        # Step 3: More suggestions?
        if state["step"] == 3:
            if "yes" in message and state["category"]:
                df = food_data[state["category"]]
                sample_row = df.sample(1).iloc[0]
                food_item = sample_row["Food"]
                nutrients = sample_row.to_dict()
                return JsonResponse({
                    "reply": f"Try **{food_item}** this time 🍽️",
                    "nutrients": nutrients,
                    "followup": "Want more suggestions? (yes/no)"
                })
            else:
                state["step"] = 0
                state["category"] = None
                return JsonResponse({"reply": "Alright! Come back anytime for food suggestions."})
