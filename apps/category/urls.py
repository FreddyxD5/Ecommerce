from django.urls import path
from apps.category.views import CategoryViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
urlpatterns = []
router.register(r'', CategoryViewSet, basename='categories')


urlpatterns += router.urls
