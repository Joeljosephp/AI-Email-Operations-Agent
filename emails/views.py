from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Category
from .serializers import CategorySerializer


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

        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = CategorySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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