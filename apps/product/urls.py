from django.urls import path
from apps.product.views import (
    ListBySearchView, ProductDetailView,ProductListView,
    ListSearchView,ListRelatedView, ProductViewSet)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()


urlpatterns = [
    path('detail/<productId>', ProductDetailView.as_view(), name='product_detail'),
    path('get-products', ProductListView.as_view(), name='product_list'),
    path('search', ListSearchView.as_view(), name='search_products'),
    path('related/<productId>', ListRelatedView.as_view(), name='related_products'),
    path('by/search', ListBySearchView.as_view(), name='search_by'),    
]

# router.register(r'new_product_api', ProductViewSet, basename='product')
# urlpatterns += router.urls