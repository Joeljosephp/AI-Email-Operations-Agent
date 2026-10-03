from django.urls import path

from .views import health_check, category_list, category_update, category_delete

urlpatterns = [
    path('health/', health_check),
    path('categories/', category_list),
    path('categories/<int:pk>/', category_update),
    path('categories/<int:pk>/delete/', category_delete),
]