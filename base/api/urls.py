from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', views.getRoutes),
    path('topics/', views.getTopics),
    path('rooms/', views.getRooms),
    path('room/<int:pk>/', views.getRoom),
    path('messages/', views.createMessage),
    path('profile/<int:pk>/', views.getProfile),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.registerUser, name='auth_register'),
]