from apps.product.models import Product
from rest_framework import serializers
from apps.orders.models import Order, OrderItem

class ListOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            'status',
            'transaction_id',
            'amount',
            'shipping_price',
            'date_issued',
        )



class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name','price','count')


class ListOrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ('user', )
    

    def to_representation(self, instance):
        products = []
        order_items = OrderItem.objects.filter(order=instance.id)
        if order_items:
            products = OrderProductSerializer(order_items, many=True)
            products = products.data

        return {
            'id':instance.id,
            'status':instance.status,          
            'transaction_id':instance.transaction_id,
            'amount':instance.amount,
            'full_name':instance.full_name,
            'address_line_1':instance.address_line_1,
            'address_line_2':instance.address_line_2,
            'city':instance.city,
            'state_province_region':instance.state_province_region,
            'postal_zip_code':instance.postal_zip_code,
            'country_region':instance.country_region,
            'telephone_number':instance.telephone_numbe,
            'shipping_name':instance.shipping_name,
            'shipping_time':instance.shipping_time,
            'shipping_price':instance.shipping_price,
            'date_issued':instance.date_issued,
            'order_items':products

        }