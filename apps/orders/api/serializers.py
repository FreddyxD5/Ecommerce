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
            'address_line_1',
            'address_line_2',
            'shipping_time'
            
        )

class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id','name','price',)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('name','price','count',)

    def to_representation(self, instance):
        product =  []
        if instance.product is not None:
            product = Product.objects.get(id = instance.product.id)
            product = OrderProductSerializer(product)
            product = product.data

        return {
            'name':instance.name,
            'price':instance.price,
            'count':instance.count,
            'product':product
        }


class ListOrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ('user', )
            

    def to_representation(self, instance):
        print('HEre')
        products = []
        order_items = OrderItem.objects.filter(order=instance.id)
        if order_items:                        
            products = OrderItemSerializer(order_items, many=True)            
            products = products.data

        print(instance.id)
        return {
            'id':instance.id,
            'status':instance.status,          
            'transaction_id':instance.transaction_id,
            'amount':instance.amount,
            'full_name':instance.full_name,
            'address_line_1':instance.address_line_1 if instance.address_line_1 is not None else '',
            'address_line_2':instance.address_line_2 if instance.address_line_2 is not None else '',
            'city':instance.city if instance.city is not None else '',
            'state_province_region':instance.state_province_region if instance.state_province_region is not None else '',
            'postal_zip_code':instance.postal_zip_code if instance.postal_zip_code is not None else '',
            'country_region':instance.country_region if instance.country_region is not None else '',
            'telephone_number':instance.telephone_number if instance.telephone_number is not None else '',
            'shipping_name':instance.shipping_name if instance.shipping_name is not None else '',
            'shipping_time':instance.shipping_time if instance.shipping_time is not None else '',
            'shipping_price':instance.shipping_price if instance.shipping_price is not None else '',
            'date_issued':instance.date_issued if instance.date_issued is not None else '',
            'order_items':products,
        }