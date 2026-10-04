from rest_framework import serializers

from .models import Category, Email, Action, Draft, ActivityLog


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "color",
            "created_at",
            "updated_at",
        ]


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = [
            "id",
            "gmail_id",
            "thread_id",
            "sender",
            "subject",
            "snippet",
            "body",
            "received_at",
            "category",
            "priority",
            "summary",
            "is_processed",
            "created_at",
            "updated_at",
        ]


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = [
            "id",
            "email",
            "description",
            "deadline",
            "status",
            "created_at",
            "updated_at",
        ]


class DraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Draft
        fields = [
            "id",
            "email",
            "body",
            "status",
            "created_at",
            "updated_at",
        ]


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "event",
            "details",
            "created_at",
        ]