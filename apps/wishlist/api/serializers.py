from rest_framework import serializers
from apps.product.models import Product
from apps.wishlist.models import Wishlist, WishListItem



class WishListProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id','name','image','price',)

class WishListItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = WishListItem
        fields = "__all__"

    def to_representation(self, instance):
        product = []
        if instance.product is not None:
            product = WishListProductSerializer(instance.product)
            product = product.data
        return {
            'id':instance.id,
            'product':product
        }

class WishListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = "__all__"

    def to_representation(self, instance):
        wishlist_items = []
        if WishListItem.objects.filter(wishlist = instance.id).exists():
            wishlist_items = WishListItem.objects.filter(wishlist = instance.id)
            wishlist_items = WishListItemSerializers(wishlist_items, many=True)
            wishlist_items = wishlist_items.data


        return {
            'id':instance.id,
            'total_item':instance.total_item,
            'items':wishlist_items
        }


