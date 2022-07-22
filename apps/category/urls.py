from django.urls import path
from apps.category.views import CategoryViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', CategoryViewSet, basename='categories')
urlpatterns = []

urlpatterns += router.urls
