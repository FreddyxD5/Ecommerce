from django.urls import path
from apps.wishlist.views import (
    RemoveItemView, AddItemView,
    GetItemTotalView,GetWishlistView
    )

urlpatterns = [
    path('wishlist_items',GetWishlistView.as_view()),
    path('add_item', AddItemView.as_view()),
    path('remove_item', RemoveItemView.as_view()),
    path('get_item_total',GetItemTotalView.as_view()),

    
]
