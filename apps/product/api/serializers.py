from rest_framework import serializers
from apps.product.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields='__all__'

    def to_representation(self, instance):
        return {        
            'id':instance.id,
            'name':instance.name,
            'image':'',
            'description':instance.description,
            'price':instance.price,
            'compare_price':instance.compare_price,
            'category':instance.category.name,
            'quantity':instance.quantity,
            'date_created':''
        }
