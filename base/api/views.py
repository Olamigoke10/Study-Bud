from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from ..models import Message, Room, Topic
from .serializers import (
    MessageSerializer,
    ProfileSerializer,
    RoomCreateSerializer,
    RoomDetailSerializer,
    RoomListSerializer,
    RoomUpdateSerializer,
    TopicSerializer,
)


@api_view(["GET"])
def getRoutes(request):
    routes = [
        "GET /api",
        "GET /api/topics/",
        "GET /api/rooms/",
        "POST /api/rooms/",
        "GET /api/room/<id>/",
        "PATCH /api/room/<id>/ (host only)",
        "DELETE /api/room/<id>/ (host only)",
        "POST /api/messages/",
        "GET /api/profile/<id>/",
    ]
    return Response(routes)


@api_view(["GET"])
def getTopics(request):
    topics = Topic.objects.all()
    return Response(TopicSerializer(topics, many=True).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def getRooms(request):
    if request.method == "GET":
        rooms = Room.objects.select_related("topic", "host").all()
        return Response(RoomListSerializer(rooms, many=True).data)

    # POST: create room
    serializer = RoomCreateSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    room = serializer.save()
    return Response(RoomDetailSerializer(room).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def getRoom(request, pk):
    room = get_object_or_404(Room, id=pk)

    if request.method == "GET":
        return Response(RoomDetailSerializer(room).data)

    # Mutations: host-only
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.user != room.host:
        return Response({"detail": "Only the room host can modify this room."}, status=status.HTTP_403_FORBIDDEN)

    if request.method in ["PATCH", "PUT"]:
        serializer = RoomUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        if "topic" in validated:
            topic_name = validated["topic"].strip()
            topic, _ = Topic.objects.get_or_create(name=topic_name)
            room.topic = topic

        if "name" in validated:
            room.name = validated["name"]

        if "description" in validated:
            room.description = validated["description"]

        room.save()
        return Response(RoomDetailSerializer(room).data)

    # DELETE
    room.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createMessage(request):
    room = get_object_or_404(Room, id=request.data.get("room"))
    body = str(request.data.get("body", "")).strip()

    if not body:
        return Response({"detail": "Message body is required."}, status=status.HTTP_400_BAD_REQUEST)

    message = Message.objects.create(user=request.user, room=room, body=body)
    room.participants.add(request.user)

    return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([AllowAny])
def getProfile(request, pk):
    user = get_object_or_404(User, id=pk)
    return Response(ProfileSerializer(user).data)


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
    return Response(
        {"id": user.id, "username": user.username},
        status=status.HTTP_201_CREATED,
    )
    