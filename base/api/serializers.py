from django.contrib.auth.models import User
from rest_framework import serializers

from ..models import Message, Room, Topic


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "user", "body", "created", "updated"]


class RoomListSerializer(serializers.ModelSerializer):
    topic = TopicSerializer(read_only=True)
    host = UserSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ["id", "name", "description", "topic", "host", "created", "updated"]


class RoomDetailSerializer(serializers.ModelSerializer):
    topic = TopicSerializer(read_only=True)
    host = UserSerializer(read_only=True)
    participants = UserSerializer(read_only=True, many=True)
    messages = MessageSerializer(read_only=True, many=True, source="message_set")

    class Meta:
        model = Room
        fields = [
            "id",
            "name",
            "description",
            "topic",
            "host",
            "participants",
            "messages",
            "created",
            "updated",
        ]


class RoomCreateSerializer(serializers.Serializer):
    topic = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def create(self, validated_data):
        request = self.context["request"]
        topic_name = validated_data["topic"].strip()
        topic, _ = Topic.objects.get_or_create(name=topic_name)
        room = Room.objects.create(
            host=request.user,
            topic=topic,
            name=validated_data["name"],
            description=validated_data.get("description"),
        )
        room.participants.add(request.user)
        return room


class RoomUpdateSerializer(serializers.Serializer):
    topic = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class MessageCreateSerializer(serializers.Serializer):
    room = serializers.IntegerField()
    body = serializers.CharField()


class ProfileSerializer(serializers.ModelSerializer):
    rooms = RoomListSerializer(many=True, source="room_set", read_only=True)
    messages = MessageSerializer(many=True, source="message_set", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "rooms", "messages"]
