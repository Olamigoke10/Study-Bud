"""
WSGI entry for Vercel: runtime expects a callable named ``app`` at a top-level path.

Keep Django's ``studybud.wsgi`` as ``application`` for runserver; this file is for serverless.
"""

import os
import sys
from pathlib import Path

_root = Path(__file__).resolve().parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "studybud.settings")

from django.core.wsgi import get_wsgi_application

app = get_wsgi_application()
