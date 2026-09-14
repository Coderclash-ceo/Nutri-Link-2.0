import os
from backend.main import app

# This file acts as a proxy for deployment platforms (like Render or Vercel)
# that default to looking for an 'app' object in an 'app.py' file.

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
