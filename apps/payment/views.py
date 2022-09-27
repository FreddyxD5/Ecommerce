import logging
from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.cart.models import Cart, CartItem
from apps.coupons.models import FixedPriceCoupon, PercentPriceCoupon
from apps.orders.models import Order, OrderItem
from apps.shipping.models import Shipping
from apps.product.models import Product

from django.core.mail import send_mail
import braintree

logger = logging.getLogger(__name__)


# Create your views here.


gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=settings.BT_ENVIRONMENT,
        merchant_id=settings.BT_MERCHANT_ID,
        public_key=settings.BT_PUBLIC_KEY,
        private_key=settings.BT_PRIVATE_KEY
    )
)


class GenerateTokenView(APIView):
    def get(self, request, format=None):
        try:
            token = gateway.client_token.generate()
            return Response({
                'braintree_token': token
            }, status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'something went wrong retrieving braintree token'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetPaymentTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user
        tax = 0.18

        shipping_id = request.query_params.get('shipping_id')
        shipping_id = str(shipping_id)

        coupon_name = request.query_params.get('coupon_name')
        coupon_name = str(coupon_name)

        try:
            cart = Cart.objects.get(user=user)
            if not CartItem.objects.filter(cart=cart).exists():
                return Response({
                    'error': 'Something wrnt wrong'
                }, status=status.HTTP_404_NOT_FOUND)

            cart_items = CartItem.objects.filter(cart=cart)

            for cart_item in cart_items:
                if not Product.objects.filter(id=cart_item.product.id).exists():
                    return Response({
                        'error': 'A product with ID provided doesn\'t exists'
                    }, status=status.HTTP_404_NOT_FOUND)
                if int(cart_item.count) > int(cart_item.product.quantity):
                    return Response({
                        'error': 'Not enough items in stock'
                    }, status=status.HTTP_200_OK)
                total_amount = 0.0
                total_compare_amount = 0.0
                for cart_item in cart_items:
                    total_amount += (float(cart_item.product.price)
                                     * float(cart_item.count))
                    total_compare_amount += (
                        float(cart_item.product.compare_price)*float(cart_item.count))

                total_compare_amount = round(total_compare_amount, 2)
                original_price = round(total_amount, 2)

                # Coupones
                # ======
                if coupon_name != '':
                    # We check if this coupon have a fixed price
                    if FixedPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                        fixed_price_coupon = FixedPriceCoupon.objects.get(
                            name=coupon_name)
                        discount_amount = float(
                            fixed_price_coupon.discount_price)

                        if (discount_amount < total_amount):
                            total_amount -= discount_amount
                            total_after_coupon = total_amount

                    elif PercentPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                        percentage_coupon = PercentPriceCoupon.objects.get(
                            name=coupon_name)
                        discount_percentage = float(
                            percentage_coupon.discount_percentage)

                        if discount_percentage > 1 and discount_percentage < 100:
                            total_amount -= (total_amount *
                                             (discount_percentage/100))
                            total_after_coupon = total_amount

                # Total despues de aplicar el cupon
                total_after_coupon = round(total_after_coupon, 2)

                # impuesto estimado
                estimated_tax = round(total_amount*tax, 2)
                total_amount += estimated_tax

                shipping_cost = 0.0
                # Verificar que el envio sea valido
                if Shipping.objects.filter(id__iexact=shipping_id).exists():
                    shipping = Shipping.objects.get(id=shipping_id)
                    shipping_cost = shipping.price
                    total_amount += float(shipping_cost)

                total_amount = round(total_amount, 2)

                return Response({
                    'original_price': f'{original_price:.2f}',
                    'total_amount': f'{total_amount:.2f}',
                    'total_after_coupon': f'{total_after_coupon:.2f}',
                    'total_compare_amount': f'{total_compare_amount:.2f}',
                    'estimated_tax': f'{estimated_tax:.2f}',
                    'shipping_cost': f'{shipping_cost:.2f}'
                }, status=status.HTTP_200_OK)
        except:
            return Response({
                'error': 'something went wrong retrieving total payment information'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProcessPaymentView(APIView):
    def post(self, request, format=None):
        user = self.request.user
        data = self.request.data
        tax = 0.18

        nonce = data['nonce']
        shipping_id = str(data['shipping_id'])
        coupon_name = str(data['coupon_name'])
        # Coupon none

        full_name = data['full_name']
        address_line_1 = data['address_line_1']
        address_line_2 = data['address_line_2']
        city = data['city']
        state_province_region = data['state_province_region']
        postal_zip_code = data['postal_zip_code']
        country_region = data['country_region']
        telephone_number = data['telephone_number']

        if not Shipping.objects.filter(id__iexact=shipping_id).exists():
            return Response({
                'error': 'Invalid shipping option'
            }, status=status.HTTP_404_NOT_FOUND)

        cart = Cart.objects.get(user=user)

        if not CartItem.objects.filter(cart=cart).exists():
            return Response({
                'error': 'Need to have items in your cart'
            }, status=status.HTTP_404_NOT_FOUND)

        cart_items = CartItem.objects.filter(cart=cart)

        for cart_item in cart_items:
            if not Product.objects.filter(id=cart_item.product.id).exists():
                return Response({
                    'error': 'transaction failed, a product with this ID doesn\'t  exists'
                }, status=status.HTTP_404_NOT_FOUND)

            if int(cart_item.count) > int(cart_item.product.quantity):
                return Response({
                    'error': 'Not enough items in stack'
                }, status=status.HTTP_200_OK)

        total_amount = 0.0

        for cart_item in cart_items:
            total_amount += (float(cart_item.count) *
                             float(cart_item.product.price))

        if coupon_name != '':
            # We check if this coupon have a fixed price
            if FixedPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                fixed_price_coupon = FixedPriceCoupon.objects.get(
                    name=coupon_name)
                discount_amount = float(fixed_price_coupon.discount_price)

                if (discount_amount < total_amount):
                    total_amount -= discount_amount                    

            elif PercentPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                percentage_coupon = PercentPriceCoupon.objects.get(
                    name=coupon_name)
                discount_percentage = float(
                    percentage_coupon.discount_percentage)

                if discount_percentage > 1 and discount_percentage < 100:
                    total_amount -= (total_amount *
                                        (discount_percentage/100))                    

        total_amount += (total_amount*tax)

        shipping = Shipping.objects.get(id=int(shipping_id))

        shipping_name = shipping.name
        shipping_time = shipping.time_to_delivery
        shipping_price = shipping.price

        total_amount += float(shipping_price)
        total_amount = round(total_amount, 2)

        try:
            newTransaction = gateway.transaction.sale({
                'amount': str(total_amount),
                'payment_method_nonce': str(nonce['nonce']),
                'options': {
                    'submit_for_settlement': True
                }
            })
        except:
            return Response({

            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if newTransaction.is_success or newTransaction.transaction:
            print('nani?')
            for cart_item in cart_items:
                update_product = Product.objects.get(id=cart_item.product.id)

                # Encontrar cantidad despues de compra
                quantity = int(update_product.quantity) - int(cart_item.count)

                # obtener cantidad de producto a vender
                sold = int(update_product.sold) + int(cart_item.count)

                # update product
                Product.objects.filter(id=cart_item.product.id).update(
                    quantity=quantity, sold=sold
                )
            print('Try to create order')
            try:
                print('All the fields')
                print(user)
                print(newTransaction.transaction.id)
                print(total_amount)
                print(full_name)
                print(address_line_1)
                print(city)
                print(state_province_region)
                print(postal_zip_code)
                print(country_region)
                print(telephone_number)
                print(shipping_name)
                print(shipping_time)
                print(shipping_price)

                order = Order.objects.create(
                    user=user,
                    transaction_id=newTransaction.transaction.id,
                    amount=total_amount,
                    full_name=full_name,
                    address_line_1=address_line_1,
                    address_line_2=address_line_2,
                    city=city,
                    state_province_region=state_province_region,
                    postal_zip_code=postal_zip_code,
                    country_region=country_region,
                    telephone_number=telephone_number,
                    shipping_name=shipping_name,
                    shipping_time=shipping_time,
                    shipping_price=float(shipping_price)

                )

                print('Here?')
            except:
                logger.exception('An exception was throw')
                logger.warning('ha pasado algo', exc_info=True)
                return Response({
                    'error': 'something went wrong retrieving total payment information'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print('Create order items')
            for cart_item in cart_items:
                try:
                    product = Product.objects.get(id=cart_item.product.id)

                    OrderItem.objects.create(
                        product=product,
                        order=order,
                        name=product.name,
                        price=cart_item.product.price,
                        count=cart_item.count
                    )
                except:
                    return Response({
                        'error': 'Transaction succeded and order create, but failed to create an order item'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            print('Trying sending email')
            try:
                send_mail(
                    'Your order Details',
                    'Hey' + full_name+','
                    + '\n\nWe recieved your order!'
                    + '\n\nGive us some time to proccess your order and ship it out to your'
                    + '\n\nSincerely'
                    + '\n\nShop Time',
                    'freddyxd5@gmail.com',
                    [user.email],
                    fail_silently=False
                )

            except:
                return Response({
                    'error': 'Transaction succeded and order create, but failed to send email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                CartItem.objects.filter(cart=cart).delete()
                Cart.objects.filter(user=user).update(total_item=0)
            except:
                return Response({
                    'error': 'Transaction succeeded and order successful, but failed to clear cart'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                'success': 'Transaction successful and order was created'
            }, status=status.HTTP_200_OK)

        else:
            logger.exception('asdsd', exc_info=True)
            return Response({
                'error': 'Transaction failed'
            }, status=status.HTTP_400_BAD_REQUEST)
