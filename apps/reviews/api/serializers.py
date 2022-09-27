from rest_framework import serializers
from apps.reviews.models import Review
from apps.reviews.utils import formatearFecha

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

    def to_representation(self, instance):        
        return {
            'id':instance.id,
            'user':instance.user.get_username(),
            'rating':instance.rating,
            'comment':instance.comment if instance.comment is not None else '',
            'date_created':formatearFecha(instance.date_created)
        }

class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        exclude = ('user','date_created')