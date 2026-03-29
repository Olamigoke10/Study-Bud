"""
Alternate Vercel path (api/wsgi.py). Delegates to root ``wsgi`` module.
"""

import sys
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from wsgi import app  # noqa: F401
