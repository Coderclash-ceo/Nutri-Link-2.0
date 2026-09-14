import google.generativeai as genai
import os
import json
import time
from dotenv import load_dotenv
from ai_core.prompts import NUTRITION_PROMPT
from PIL import Image

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Module-level cache for model listings (1 hour TTL)
_cached_models = None
_cache_time = None

def analyze_food_image(image_path):
    """
    Sends image to Gemini 1.5 Flash and returns parsed JSON.
    """
    # ensure env is loaded (allows hot-reloading keys without restarting server)
    load_dotenv(override=True) 
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        return {"error": "API Key not found. Please add GOOGLE_API_KEY to .env"}
        
    genai.configure(api_key=api_key)

    # Fast vision models prioritizing high quota (1,500 RPD) models
    models_to_try = [
        'models/gemini-flash-lite-latest',
        'models/gemini-1.5-flash',
        'models/gemini-flash-latest',
        'models/gemini-1.5-pro'
    ]

    # Safer File Handling: Read bytes -> Memory
    import io
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    last_error = None

    for model_name in models_to_try:
        try:
            print(f"Trying AI Model: {model_name}...")
            model = genai.GenerativeModel(model_name)
            img = Image.open(io.BytesIO(image_bytes))
            
            response = model.generate_content([NUTRITION_PROMPT, img])
            
            text_response = response.text
            print(f"Raw AI Response: {text_response}")
            
            # More robust JSON extraction
            import re
            json_match = re.search(r'\{.*\}', text_response, re.DOTALL)
            if json_match:
                clean_json = json_match.group(0)
                return json.loads(clean_json)
            
            # Fallback for simple cleaning
            clean_json = text_response.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json)
            
        except Exception as e:
            print(f"Model {model_name} Failed: {e}")
            last_error = e
            
    # If we exit loop, all failed
    return {"error": f"All models failed. Last error: {str(last_error)}"}

def generate_text(prompt):
    """
    Sends text prompt to Gemini and returns string response.
    """
    global _cached_models, _cache_time
    load_dotenv(override=True)
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "Error: No API Key"
        
    genai.configure(api_key=api_key)
    
    # 1-hour cached model lookup
    now = time.time()
    if _cached_models is None or _cache_time is None or (now - _cache_time > 3600):
        try:
            models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            # Exclude anything with 'pro' or 'preview-tts' in the name
            valid_models = [m for m in models if not any(ex in m.lower() for ex in ['pro', 'preview-tts'])]
            
            # Prioritize 'flash-lite' first, then 'flash'
            flash_lite = [m for m in valid_models if 'flash-lite' in m.lower()]
            flash_others = [m for m in valid_models if 'flash' in m.lower() and m not in flash_lite]
            remaining = [m for m in valid_models if m not in flash_lite and m not in flash_others]
            
            models_to_try = flash_lite + flash_others + remaining
            if not models_to_try:
                models_to_try = ['models/gemini-flash-lite-latest', 'models/gemini-flash-latest']
                
            _cached_models = models_to_try
            _cache_time = now
        except Exception as e:
            print(f"Warning: Could not fetch models dynamically: {e}")
            _cached_models = ['models/gemini-flash-lite-latest', 'models/gemini-flash-latest']
            _cache_time = now
            
    models_to_try = _cached_models if _cached_models else ['models/gemini-flash-lite-latest', 'models/gemini-flash-latest']

    for model_name in models_to_try:
        try:
            print(f"NutriChat trying: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"NutriChat {model_name} Fail: {e}")
            
    return "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment."

def analyze_audio(audio_bytes, mime_type="audio/wav", prompt=""):
    """
    Directly processes audio bytes with Gemini 1.5.
    """
    load_dotenv(override=True)
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "Error: No API Key"
        
    genai.configure(api_key=api_key)
    
    # Dynamically find available models
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        excluded = ['gemini-2.5-flash']
        valid_models = [m for m in models if not any(ex in m for ex in excluded)]
        flash_latest = [m for m in valid_models if 'flash-latest' in m.lower()]
        other_models = [m for m in valid_models if m not in flash_latest]
        models_to_try = flash_latest + other_models
    except:
        models_to_try = ['models/gemini-flash-latest', 'models/gemini-1.5-flash']

    for model_name in models_to_try:
        try:
            print(f"NutriVoice trying: {model_name}")
            model = genai.GenerativeModel(model_name)
            
            # Form multi-modal request
            response = model.generate_content([
                prompt,
                {
                    "mime_type": mime_type,
                    "data": audio_bytes
                }
            ])
            return response.text.strip()
        except Exception as e:
            print(f"NutriVoice {model_name} Fail: {e}")
            
    return "I couldn't hear you clearly. Could you please try recording again or typing your request?"
