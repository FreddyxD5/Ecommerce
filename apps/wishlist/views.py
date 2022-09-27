from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.wishlist.api.serializers import WishListSerializer

from apps.product.models import Product
from apps.wishlist.models import WishListItem, Wishlist
# Create your views here.


class GetWishlistView(APIView):
    def get(self, request):
        user = self.request.user
        try:
            wishlist = Wishlist.objects.get(user=user)
            wishlist = WishListSerializer(wishlist)

            return Response({
                'wishlist': wishlist.data
            }, status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'there was a error with the server'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddItemView(APIView):
    def post(self, request):
        user = self.request.user
        data = self.request.data

        try:
            product_id = int(data['product_id'])
        except:
            return Response({
                'error': 'Product ID must be an integer'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            if not Product.objects.filter(id=product_id).exists():
                return Response({'error': 'This product doesn\'t exists'
                                 }, status=status.HTTP_404_NOT_FOUND)

            product = Product.objects.get(id=product_id)
            wishlist = Wishlist.objects.get(user=user)

            # Added Item
            if WishListItem.objects.filter(wishlist=wishlist, product=product).exists():
                return Response({
                    'error': 'This item is already on your wishlist'
                }, status=status.HTTP_200_OK)
            else:
                wishlist_item = WishListItem.objects.create(
                    wishlist=wishlist, product=product)

            wishlist = WishListSerializer(wishlist)
            return Response({
                'wishlist': wishlist.data
            }, status=status.HTTP_201_CREATED)

        except:
            return Response({
                'error': 'there was a error with the server'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetItemTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        try:
            wishlist = Wishlist.objects.get(user=user)
            return Response({
                'total_items': wishlist.total_items()
            }, status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'there was a error with the server'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RemoveItemView(APIView):
    def delete(self, request, format=None):
        user = self.request.user
        data = self.request.data

        try:
            product_id = int(data['product_id'])
        except:
            return Response({
                'error': 'There was an error with the server'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            wishlist_instance = Wishlist.objects.get(user=user)
            product = Product.objects.get(id=product_id)

            if WishListItem.objects.filter(wishlist=wishlist_instance, product=product).exists():
                WishListItem.objects.filter(
                    wishlist=wishlist_instance, product=product).delete()
                wishlist = WishListSerializer(wishlist_instance)
                return Response({
                    'wishlist': wishlist.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'hay un error encontrando el producto'
                }, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response({
                'error': 'There was an error with the server'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
