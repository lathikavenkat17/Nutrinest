from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
import json
from transformers import pipeline

generator = pipeline('text-generation', model='gpt2')

@csrf_exempt
def generate_recipe(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            ingredients = data.get("ingredients", "")
            prompt = f"Create a detailed recipe using these ingredients: {ingredients}"

            results = generator(prompt, max_length=150)
            recipe = results[0]['generated_text']

            return JsonResponse({"recipe": recipe})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return HttpResponseNotAllowed(['POST'])
