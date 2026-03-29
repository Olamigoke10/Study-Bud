"""
Vercel serverless entry for Django.

The Python runtime expects a WSGI callable named ``app`` (not ``application``).
https://github.com/vercel/examples/tree/main/python/django
"""

import os
import sys
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "studybud.settings")

from django.core.wsgi import get_wsgi_application

app = get_wsgi_application()
