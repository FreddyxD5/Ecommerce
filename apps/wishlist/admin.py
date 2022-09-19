from django.contrib import admin
from apps.wishlist.models import Wishlist, WishListItem
# Register your models here.
admin.site.register(Wishlist)
admin.site.register(WishListItem)