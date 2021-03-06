from re import S
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from apps.cart.models import Cart, CartItem
from apps.product.models import Product
from apps.product.api.serializers import ProductSerializer


# Create your views here.

class GetItemsView(APIView):
    def get_user(self, request, format=None):
        user = self.request.user

        try:
            cart = Cart.objects.get(user=user)
            car_items = CartItem.objects.order_by('product').filter(cart=cart)

            result = []
            if CartItem.objects.filter(cart=cart).exists():
                for cart_item in car_items:
                    item = {}
                    item['id'] = cart_item.id
                    item['count'] = cart_item.count
                    product = Product.objects.get(id=cart_item.product.id)
                    product = ProductSerializer(product)

                    item['product'] = product.data
                    result.append(item)

            return Response({'cart': result}, status=status.HTTP_200_OK)

        except:
            return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddItemView(APIView):
    def post(self, request, format=None):
        user = self.request.user
        data = self.request.data

        try:
            product_id = int(data['product_id'])
        except:
            return Response({'error': 'Product ID must be an Integer'}, status=status.HTTP_404_NOT_FOUND)

        count = 1
        try:
            if not Product.objects.filter(id=product_id).exists():
                return Response({'error': 'This product does not exists'}, status=status.HTTP_404_NOT_FOUND)

            product = Product.objects.get(id=product_id)

            cart = Cart.objects.get(user=user)

            if CartItem.objects.filter(cart=cart, product=product).exists():
                return Response({'error': 'Item is already in cart'}, status=status.HTTP_409_CONFLICT)

            if int(product.quantity) > 0:
                CartItem.objects.create(
                    product=product,
                    cart=cart,
                    count=count
                )
                if CartItem.objects.filter(cart=cart, product=product).exists():
                    total_items = int(cart.total_items) + 1
                    Cart.objects.filter(user=user).update(
                        total_items=total_items)

                    cart_items = CartItem.objects.order_by(
                        'product').filter(cart=cart)
                    result = []

                    for cart_item in cart_items:
                        item = {}
                        item['id'] = cart_item.id
                        item['count'] = cart_item.count
                        product = Product.objects.get(id=cart_item.product.id)
                        product = ProductSerializer(product)

                        item['product'] = product.data
                        result.append(item)

                    return Response({'cart': result}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'NOt enough of this items'},
                                    status=status.HTTP_200_OK)
            else:
                CartItem.objects.get

        except:
            return Response({'error': 'Something went wrong when adding this product'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        try:
            cart = Cart.objects.get(user=user)
            cart_items = CartItem.objects.filter(cart=cart)

            total_cost = 0.0
            total_compare_cost = 0.0

            if cart_items.exists():
                for cart_item in cart_items:
                    total_cost += (float(cart_item.product.price)
                                   * float(cart_item.count))
                    total_compare_cost += (float(cart_item.product.compare_price)
                                           * float(cart_item.count))

                total_cost = round(total_cost, 2)
                total_compare_cost = round(total_compare_cost, 2)
                return Response({
                    'total_cost': total_cost,
                    'toal_compare_cost': total_compare_cost},
                    status=status.HTTP_200_OK)

        except:
            return Response({'error': 'Something went wrong when adding this product'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetItemTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        try:
            cart = Cart.objects.get(user=user)
            total_items = cart.total_items

            return Response({
                'total_items': total_items
            }, status=status.HTTP_200_OK)

        except:
            return Response({'error': 'Something went wrong when adding this product'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateItemView(APIView):
    def put(self, request, format=None):
        user = self.request.user
        data = self.request.data

        try:
            product_id = int(data['product_id'])

        except:
            return Response({'error': 'Something went wrong when adding this product'},
                            status=status.HTTP_404_NOT_FOUND)

        try:
            count = int(data['count'])
        except:
            return Response({'error': 'Count value must be an integer'},
                            status=status.HTTP_404_NOT_FOUND)

        try:
            if not Product.objects.filter(id=product_id).exists():
                return Response({'error': 'This product doesnot exists'},
                                status=status.HTTP_404_NOT_FOUND)

            product = Product.objects.get(id=product_id)
            cart = Cart.objects.get(user=user)

            if not CartItem.objects.filter(cart=cart, product=product).exists():
                return Response({'error': 'This item is not in your cart'},
                                status=status.HTTP_404_NOT_FOUND)

            quantity = product.quantity

            if count <= quantity:
                CartItem.objects.filter(
                    product=product,
                    cart=cart
                ).update(count=count)

                cart_items = CartItem.objects.order_by(
                    'product').filter(cart=cart)
                result = []

                for cart_item in cart_items:
                    item = {}
                    item['id'] = cart_item.id
                    item['count'] = cart_item.count
                    product = Product.objects.get(id=cart_item.product.id)
                    product = ProductSerializer(product)

                    item['product'] = product.data
                    result.append(item)
                return Response({'cart':result},
                                status=status.HTTP_200_OK)
            else:
                return Response({
                    'error':'Not enough of this item in stock'
                }, status=status.HTTP_200_OK)

        except:
            return Response({
                'error':'Something went wrong when updating cart item'
                }, status=status.HTTP_500_INTERVAL_SERVER_ERROR)


class RemoveItem(APIView):
    def delete(self, request, format=None):
        user = self.request.user
        data = self.request.data

        try:
            product_id = int(data['product_id'])

        except:
            return Response({'error':'Product ID must be an integer'}, status=status.HTTP_404_NOT_FOUND)

        try:
            if not Product.objects.filter(id=product_id).exists():
                return Response({
                    'error':'This product does not exists'
                    }, status = status.HTTP_404_NOT_FOUND)
            
            product = Product.objects.get(id=product_id)
            cart = Cart.objects.filter(user=user)

            if not CartItem.objects.filter(cart=cart, product=product).exists():
                return Response({
                    'error':'This product is not in your cart'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            CartItem.objects.filter(cart=cart, product=product).delete()

            if not CartItem.objects.filter(cart=cart, product=product).exists():
                #Update total items in cart
                total_items = int(cart.total_items) - 1
                Cart.objects.filter(user=user).update(total_items=total_items)

            cart_items = CartItem.objects.order_by('product').filter(cart=cart)

            result= []
            if CartItem.objects.filter(cart=cart).exists():
                for cart_item in cart_items:
                    item = {}
                    item['id'] = cart_item.id
                    item['count'] = cart_item.count
                    product = Product.objects.get(id=cart_item.product.id)
                    product = ProductSerializer(product)

                    item['product'] = product.data
                    result.append(item)
                return Response({'cart':result},
                                status=status.HTTP_200_OK)
        except:
            return Response({
                'error':'Something went wrong when updating cart item'
                }, status=status.HTTP_500_INTERVAL_SERVER_ERROR) 
        

class EmptyCartView(APIView):
    def delete(self, request, format=None):
        user = self.request.user

        try:
            cart=Cart.objects.get(user=user)
            if not CartItem.objects.filter(cart=cart).exists():
                return Response({
                    'success':'Cart is already empty'
                    }, status=status.HTTP_200_OK)
            #ACtualiza
            Cart.objects.filter(user=user).update(total_items=0)
            return Response({
                    'success':'Cart is already empty'
                    }, status=status.HTTP_200_OK)
        except:
            return Response({
                'error':'Something went wrong when updating cart item'
                }, status=status.HTTP_500_INTERVAL_SERVER_ERROR)