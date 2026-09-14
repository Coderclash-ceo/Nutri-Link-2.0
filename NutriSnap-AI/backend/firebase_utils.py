import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
import base64
import tempfile
from dotenv import load_dotenv
import datetime

load_dotenv(override=True)
with open("debug_firebase.log", "a") as f:
    f.write(f"\n--- {datetime.datetime.now()} ---\n")
    f.write(f"CWD: {os.getcwd()}\n")
    f.write(f"FIREBASE_CREDENTIALS_PATH: {os.getenv('FIREBASE_CREDENTIALS_PATH')}\n")
    f.write(f"File exists? {os.path.exists(os.getenv('FIREBASE_CREDENTIALS_PATH', ''))}\n")


def _write_temp_cred_file(json_str: str) -> str:
    tf = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
    tf.write(json_str.encode("utf-8"))
    tf.flush()
    tf.close()
    return tf.name


def initialize_firebase():
    """Initializes Firebase Admin SDK and returns Firestore client.

    Supports either:
    - `FIREBASE_SERVICE_ACCOUNT_JSON` containing the raw JSON service account payload, or
    - `serviceAccountKey.json` file on disk for local development.
    """
    if firebase_admin._apps:
        return firestore.client()

    # 1. Check for environment variable (Production / Render)
    raw_json_env = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON") or os.getenv("FIREBASE_CREDENTIALS_JSON")
    if raw_json_env:
        try:
            try:
                cred_dict = json.loads(raw_json_env)
            except Exception:
                # Try base64 decode if encoded
                decoded_bytes = base64.b64decode(raw_json_env)
                cred_dict = json.loads(decoded_bytes.decode("utf-8"))
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("Firebase initialized successfully from FIREBASE_SERVICE_ACCOUNT_JSON env var.")
            return firestore.client()
        except Exception as e:
            print(f"Failed to initialize Firebase from environment variable: {e}")
            return None

    # 2. Fallback to local file (Local Development)
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
    if os.path.exists(cred_path):
        try:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"Firebase initialized successfully with {cred_path}")
            return firestore.client()
        except Exception as e:
            print(f"Failed to initialize Firebase from {cred_path}: {e}")
            return None

    print("WARNING: Neither FIREBASE_SERVICE_ACCOUNT_JSON nor serviceAccountKey.json found. Firebase not initialized.")
    return None


# Initialize on module load
db = initialize_firebase()
with open("debug_firebase.log", "a") as f:
    f.write(f"DB Object initialized: {db is not None}\n")
