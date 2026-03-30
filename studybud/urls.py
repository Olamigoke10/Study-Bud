"""
URL configuration for studybud project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.http import HttpResponse, HttpResponseNotFound
from django.views.static import serve
from pathlib import Path


def serve_spa_index(_request):
    """
    Serve the built React SPA entrypoint.
    This keeps the app working even when Vercel routes all requests to Django.
    """
    index_path = Path(settings.BASE_DIR) / "frontend" / "dist" / "index.html"
    if not index_path.exists():
        return HttpResponseNotFound("SPA build not found. Deploy build did not generate frontend/dist.")
    return HttpResponse(index_path.read_text(encoding="utf-8"), content_type="text/html")



urlpatterns = [
    path('admin/', admin.site.urls),
    # SPA routes (served by React build)
    path('', serve_spa_index),
    path('login/', serve_spa_index),
    path('register/', serve_spa_index),
    path('activity/', serve_spa_index),
    path('room/<str:pk>/', serve_spa_index),
    path('profile/<str:pk>/', serve_spa_index),

    # Serve built SPA assets directly from Django if platform routing does not.
    path('assets/<path:path>', serve, {'document_root': Path(settings.BASE_DIR) / 'frontend' / 'dist' / 'assets'}),
    path('favicon.svg', serve, {'document_root': Path(settings.BASE_DIR) / 'frontend' / 'dist', 'path': 'favicon.svg'}),
    path('icons.svg', serve, {'document_root': Path(settings.BASE_DIR) / 'frontend' / 'dist', 'path': 'icons.svg'}),

    path('', include('base.urls')),
    path('api/', include('base.api.urls'))
]

# On Vercel (serverless) we route all requests to Django. Serving static via
# Django's staticfiles URLs (when DEBUG=True) is a reliable fallback.
if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
