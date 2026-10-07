from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Email, Action, Draft, ActivityLog

from .serializers import (
    CategorySerializer,
    EmailSerializer,
    ActionSerializer,
    DraftSerializer,
    ActivityLogSerializer,
)


def health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "Email Ops Agent backend is running"
    })


@api_view(["GET", "POST"])
def category_list(request):
    if request.method == "GET":
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    serializer = CategorySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["PATCH"])
def category_update(request, pk):
    try:
        category = Category.objects.get(
            pk=pk,
            user=request.user
        )
    except Category.DoesNotExist:
        return Response(
            {"detail": "Category not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CategorySerializer(
        category,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["DELETE"])
def category_delete(request, pk):
    try:
        category = Category.objects.get(
            pk=pk,
            user=request.user
        )
    except Category.DoesNotExist:
        return Response(
            {"detail": "Category not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    category.delete()

    return Response(
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(["GET", "POST"])
def email_list(request):

    if request.method == "GET":
        emails = Email.objects.filter(user=request.user)
        serializer = EmailSerializer(emails, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    serializer = EmailSerializer(data=request.data)

    if serializer.is_valid():
        category = serializer.validated_data.get("category")

        if category is not None and category.user != request.user:
            return Response(
                {"detail": "Category not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer.save(user=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["PATCH"])
def email_update(request, pk):
    try:
        email = Email.objects.get(
            pk=pk,
            user=request.user
        )
    except Email.DoesNotExist:
        return Response(
            {"detail": "Email not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = EmailSerializer(
        email,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        category = serializer.validated_data.get("category")

        if category is not None and category.user != request.user:
            return Response(
                {"detail": "Category not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["DELETE"])
def email_delete(request, pk):
    try:
        email = Email.objects.get(
            pk=pk,
            user=request.user
        )
    except Email.DoesNotExist:
        return Response(
            {"detail": "Email not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    email.delete()

    return Response(
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(["GET", "POST"])
def action_list(request):

    if request.method == "GET":
        actions = Action.objects.filter(
            email__user=request.user
        )

        serializer = ActionSerializer(actions, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    serializer = ActionSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data["email"]

        if email.user != request.user:
            return Response(
                {"detail": "Email not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["PATCH"])
def action_update(request, pk):

    try:
        action = Action.objects.get(
            pk=pk,
            email__user=request.user
        )
    except Action.DoesNotExist:
        return Response(
            {"detail": "Action not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ActionSerializer(
        action,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["DELETE"])
def action_delete(request, pk):

    try:
        action = Action.objects.get(
            pk=pk,
            email__user=request.user
        )
    except Action.DoesNotExist:
        return Response(
            {"detail": "Action not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    action.delete()

    return Response(
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(["GET", "POST"])
def draft_list(request):

    if request.method == "GET":
        drafts = Draft.objects.filter(
            email__user=request.user
        )

        serializer = DraftSerializer(drafts, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    serializer = DraftSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data["email"]

        if email.user != request.user:
            return Response(
                {"detail": "Email not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["PATCH"])
def draft_update(request, pk):

    try:
        draft = Draft.objects.get(
            pk=pk,
            email__user=request.user
        )
    except Draft.DoesNotExist:
        return Response(
            {"detail": "Draft not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = DraftSerializer(
        draft,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["DELETE"])
def draft_delete(request, pk):

    try:
        draft = Draft.objects.get(
            pk=pk,
            email__user=request.user
        )
    except Draft.DoesNotExist:
        return Response(
            {"detail": "Draft not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    draft.delete()

    return Response(
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(["GET"])
def activity_list(request):

    activities = ActivityLog.objects.filter(
        user=request.user
    ).order_by("-created_at")

    serializer = ActivityLogSerializer(
        activities,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )