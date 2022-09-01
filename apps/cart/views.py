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
    def get(self, request, format=None):
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
                    
                    total_items = int(cart.total_item) + 1                    
                    Cart.objects.filter(user=user).update(
                        total_item=total_items)
                    
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
                                        
                    return Response({'cart': result}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'NOt enough of this items'},
                                    status=status.HTTP_200_OK)            
            else:                
                return Response({'error': 'Else'},
                                    status=status.HTTP_200_OK)            


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
                    'total_compare_cost': total_compare_cost},
                    status=status.HTTP_200_OK)
            else:
                return Response({'cart':'No items yet'}, status=status.HTTP_200_OK)

        except:
            return Response({'error': 'Something went wrong when adding this product'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetItemTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        try:
            cart = Cart.objects.get(user=user)
            total_items = cart.total_item

            return Response({
                'total_items': total_items
            }, status=status.HTTP_200_OK)

        except:
            return Response({'error': 'Something went wrong with the server'},
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
            print('try 2')
            if not Product.objects.filter(id=product_id).exists():
                return Response({'error': 'This product doesn\'t exists'},
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
                return Response({'cart': result},
                                status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Not enough of this item in stock'
                }, status=status.HTTP_200_OK)

        except:
            return Response({
                'error': 'Something went wrong when updating cart item'
            }, status=status.HTTP_500_INTERVAL_SERVER_ERROR)


class RemoveItem(APIView):
    def delete(self, request, format=None):
        user = self.request.user
        data = self.request.data        
        try:
            product_id = int(data['product_id'])

        except:
            return Response({'error': 'Product ID must be an integer'}, status=status.HTTP_404_NOT_FOUND)

        try:
            if not Product.objects.filter(id=product_id).exists():
                return Response({
                    'error': 'This product does not exists'
                }, status=status.HTTP_404_NOT_FOUND)
                         
            product = Product.objects.get(id=product_id)
            cart = Cart.objects.get(user=user)            
            if not CartItem.objects.filter(cart=cart, product=product).exists():
                return Response({
                    'error': 'This product is not in your cart'
                }, status=status.HTTP_404_NOT_FOUND)            
            CartItem.objects.filter(cart=cart, product=product).delete()

            if not CartItem.objects.filter(cart=cart, product=product).exists():
                # Update total items in cart
                total_items = int(cart.total_item) - 1
                Cart.objects.filter(user=user).update(total_item=total_items)

            cart_items = CartItem.objects.order_by('product').filter(cart=cart)            
            result = []
            if CartItem.objects.filter(cart=cart).exists():
                for cart_item in cart_items:
                    item = {}
                    item['id'] = cart_item.id
                    item['count'] = cart_item.count
                    product = Product.objects.get(id=cart_item.product.id)
                    product = ProductSerializer(product)

                    item['product'] = product.data
                    result.append(item)
                return Response({'cart': result},
                                status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'Something went wrong when updating cart item'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmptyCartView(APIView):
    def delete(self, request, format=None):
        user = self.request.user

        try:
            cart = Cart.objects.get(user=user)
            if not CartItem.objects.filter(cart=cart).exists():
                return Response({
                    'success': 'Cart is already empty'
                }, status=status.HTTP_200_OK)

            # Actualizamos carrito
            Cart.objects.filter(user=user).update(total_item=0)
            CartItem.objects.filter(cart__user=user).delete()

            return Response({
                'success': 'Cart emptied successfully'
            }, status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'Something went wrong when updating cart item'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SynchCartView(APIView):
    def put(self, request, format=None):
        user = self.request.user
        data = self.request.data

        try:
            cart_items = data['cart_items']

            for cart_item in cart_items:
                cart = Cart.objects.get(user=user)

                try:
                    product_id = int(cart_item['product_id'])
                except:
                    return Response({
                        'error': 'Product ID must be an Integer'
                    }, status=status.HTTP_404_NOT_FOUND)

                if not Product.objects.filter(id=product_id).exists():
                    return Response({
                        'error': 'There\'s no product with this id'
                    }, status=status.HTTP_404_NOT_FOUND)

                product = Product.objects.get(id=product_id)
                quantity = product.quantity

                if CartItem.objects.filter(cart=cart, product=product).exists():
                    # Actualizamos el item del carrito
                    item = CartItem.objects.get(cart=cart, product=product)
                    count = item.count

                    try:
                        cart_item_count = int(cart_item['count'])
                    except:
                        cart_item_count = 1

                    # check with database

                    if (cart_item_count + int(count)) <= int(quantity):
                        update_count = cart_item_count + int(count)
                        CartItem.object.filter(
                            cart=cart, product=product
                        ).update(count=update_count)
                else:
                    # Agregae el item al carrito del usuario

                    try:
                        cart_item_count = int(cart_item['count'])
                    except:
                        cart_item_count = 1

                    if cart_item_count <= quantity:
                        CartItem.objects.create(
                            product=product, cart=cart,
                            count=cart_item_count
                        )

                        if CartItem.objects.filter(cart=cart, product=product).exists():
                            # Sumar item
                            total_items = int(cart.total_items)+1
                            Cart.objects.filter(user=user).update(
                                total_item=total_items
                            )

                return Response(
                     {
                        'message': 'Cart Synchronized'
                    }, status=status.HTTP_200_OK)

        except:
            return Response({
                'error': 'Something went wrong when updating cart item'
            }, status=status.HTTP_500_INTERVAL_SERVER_ERROR)
