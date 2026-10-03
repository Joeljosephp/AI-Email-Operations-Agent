from django.conf import settings
from django.db import models


class Category(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories"
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_category_per_user"
            )
        ]

    def __str__(self):
        return self.name


class Email(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="emails"
    )

    gmail_id = models.CharField(max_length=255)
    thread_id = models.CharField(max_length=255)

    sender = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    snippet = models.TextField(blank=True)
    body = models.TextField(blank=True)

    received_at = models.DateTimeField()

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="emails"
    )

    priority = models.CharField(max_length=20, blank=True)
    summary = models.TextField(blank=True)

    is_processed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Action(models.Model):
    email = models.ForeignKey(
        Email,
        on_delete=models.CASCADE,
        related_name="actions"
    )

    description = models.TextField()
    deadline = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Draft(models.Model):
    email = models.ForeignKey(
        Email,
        on_delete=models.CASCADE,
        related_name="drafts"
    )

    body = models.TextField()

    status = models.CharField(
        max_length=30,
        default="pending_approval"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ActivityLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activity_logs"
    )

    event = models.CharField(max_length=100)
    details = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)