# import json
# import firebase_admin
# from firebase_admin import credentials, firestore, storage
# import os
# import sys

# import logging

# logger = logging.getLogger(__name__)

# firebase_app = None
# db = None
# bucket = None


# # ===========================Exe file========================
# # def resource_path(relative_path):
# #     """Get absolute path to resource, works for dev and PyInstaller exe"""
# #     try:
# #         base_path = sys._MEIPASS  # PyInstaller temp folder
# #         print("base_path:", base_path)
# #     except Exception:
# #         base_path = os.path.abspath(".")

# #     return os.path.join(base_path, relative_path)


# # def initialize_firebase():
# #     global firebase_app, db, bucket
# #     try:
# #         if not firebase_admin._apps:
# #             cred_path = resource_path("firebase_config.json")
# #             firebase_app = firebase_admin.initialize_app(
# #                 credentials.Certificate(cred_path)
# #             )
# #             logging.info("Firebase app initialized:---", firebase_app)  # Add this line

# #         db = firestore.client()

# #     except FileNotFoundError:
# #         print("❌Error: firebase_config.json file not found.")
# #     except Exception as e:
# #         print(f"❌Error initializing Firebase: {e}")


# # # Automatically initialize on import
# # initialize_firebase()

# ======================================Render file===============================
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage

firebase_app = None
db = None
bucket = None


def initialize_firebase():
    global firebase_app, db, bucket
    try:
        if not firebase_admin._apps:
            # Load service account JSON from environment variable
            firebase_json = os.getenv("FIREBASE_CONFIG_JSON")
            if not firebase_json:
                print("❌ Environment variable FIREBASE_CONFIG_JSON not found.")
                return

            cred_dict = json.loads(firebase_json)
            cred = credentials.Certificate(cred_dict)

            firebase_app = firebase_admin.initialize_app(cred)
            print("✅ Firebase app initialized.")

        db = firestore.client()

    except json.JSONDecodeError:
        print("❌ Error decoding FIREBASE_CONFIG JSON.")
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")


# Automatically initialize on import
initialize_firebase()
