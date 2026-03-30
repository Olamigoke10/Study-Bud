from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models import Room
from .serializers import RoomSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'GET /api',
        'GET /api/rooms',
        'GET /api/room/<id>'
    ]
    return Response(routes)


@api_view(['GET'])
def getRooms(request):
    rooms = Room.objects.all()
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getRoom(request, pk):
    try:
        room = Room.objects.get(id=pk)
    except Room.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = RoomSerializer(room, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def registerUser(request):
    """
    Minimal registration endpoint for the React SPA.
    Creates a Django user and returns basic info.
    """
    username = str(request.data.get("username", "")).strip().lower()
    password = str(request.data.get("password", ""))

    if not username or not password:
        return Response(
            {"detail": "username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"detail": "User already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(username=username, password=password)
    return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
    