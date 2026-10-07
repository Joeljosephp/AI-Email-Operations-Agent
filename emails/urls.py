from django.urls import path

from .views import (
    health_check,
    register,
    me,
    category_list,
    category_update,
    category_delete,
    email_list,
    email_update,
    email_delete,
    action_list,
    action_update,
    action_delete,
    draft_list,
    draft_update,
    draft_delete,
    activity_list,
)

urlpatterns = [
    # Public endpoints
    path('health/', health_check),
    path('auth/register/', register),

    # Authenticated user
    path('auth/me/', me),

    # Categories
    path('categories/', category_list),
    path('categories/<int:pk>/', category_update),
    path('categories/<int:pk>/delete/', category_delete),

    # Emails
    path('emails/', email_list),
    path('emails/<int:pk>/', email_update),
    path('emails/<int:pk>/delete/', email_delete),

    # Actions
    path('actions/', action_list),
    path('actions/<int:pk>/', action_update),
    path('actions/<int:pk>/delete/', action_delete),

    # Drafts
    path('drafts/', draft_list),
    path('drafts/<int:pk>/', draft_update),
    path('drafts/<int:pk>/delete/', draft_delete),

    # Activity
    path('activity/', activity_list),
]