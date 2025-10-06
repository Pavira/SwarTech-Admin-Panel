import builtins
import logging
import os
import sys
import threading
import webbrowser

# ---------- Ensure app/ is importable ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
# --------------------------------------------
from app.api.v1.routes.auth import signin
from app.api.v1.routes.project import projects
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI()

# log_file = os.path.join(os.path.dirname(__file__), "app.log")
# logging.basicConfig(
#     level=logging.DEBUG,
#     format="%(asctime)s [%(levelname)s] %(message)s",
#     handlers=[logging.FileHandler(log_file, encoding="utf-8")],
# )
# logger = logging.getLogger("app")

# # Redirect print → logger.info
# builtins.print = lambda *args, **kwargs: logger.info(" ".join(map(str, args)))


def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller EXE"""
    try:
        base_path = sys._MEIPASS  # When running as .exe
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


# ---------- Configuration ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = resource_path("frontend")

app.include_router(projects.router, prefix="/api/v1/project")
app.include_router(signin.router, prefix="/api/v1/auth")

# ---------- Static Files ----------
app.mount("/admin", StaticFiles(directory=FRONTEND_DIR, html=True), name="admin")


@app.get("/", include_in_schema=False)
def serve_signin():
    return FileResponse(resource_path("frontend/pages/auth/signin.html"))


# ---------- Open browser function ----------
def open_browser(url: str):
    """Open default browser to the given URL."""
    threading.Timer(
        1.0, lambda: webbrowser.open(url)
    ).start()  # small delay for server start


# ---------- Run server ----------
# if __name__ == "__main__":
#     url = "http://127.0.0.1:8000/"

#     # Open browser in a separate thread
#     open_browser(url)

#     # Start FastAPI server (blocking)
#     uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
